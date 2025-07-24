<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Application\Settings\SettingsInterface;
use Predis\Client as RedisClient;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface as Middleware;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as SlimResponse;

class RateLimitMiddleware implements Middleware
{
    private RedisClient $redis;
    private SettingsInterface $settings;

    public function __construct(RedisClient $redis, SettingsInterface $settings)
    {
        $this->redis = $redis;
        $this->settings = $settings;
    }

    public function process(Request $request, RequestHandler $handler): Response
    {
        $rateLimitSettings = $this->settings->get('rate_limit');
        
        // Skip rate limiting if disabled
        if (!$rateLimitSettings['enabled']) {
            return $handler->handle($request);
        }

        $clientIp = $this->getClientIp($request);
        
        // Check if IP is whitelisted
        $whitelist = explode(',', $rateLimitSettings['whitelist'] ?? '');
        if (in_array($clientIp, $whitelist)) {
            return $handler->handle($request);
        }

        $key = "rate_limit:{$clientIp}";
        $maxRequests = (int) $rateLimitSettings['requests'];
        $period = (int) $rateLimitSettings['period']; // seconds

        // Get current request count
        $currentCount = $this->redis->get($key);
        
        if ($currentCount === null) {
            // First request in this period
            $this->redis->setex($key, $period, 1);
            $remaining = $maxRequests - 1;
            $resetTime = time() + $period;
        } else {
            $currentCount = (int) $currentCount;
            
            if ($currentCount >= $maxRequests) {
                // Rate limit exceeded
                $ttl = $this->redis->ttl($key);
                $resetTime = time() + $ttl;
                
                return $this->rateLimitExceededResponse($maxRequests, 0, $resetTime);
            }
            
            // Increment counter
            $this->redis->incr($key);
            $remaining = $maxRequests - ($currentCount + 1);
            $ttl = $this->redis->ttl($key);
            $resetTime = time() + $ttl;
        }

        // Process request
        $response = $handler->handle($request);
        
        // Add rate limit headers
        return $response
            ->withHeader('X-RateLimit-Limit', (string) $maxRequests)
            ->withHeader('X-RateLimit-Remaining', (string) max(0, $remaining))
            ->withHeader('X-RateLimit-Reset', (string) $resetTime);
    }

    private function getClientIp(Request $request): string
    {
        // Check for IP from various headers
        $serverParams = $request->getServerParams();
        
        $ipHeaders = [
            'HTTP_CF_CONNECTING_IP',     // Cloudflare
            'HTTP_CLIENT_IP',            // Proxy
            'HTTP_X_FORWARDED_FOR',      // Load balancer/proxy
            'HTTP_X_FORWARDED',          // Proxy
            'HTTP_X_CLUSTER_CLIENT_IP',  // Cluster
            'HTTP_FORWARDED_FOR',        // Proxy
            'HTTP_FORWARDED',            // Proxy
            'REMOTE_ADDR'                // Standard
        ];

        foreach ($ipHeaders as $header) {
            if (!empty($serverParams[$header])) {
                $ip = trim(explode(',', $serverParams[$header])[0]);
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $ip;
                }
            }
        }

        return $serverParams['REMOTE_ADDR'] ?? '0.0.0.0';
    }

    private function rateLimitExceededResponse(int $limit, int $remaining, int $resetTime): Response
    {
        $response = new SlimResponse();
        $response->getBody()->write(json_encode([
            'error' => true,
            'message' => 'Rate limit exceeded',
            'code' => 'RATE_LIMIT_EXCEEDED',
            'details' => [
                'limit' => $limit,
                'remaining' => $remaining,
                'reset_time' => $resetTime,
                'retry_after' => $resetTime - time()
            ]
        ]));
        
        return $response
            ->withStatus(429)
            ->withHeader('Content-Type', 'application/json')
            ->withHeader('X-RateLimit-Limit', (string) $limit)
            ->withHeader('X-RateLimit-Remaining', (string) $remaining)
            ->withHeader('X-RateLimit-Reset', (string) $resetTime)
            ->withHeader('Retry-After', (string) ($resetTime - time()));
    }
}
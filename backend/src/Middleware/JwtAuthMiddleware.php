<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Services\JwtService;
use Predis\Client as RedisClient;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface as Middleware;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as SlimResponse;

class JwtAuthMiddleware implements Middleware
{
    private ContainerInterface $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function process(Request $request, RequestHandler $handler): Response
    {
        $authHeader = $request->getHeaderLine('Authorization');
        
        if (empty($authHeader)) {
            return $this->unauthorizedResponse('Missing Authorization header');
        }

        if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $this->unauthorizedResponse('Invalid Authorization header format');
        }

        $token = $matches[1];
        
        try {
            $jwtService = $this->container->get(JwtService::class);
            $redisClient = $this->container->get(RedisClient::class);
            
            // Decode and validate JWT
            $payload = $jwtService->decode($token);
            
            // Check if token is blacklisted
            $jti = $payload['jti'] ?? null;
            if ($jti && $redisClient->exists("blacklist:jwt:{$jti}")) {
                return $this->unauthorizedResponse('Token has been revoked');
            }

            // Add user info to request attributes
            $request = $request->withAttribute('user_id', $payload['user_id']);
            $request = $request->withAttribute('jti', $jti);
            $request = $request->withAttribute('token_payload', $payload);

            return $handler->handle($request);

        } catch (\Exception $e) {
            return $this->unauthorizedResponse('Invalid or expired token: ' . $e->getMessage());
        }
    }

    private function unauthorizedResponse(string $message): Response
    {
        $response = new SlimResponse();
        $response->getBody()->write(json_encode([
            'error' => true,
            'message' => $message,
            'code' => 'UNAUTHORIZED'
        ]));
        
        return $response
            ->withStatus(401)
            ->withHeader('Content-Type', 'application/json');
    }
}
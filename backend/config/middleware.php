<?php

declare(strict_types=1);

use App\Application\Settings\SettingsInterface;
use App\Middleware\JwtAuthMiddleware;
use App\Middleware\CorsMiddleware;
use App\Middleware\RateLimitMiddleware;
use App\Middleware\ValidationMiddleware;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\App;
use Slim\Middleware\ErrorMiddleware;
use Tuupola\Middleware\CorsMiddleware as TuupolaCorsMiddleware;

return function (App $app) {
    $container = $app->getContainer();
    $settings = $container->get(SettingsInterface::class);

    // Parse JSON bodies
    $app->addBodyParsingMiddleware();

    // Add Routing Middleware
    $app->addRoutingMiddleware();

    // CORS Middleware
    $corsSettings = $settings->get('cors');
    $app->add(new TuupolaCorsMiddleware([
        'origin' => explode(',', $corsSettings['allowed_origins']),
        'methods' => explode(',', $corsSettings['allowed_methods']),
        'headers.allow' => explode(',', $corsSettings['allowed_headers']),
        'headers.expose' => $corsSettings['exposed_headers'] ? explode(',', $corsSettings['exposed_headers']) : [],
        'credentials' => $corsSettings['supports_credentials'],
        'cache' => $corsSettings['max_age'],
    ]));

    // Rate Limiting Middleware (only if enabled)
    if ($settings->get('rate_limit.enabled')) {
        $app->add(new RateLimitMiddleware(
            $container->get(\Predis\Client::class),
            $settings
        ));
    }

    // Custom middleware for request logging
    $app->add(function (Request $request, RequestHandler $handler) use ($container) {
        $logger = $container->get(\Psr\Log\LoggerInterface::class);
        
        $startTime = microtime(true);
        $response = $handler->handle($request);
        $endTime = microtime(true);
        
        $duration = round(($endTime - $startTime) * 1000, 2);
        
        $logger->info('HTTP Request', [
            'method' => $request->getMethod(),
            'uri' => (string) $request->getUri(),
            'status' => $response->getStatusCode(),
            'duration_ms' => $duration,
            'ip' => $request->getServerParams()['REMOTE_ADDR'] ?? 'unknown',
            'user_agent' => $request->getHeaderLine('User-Agent'),
        ]);
        
        return $response;
    });

    // Error Handling Middleware
    $errorMiddleware = $app->addErrorMiddleware(
        $settings->get('displayErrorDetails'),
        $settings->get('logErrors'),
        $settings->get('logErrorDetails')
    );

    // Custom Error Handler
    $errorHandler = $errorMiddleware->getDefaultErrorHandler();
    $errorHandler->registerErrorRenderer('application/json', function ($exception, $displayErrorDetails) {
        $error = [
            'error' => true,
            'message' => $exception->getMessage(),
        ];

        if ($displayErrorDetails) {
            $error['details'] = [
                'type' => get_class($exception),
                'code' => $exception->getCode(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTraceAsString(),
            ];
        }

        return json_encode($error, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    });
};
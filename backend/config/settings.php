<?php

declare(strict_types=1);

use App\Application\Settings\Settings;
use App\Application\Settings\SettingsInterface;
use DI\ContainerBuilder;
use Monolog\Logger;

return function (ContainerBuilder $containerBuilder) {
    // Global Settings Object
    $containerBuilder->addDefinitions([
        SettingsInterface::class => function () {
            // Load environment variables
            $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
            $dotenv->load();

            return new Settings([
                'displayErrorDetails' => $_ENV['APP_DEBUG'] === 'true', // Should be set to false in production
                'logErrors' => true,
                'logErrorDetails' => true,
                'logger' => [
                    'name' => $_ENV['APP_NAME'] ?? 'SparkyFit API',
                    'path' => ($_ENV['LOG_PATH'] ?? __DIR__ . '/../logs') . '/app.log',
                    'level' => Logger::DEBUG,
                ],
                'app' => [
                    'name' => $_ENV['APP_NAME'] ?? 'SparkyFit API',
                    'version' => $_ENV['APP_VERSION'] ?? '1.0.0',
                    'environment' => $_ENV['APP_ENV'] ?? 'development',
                    'debug' => $_ENV['APP_DEBUG'] === 'true',
                    'timezone' => $_ENV['APP_TIMEZONE'] ?? 'UTC',
                    'locale' => $_ENV['APP_LOCALE'] ?? 'en_US',
                ],
                'database' => [
                    'driver' => 'mysql',
                    'host' => $_ENV['DB_HOST'] ?? 'localhost',
                    'port' => (int)($_ENV['DB_PORT'] ?? 3306),
                    'database' => $_ENV['DB_NAME'] ?? 'sparkyfit',
                    'username' => $_ENV['DB_USERNAME'] ?? 'root',
                    'password' => $_ENV['DB_PASSWORD'] ?? '',
                    'charset' => $_ENV['DB_CHARSET'] ?? 'utf8mb4',
                    'collation' => $_ENV['DB_COLLATION'] ?? 'utf8mb4_unicode_ci',
                    'prefix' => '',
                    'strict' => true,
                    'engine' => null,
                ],
                'redis' => [
                    'scheme' => 'tcp',
                    'host' => $_ENV['REDIS_HOST'] ?? '127.0.0.1',
                    'port' => (int)($_ENV['REDIS_PORT'] ?? 6379),
                    'password' => $_ENV['REDIS_PASSWORD'] ?? null,
                    'database' => (int)($_ENV['REDIS_DB'] ?? 0),
                ],
                'jwt' => [
                    'secret' => $_ENV['JWT_SECRET'] ?? 'your-secret-key',
                    'algorithm' => $_ENV['JWT_ALGORITHM'] ?? 'HS256',
                    'access_token_expire' => (int)($_ENV['JWT_ACCESS_TOKEN_EXPIRE'] ?? 3600),
                    'refresh_token_expire' => (int)($_ENV['JWT_REFRESH_TOKEN_EXPIRE'] ?? 2592000),
                    'issuer' => $_ENV['JWT_ISSUER'] ?? 'sparkyfit.ru',
                    'audience' => $_ENV['JWT_AUDIENCE'] ?? 'sparkyfit.ru',
                ],
                'cors' => [
                    'allowed_origins' => explode(',', $_ENV['CORS_ALLOWED_ORIGINS'] ?? '*'),
                    'allowed_methods' => explode(',', $_ENV['CORS_ALLOWED_METHODS'] ?? 'GET,POST,PUT,DELETE,OPTIONS'),
                    'allowed_headers' => explode(',', $_ENV['CORS_ALLOWED_HEADERS'] ?? 'Content-Type,Authorization'),
                    'credentials' => true,
                    'cache' => 86400,
                ],
                'mail' => [
                    'driver' => $_ENV['MAIL_DRIVER'] ?? 'smtp',
                    'host' => $_ENV['MAIL_HOST'] ?? 'localhost',
                    'port' => (int)($_ENV['MAIL_PORT'] ?? 587),
                    'username' => $_ENV['MAIL_USERNAME'] ?? '',
                    'password' => $_ENV['MAIL_PASSWORD'] ?? '',
                    'encryption' => $_ENV['MAIL_ENCRYPTION'] ?? 'tls',
                    'from' => [
                        'address' => $_ENV['MAIL_FROM_ADDRESS'] ?? 'noreply@sparkyfit.ru',
                        'name' => $_ENV['MAIL_FROM_NAME'] ?? 'SparkyFit',
                    ],
                ],
                'storage' => [
                    'driver' => $_ENV['STORAGE_DRIVER'] ?? 'local',
                    'path' => $_ENV['STORAGE_PATH'] ?? __DIR__ . '/../storage',
                    'upload_max_size' => (int)($_ENV['UPLOAD_MAX_SIZE'] ?? 10485760), // 10MB
                    'allowed_extensions' => explode(',', $_ENV['ALLOWED_EXTENSIONS'] ?? 'jpg,jpeg,png,gif'),
                ],
                'rate_limit' => [
                    'requests' => (int)($_ENV['RATE_LIMIT_REQUESTS'] ?? 100),
                    'window' => (int)($_ENV['RATE_LIMIT_WINDOW'] ?? 3600), // 1 hour
                ],
                'auto_update' => [
                    'enabled' => $_ENV['UPDATE_ENABLED'] === 'true',
                    'check_url' => $_ENV['UPDATE_CHECK_URL'] ?? '',
                    'download_url' => $_ENV['UPDATE_DOWNLOAD_URL'] ?? '',
                    'verify_ssl' => $_ENV['UPDATE_VERIFY_SSL'] !== 'false',
                    'backup_enabled' => $_ENV['UPDATE_BACKUP_ENABLED'] !== 'false',
                    'rollback_enabled' => $_ENV['UPDATE_ROLLBACK_ENABLED'] !== 'false',
                    'check_interval' => (int)($_ENV['UPDATE_CHECK_INTERVAL'] ?? 3600), // 1 hour
                ],
                'ai' => [
                    'enabled' => $_ENV['AI_ENABLED'] === 'true',
                    'provider' => $_ENV['AI_PROVIDER'] ?? 'ollama',
                    'api_url' => $_ENV['AI_API_URL'] ?? 'http://localhost:11434',
                    'model' => $_ENV['AI_MODEL'] ?? 'llama2',
                    'temperature' => (float)($_ENV['AI_TEMPERATURE'] ?? 0.7),
                    'max_tokens' => (int)($_ENV['AI_MAX_TOKENS'] ?? 1000),
                ],
                'cache' => [
                    'driver' => $_ENV['CACHE_DRIVER'] ?? 'redis',
                    'prefix' => $_ENV['CACHE_PREFIX'] ?? 'sparkyfit_',
                    'default_ttl' => (int)($_ENV['CACHE_DEFAULT_TTL'] ?? 3600),
                ],
                'security' => [
                    'bcrypt_rounds' => (int)($_ENV['BCRYPT_ROUNDS'] ?? 12),
                    'encryption_key' => $_ENV['ENCRYPTION_KEY'] ?? '',
                    'session_lifetime' => (int)($_ENV['SESSION_LIFETIME'] ?? 120),
                    'csrf_token_expire' => (int)($_ENV['CSRF_TOKEN_EXPIRE'] ?? 3600),
                ],
                'analytics' => [
                    'enabled' => $_ENV['ANALYTICS_ENABLED'] === 'true',
                    'track_api_calls' => true,
                    'track_errors' => true,
                    'track_performance' => true,
                ],
                'monitoring' => [
                    'health_check_enabled' => $_ENV['HEALTH_CHECK_ENABLED'] === 'true',
                    'metrics_enabled' => $_ENV['METRICS_ENABLED'] === 'true',
                ],
            ]);
        }
    ]);
};
<?php

declare(strict_types=1);

use App\Application\Settings\SettingsInterface;
use DI\ContainerBuilder;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Monolog\Processor\UidProcessor;
use Predis\Client as RedisClient;
use Psr\Container\ContainerInterface;
use Psr\Log\LoggerInterface;
use Illuminate\Database\Capsule\Manager as Capsule;

return function (ContainerBuilder $containerBuilder) {
    $containerBuilder->addDefinitions([
        LoggerInterface::class => function (ContainerInterface $c) {
            $settings = $c->get(SettingsInterface::class);

            $loggerSettings = $settings->get('logger');
            $logger = new Logger($loggerSettings['name']);

            $processor = new UidProcessor();
            $logger->pushProcessor($processor);

            $handler = new StreamHandler($loggerSettings['path'], $loggerSettings['level']);
            $logger->pushHandler($handler);

            return $logger;
        },

        RedisClient::class => function (ContainerInterface $c) {
            $settings = $c->get(SettingsInterface::class);
            $redisSettings = $settings->get('redis');

            return new RedisClient([
                'scheme' => $redisSettings['scheme'],
                'host' => $redisSettings['host'],
                'port' => $redisSettings['port'],
                'password' => $redisSettings['password'] ?: null,
                'database' => $redisSettings['database'],
            ]);
        },

        Capsule::class => function (ContainerInterface $c) {
            $settings = $c->get(SettingsInterface::class);
            $databaseSettings = $settings->get('database');

            $capsule = new Capsule();
            $capsule->addConnection([
                'driver' => $databaseSettings['driver'],
                'host' => $databaseSettings['host'],
                'port' => $databaseSettings['port'],
                'database' => $databaseSettings['database'],
                'username' => $databaseSettings['username'],
                'password' => $databaseSettings['password'],
                'charset' => $databaseSettings['charset'],
                'collation' => $databaseSettings['collation'],
                'prefix' => $databaseSettings['prefix'],
                'strict' => $databaseSettings['strict'],
                'engine' => $databaseSettings['engine'],
                'options' => [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ],
            ]);

            $capsule->setAsGlobal();
            $capsule->bootEloquent();

            return $capsule;
        },
    ]);
};
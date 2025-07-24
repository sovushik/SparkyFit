<?php

declare(strict_types=1);

use Illuminate\Database\Capsule\Manager as Capsule;
use App\Application\Settings\SettingsInterface;

return function (SettingsInterface $settings) {
    $capsule = new Capsule();

    // Конфигурация подключения к MySQL
    $capsule->addConnection([
        'driver' => $settings->get('database.driver'),
        'host' => $settings->get('database.host'),
        'port' => $settings->get('database.port'),
        'database' => $settings->get('database.database'),
        'username' => $settings->get('database.username'),
        'password' => $settings->get('database.password'),
        'charset' => $settings->get('database.charset'),
        'collation' => $settings->get('database.collation'),
        'prefix' => $settings->get('database.prefix'),
        'strict' => $settings->get('database.strict'),
        'engine' => $settings->get('database.engine'),
        'timezone' => $settings->get('database.timezone'),
        'options' => [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
        ],
    ], 'default');

    // Установка глобального резолвера
    $capsule->setAsGlobal();
    
    // Инициализация Schema Builder
    $capsule->bootEloquent();

    return $capsule;
};
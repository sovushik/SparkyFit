#!/usr/bin/env php
<?php

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use App\Application\Settings\Settings;
use App\Application\Settings\SettingsInterface;
use Illuminate\Database\Capsule\Manager as Capsule;

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Setup settings
$settings = new Settings([
    'database' => [
        'driver' => 'mysql',
        'host' => $_ENV['DB_HOST'] ?? 'localhost',
        'port' => (int)($_ENV['DB_PORT'] ?? 3306),
        'database' => $_ENV['DB_DATABASE'] ?? 'sparkyfit',
        'username' => $_ENV['DB_USERNAME'] ?? 'root',
        'password' => $_ENV['DB_PASSWORD'] ?? '',
        'charset' => $_ENV['DB_CHARSET'] ?? 'utf8mb4',
        'collation' => $_ENV['DB_COLLATION'] ?? 'utf8mb4_unicode_ci',
        'prefix' => '',
        'strict' => true,
        'engine' => null,
    ]
]);

// Initialize database connection
$capsule = new Capsule();
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
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ],
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

// Create migrations table if it doesn't exist
$schema = Capsule::schema();
if (!$schema->hasTable('migrations')) {
    $schema->create('migrations', function ($table) {
        $table->id();
        $table->string('migration');
        $table->integer('batch');
    });
    echo "✅ Created migrations table\n";
}

// Get list of migration files
$migrationFiles = glob(__DIR__ . '/../database/migrations/*.php');
sort($migrationFiles);

// Get executed migrations
$executedMigrations = Capsule::table('migrations')->pluck('migration')->toArray();

$batch = Capsule::table('migrations')->max('batch') + 1;

echo "🚀 Running database migrations...\n\n";

foreach ($migrationFiles as $file) {
    $filename = basename($file, '.php');
    
    if (in_array($filename, $executedMigrations)) {
        echo "⏭️  Skipping {$filename} (already executed)\n";
        continue;
    }

    echo "⚡ Running migration: {$filename}\n";

    try {
        $migration = require $file;
        $migration->up();
        
        // Record migration as executed
        Capsule::table('migrations')->insert([
            'migration' => $filename,
            'batch' => $batch
        ]);
        
        echo "✅ Successfully executed: {$filename}\n";
    } catch (Exception $e) {
        echo "❌ Error executing {$filename}: " . $e->getMessage() . "\n";
        exit(1);
    }
}

echo "\n🎉 All migrations completed successfully!\n";
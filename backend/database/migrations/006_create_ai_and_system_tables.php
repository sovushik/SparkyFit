<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Capsule\Manager as Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Таблица AI разговоров
        Schema::schema()->create('ai_conversations', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title')->nullable();
            $table->enum('status', ['active', 'archived', 'deleted'])->default('active');
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Индексы для производительности
            $table->index(['user_id', 'status']);
            $table->index(['last_message_at']);
        });

        // Таблица AI сообщений
        Schema::schema()->create('ai_messages', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('conversation_id')->constrained('ai_conversations')->onDelete('cascade');
            $table->enum('role', ['user', 'assistant', 'system']);
            $table->text('content');
            $table->json('metadata')->nullable(); // токены, модель, и т.д.
            $table->integer('tokens_used')->nullable();
            $table->decimal('processing_time', 8, 3)->nullable(); // секунды
            $table->timestamps();

            // Индексы для производительности
            $table->index(['conversation_id', 'created_at']);
            $table->index(['role']);
        });

        // Таблица системных обновлений
        Schema::schema()->create('system_updates', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('version');
            $table->string('title');
            $table->text('description');
            $table->text('changelog')->nullable();
            $table->enum('type', ['major', 'minor', 'patch', 'hotfix'])->default('minor');
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->boolean('requires_restart')->default(false);
            $table->boolean('is_security_update')->default(false);
            
            // Файлы обновления
            $table->string('download_url');
            $table->string('file_size_bytes');
            $table->string('checksum_sha256');
            $table->string('signature')->nullable();
            
            // Статус
            $table->enum('status', ['pending', 'available', 'downloading', 'downloaded', 'installing', 'installed', 'failed', 'rolled_back'])->default('pending');
            $table->timestamp('released_at');
            $table->timestamp('downloaded_at')->nullable();
            $table->timestamp('installed_at')->nullable();
            
            // Статистика
            $table->integer('download_count')->default(0);
            $table->integer('install_success_count')->default(0);
            $table->integer('install_failure_count')->default(0);
            
            $table->timestamps();

            // Индексы для производительности
            $table->unique(['version']);
            $table->index(['status']);
            $table->index(['released_at']);
            $table->index(['type', 'priority']);
        });

        // Таблица истории обновлений пользователей
        Schema::schema()->create('user_update_history', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('update_id')->constrained('system_updates')->onDelete('cascade');
            $table->string('instance_id'); // идентификатор экземпляра приложения
            $table->enum('status', ['pending', 'downloading', 'downloaded', 'installing', 'installed', 'failed', 'skipped']);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('error_message')->nullable();
            $table->json('metadata')->nullable(); // дополнительная информация
            $table->timestamps();

            // Индексы для производительности
            $table->index(['update_id', 'status']);
            $table->index(['instance_id']);
        });

        // Таблица бэкапов системы
        Schema::schema()->create('system_backups', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->enum('type', ['automatic', 'manual', 'pre_update']);
            $table->string('file_path');
            $table->string('file_size_bytes');
            $table->string('checksum_sha256');
            $table->json('metadata')->nullable(); // версия, компоненты и т.д.
            $table->timestamp('created_at');
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_verified')->default(false);

            // Индексы для производительности
            $table->index(['type']);
            $table->index(['created_at']);
            $table->index(['expires_at']);
        });

        // Таблица системных настроек
        Schema::schema()->create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, integer, boolean, json
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(false); // доступно ли во frontend
            $table->timestamps();

            // Индексы для производительности
            $table->index(['key']);
            $table->index(['is_public']);
        });

        // Таблица логов системы
        Schema::schema()->create('system_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->enum('level', ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug']);
            $table->string('channel')->default('app');
            $table->string('message');
            $table->json('context')->nullable();
            $table->string('user_id')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('created_at');

            // Индексы для производительности
            $table->index(['level', 'created_at']);
            $table->index(['channel', 'created_at']);
            $table->index(['user_id']);
            $table->index(['created_at']);
        });

        // Таблица уведомлений
        Schema::schema()->create('notifications', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('message');
            $table->enum('type', ['info', 'success', 'warning', 'error', 'update', 'achievement', 'reminder']);
            $table->enum('channel', ['in_app', 'email', 'push'])->default('in_app');
            $table->json('data')->nullable(); // дополнительные данные
            $table->timestamp('read_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            // Индексы для производительности
            $table->index(['user_id', 'read_at']);
            $table->index(['user_id', 'type']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::schema()->dropIfExists('notifications');
        Schema::schema()->dropIfExists('system_logs');
        Schema::schema()->dropIfExists('system_settings');
        Schema::schema()->dropIfExists('system_backups');
        Schema::schema()->dropIfExists('user_update_history');
        Schema::schema()->dropIfExists('system_updates');
        Schema::schema()->dropIfExists('ai_messages');
        Schema::schema()->dropIfExists('ai_conversations');
    }
};
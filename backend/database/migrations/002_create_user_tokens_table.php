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
        Schema::schema()->create('user_tokens', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['refresh', 'reset_password', 'email_verification']);
            $table->string('token', 500);
            $table->string('device_name')->nullable();
            $table->string('device_type')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_revoked')->default(false);
            $table->timestamps();

            // Индексы для производительности
            $table->index(['user_id', 'type']);
            $table->index(['token']);
            $table->index(['expires_at']);
            $table->index(['is_revoked']);
        });

        // Таблица для blacklist JWT токенов
        Schema::schema()->create('blacklisted_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('jti')->unique(); // JWT ID
            $table->timestamp('expires_at');
            $table->timestamps();

            $table->index(['jti']);
            $table->index(['expires_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::schema()->dropIfExists('blacklisted_tokens');
        Schema::schema()->dropIfExists('user_tokens');
    }
};
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
        // Таблица измерений тела
        Schema::schema()->create('body_measurements', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->time('time')->nullable();
            
            // Основные измерения
            $table->decimal('weight', 5, 2)->nullable(); // кг
            $table->decimal('height', 5, 2)->nullable(); // см
            $table->decimal('body_fat_percentage', 5, 2)->nullable();
            $table->decimal('muscle_mass_percentage', 5, 2)->nullable();
            $table->decimal('water_percentage', 5, 2)->nullable();
            $table->decimal('bone_mass', 5, 2)->nullable(); // кг
            $table->decimal('visceral_fat', 5, 2)->nullable();
            
            // Обхваты (см)
            $table->decimal('neck', 5, 2)->nullable();
            $table->decimal('chest', 5, 2)->nullable();
            $table->decimal('waist', 5, 2)->nullable();
            $table->decimal('hips', 5, 2)->nullable();
            $table->decimal('thigh', 5, 2)->nullable();
            $table->decimal('bicep', 5, 2)->nullable();
            $table->decimal('forearm', 5, 2)->nullable();
            $table->decimal('calf', 5, 2)->nullable();
            
            // Рассчитанные показатели
            $table->decimal('bmi', 5, 2)->nullable();
            $table->decimal('body_fat_mass', 5, 2)->nullable(); // кг
            $table->decimal('lean_mass', 5, 2)->nullable(); // кг
            
            $table->text('notes')->nullable();
            $table->string('photo_url')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Индексы для производительности
            $table->index(['user_id', 'date']);
            $table->index(['date']);
        });

        // Таблица потребления воды
        Schema::schema()->create('water_intake', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->time('time');
            $table->integer('amount_ml'); // количество в мл
            $table->enum('container_type', ['glass', 'bottle_500ml', 'bottle_1l', 'cup', 'custom'])->default('glass');
            $table->text('notes')->nullable();
            $table->timestamps();

            // Индексы для производительности
            $table->index(['user_id', 'date']);
            $table->index(['date']);
        });

        // Таблица целей
        Schema::schema()->create('goals', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['weight_loss', 'weight_gain', 'muscle_gain', 'fitness', 'nutrition', 'custom']);
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->enum('status', ['active', 'completed', 'paused', 'cancelled'])->default('active');
            
            // Целевые значения
            $table->decimal('target_value', 10, 2)->nullable();
            $table->decimal('current_value', 10, 2)->nullable();
            $table->string('unit', 20)->nullable(); // kg, %, reps, etc.
            
            // Временные рамки
            $table->date('start_date');
            $table->date('target_date')->nullable();
            $table->date('completed_date')->nullable();
            
            // Прогресс
            $table->decimal('progress_percentage', 5, 2)->default(0);
            $table->json('milestones')->nullable(); // промежуточные цели
            
            $table->timestamps();
            $table->softDeletes();

            // Индексы для производительности
            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'type']);
            $table->index(['target_date']);
        });

        // Таблица прогресса по целям
        Schema::schema()->create('goal_progress', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('goal_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->decimal('value', 10, 2);
            $table->text('notes')->nullable();
            $table->timestamps();

            // Индексы для производительности
            $table->index(['goal_id', 'date']);
        });

        // Таблица активности пользователей (для аналитики)
        Schema::schema()->create('user_activities', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('activity_type', [
                'login', 'logout', 'food_entry', 'workout_completed', 
                'measurement_recorded', 'goal_created', 'goal_achieved',
                'water_logged', 'ai_chat', 'profile_updated'
            ]);
            $table->json('activity_data')->nullable(); // дополнительные данные
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();

            // Индексы для производительности
            $table->index(['user_id', 'activity_type']);
            $table->index(['user_id', 'created_at']);
            $table->index(['activity_type', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::schema()->dropIfExists('user_activities');
        Schema::schema()->dropIfExists('goal_progress');
        Schema::schema()->dropIfExists('goals');
        Schema::schema()->dropIfExists('water_intake');
        Schema::schema()->dropIfExists('body_measurements');
    }
};
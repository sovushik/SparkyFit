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
        Schema::schema()->create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Физические параметры
            $table->decimal('height', 5, 2)->nullable(); // см
            $table->decimal('current_weight', 6, 2)->nullable(); // кг
            $table->decimal('target_weight', 6, 2)->nullable(); // кг
            $table->enum('activity_level', [
                'sedentary',     // Малоподвижный
                'lightly_active', // Слегка активный
                'moderately_active', // Умеренно активный
                'very_active',    // Очень активный
                'extra_active'    // Экстремально активный
            ])->default('moderately_active');
            
            // Фитнес цели
            $table->json('fitness_goals')->nullable(); // [weight_loss, muscle_gain, endurance, etc.]
            $table->enum('primary_goal', [
                'weight_loss',
                'weight_gain', 
                'muscle_gain',
                'endurance',
                'strength',
                'maintenance'
            ])->nullable();
            
            // Калории и БЖУ
            $table->integer('daily_calorie_goal')->nullable();
            $table->decimal('protein_goal_percent', 5, 2)->default(25.00); // %
            $table->decimal('carb_goal_percent', 5, 2)->default(45.00); // %
            $table->decimal('fat_goal_percent', 5, 2)->default(30.00); // %
            $table->decimal('daily_water_goal', 6, 2)->default(2.5); // литры
            
            // Тренировки
            $table->integer('weekly_workout_goal')->default(3);
            $table->json('preferred_workout_types')->nullable(); // [cardio, strength, yoga, etc.]
            $table->time('preferred_workout_time')->nullable();
            $table->integer('avg_workout_duration')->default(60); // минуты
            
            // Медицинская информация
            $table->json('health_conditions')->nullable(); // [diabetes, hypertension, etc.]
            $table->json('allergies')->nullable();
            $table->text('notes')->nullable();
            
            // Настройки уведомлений
            $table->boolean('notification_workouts')->default(true);
            $table->boolean('notification_meals')->default(true);
            $table->boolean('notification_water')->default(true);
            $table->boolean('notification_progress')->default(true);
            $table->boolean('notification_ai_tips')->default(true);
            
            // Приватность
            $table->boolean('profile_public')->default(false);
            $table->boolean('show_progress_photos')->default(false);
            $table->boolean('allow_friend_requests')->default(true);
            
            $table->timestamps();
            $table->softDeletes();

            // Индексы
            $table->index(['user_id']);
            $table->index(['uuid']);
            $table->index(['primary_goal']);
            $table->index(['activity_level']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::schema()->dropIfExists('user_profiles');
    }
};
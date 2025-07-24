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
        // Таблица упражнений
        Schema::schema()->create('exercises', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('category');
            $table->string('muscle_groups'); // JSON строка мышечных групп
            $table->string('equipment')->nullable();
            $table->enum('difficulty_level', ['beginner', 'intermediate', 'advanced']);
            
            // Медиа
            $table->string('image_url')->nullable();
            $table->string('video_url')->nullable();
            $table->json('instructions')->nullable(); // пошаговые инструкции
            
            // MET (Metabolic Equivalent) для расчета калорий
            $table->decimal('met_value', 4, 2)->default(3.5);
            
            $table->boolean('is_custom')->default(false);
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            // Индексы для производительности
            $table->index(['category']);
            $table->index(['difficulty_level']);
            $table->index(['is_custom']);
            $table->fullText(['name', 'description']);
        });

        // Таблица тренировок
        Schema::schema()->create('workouts', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('notes')->nullable();
            $table->date('date');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->integer('duration_minutes')->nullable(); // продолжительность в минутах
            $table->enum('status', ['planned', 'in_progress', 'completed', 'skipped'])->default('planned');
            
            // Рассчитанные значения
            $table->decimal('total_calories_burned', 8, 2)->default(0);
            $table->integer('total_exercises')->default(0);
            $table->integer('total_sets')->default(0);
            
            $table->boolean('is_template')->default(false);
            $table->timestamps();
            $table->softDeletes();

            // Индексы для производительности
            $table->index(['user_id', 'date']);
            $table->index(['user_id', 'status']);
            $table->index(['is_template']);
        });

        // Таблица упражнений в тренировке
        Schema::schema()->create('workout_exercises', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('workout_id')->constrained()->onDelete('cascade');
            $table->foreignId('exercise_id')->constrained()->onDelete('cascade');
            $table->integer('order_index')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            // Индексы для производительности
            $table->index(['workout_id', 'order_index']);
        });

        // Таблица подходов
        Schema::schema()->create('workout_sets', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('workout_exercise_id')->constrained()->onDelete('cascade');
            $table->integer('set_number');
            $table->integer('reps')->nullable();
            $table->decimal('weight', 8, 2)->nullable(); // вес в кг
            $table->integer('duration_seconds')->nullable(); // для времени
            $table->decimal('distance', 8, 2)->nullable(); // дистанция в км
            $table->integer('rest_seconds')->nullable();
            $table->boolean('is_completed')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();

            // Индексы для производительности
            $table->index(['workout_exercise_id', 'set_number']);
        });

        // Таблица личных рекордов
        Schema::schema()->create('personal_records', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('exercise_id')->constrained()->onDelete('cascade');
            $table->enum('record_type', ['max_weight', 'max_reps', 'best_time', 'max_distance']);
            $table->decimal('value', 10, 2);
            $table->string('unit', 10); // kg, reps, seconds, km
            $table->date('achieved_date');
            $table->foreignId('workout_set_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();

            // Индексы для производительности
            $table->unique(['user_id', 'exercise_id', 'record_type']);
            $table->index(['achieved_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::schema()->dropIfExists('personal_records');
        Schema::schema()->dropIfExists('workout_sets');
        Schema::schema()->dropIfExists('workout_exercises');
        Schema::schema()->dropIfExists('workouts');
        Schema::schema()->dropIfExists('exercises');
    }
};
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
        // Таблица продуктов питания
        Schema::schema()->create('foods', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->string('brand')->nullable();
            $table->text('description')->nullable();
            $table->string('barcode')->nullable()->unique();
            $table->string('category')->nullable();
            
            // Пищевая ценность на 100г
            $table->decimal('calories_per_100g', 8, 2);
            $table->decimal('protein_per_100g', 8, 2)->default(0);
            $table->decimal('carbs_per_100g', 8, 2)->default(0);
            $table->decimal('fat_per_100g', 8, 2)->default(0);
            $table->decimal('fiber_per_100g', 8, 2)->default(0);
            $table->decimal('sugar_per_100g', 8, 2)->default(0);
            $table->decimal('sodium_per_100g', 8, 2)->default(0);
            
            // Метаданные
            $table->string('image_url')->nullable();
            $table->json('additional_nutrients')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_custom')->default(false);
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            // Индексы для производительности
            $table->index(['name']);
            $table->index(['barcode']);
            $table->index(['category']);
            $table->index(['is_verified', 'is_custom']);
            $table->fullText(['name', 'brand']);
        });

        // Таблица записей питания
        Schema::schema()->create('food_entries', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('food_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 8, 2); // количество в граммах
            $table->enum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack']);
            $table->date('date');
            $table->time('time')->nullable();
            
            // Рассчитанные значения (денормализация для производительности)
            $table->decimal('total_calories', 8, 2);
            $table->decimal('total_protein', 8, 2);
            $table->decimal('total_carbs', 8, 2);
            $table->decimal('total_fat', 8, 2);
            
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Индексы для производительности
            $table->index(['user_id', 'date']);
            $table->index(['user_id', 'meal_type']);
            $table->index(['date']);
        });

        // Таблица пользовательских целей по питанию
        Schema::schema()->create('nutrition_goals', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('daily_calories', 8, 2);
            $table->decimal('daily_protein', 8, 2);
            $table->decimal('daily_carbs', 8, 2);
            $table->decimal('daily_fat', 8, 2);
            $table->decimal('daily_fiber', 8, 2)->nullable();
            $table->decimal('daily_water', 8, 2)->default(2000); // мл
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['user_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::schema()->dropIfExists('nutrition_goals');
        Schema::schema()->dropIfExists('food_entries');
        Schema::schema()->dropIfExists('foods');
    }
};
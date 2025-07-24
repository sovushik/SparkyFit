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
        Schema::schema()->create('foods', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name', 255);
            $table->string('name_en', 255)->nullable();
            $table->text('description')->nullable();
            $table->string('brand', 100)->nullable();
            $table->string('barcode', 50)->nullable()->unique();
            
            // Пищевая ценность на 100г
            $table->decimal('calories_per_100g', 8, 2);
            $table->decimal('protein_per_100g', 8, 2)->default(0);
            $table->decimal('carbs_per_100g', 8, 2)->default(0);
            $table->decimal('fat_per_100g', 8, 2)->default(0);
            $table->decimal('fiber_per_100g', 8, 2)->default(0);
            $table->decimal('sugar_per_100g', 8, 2)->default(0);
            $table->decimal('sodium_per_100g', 8, 2)->default(0); // мг
            
            // Витамины и минералы (опционально)
            $table->json('vitamins')->nullable(); // {vitamin_a: 100, vitamin_c: 200, etc.}
            $table->json('minerals')->nullable(); // {calcium: 100, iron: 5, etc.}
            
            // Категоризация
            $table->enum('category', [
                'fruits',
                'vegetables', 
                'grains',
                'protein',
                'dairy',
                'fats',
                'beverages',
                'snacks',
                'sweets',
                'prepared',
                'spices',
                'other'
            ])->default('other');
            
            $table->json('tags')->nullable(); // [vegetarian, vegan, gluten_free, etc.]
            
            // Единицы измерения
            $table->json('serving_sizes')->nullable(); // [{name: "средний", weight: 150}, {name: "большой", weight: 200}]
            $table->string('default_unit', 20)->default('g'); // g, ml, piece, cup, etc.
            
            // Источник данных
            $table->enum('data_source', [
                'usda',      // USDA Food Data Central
                'local_db',  // Местная база
                'user',      // Добавлено пользователем
                'brand',     // От производителя
                'imported'   // Импортировано
            ])->default('local_db');
            
            $table->string('external_id')->nullable(); // ID в внешней системе
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_public')->default(true);
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            
            $table->timestamps();
            $table->softDeletes();

            // Индексы для поиска и производительности
            $table->fullText(['name', 'description', 'brand']);
            $table->index(['category']);
            $table->index(['barcode']);
            $table->index(['is_public', 'is_verified']);
            $table->index(['created_by_user_id']);
            $table->index(['data_source']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::schema()->dropIfExists('foods');
    }
};
<?php

namespace Database\Factories;

use App\Models\Food;
use Illuminate\Database\Eloquent\Factories\Factory;

class FoodFactory extends Factory
{
    protected $model = Food::class;

    public function definition(): array
    {
        return [
            'uuid' => $this->faker->uuid(),
            'name' => $this->faker->word(),
            'name_en' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'brand' => $this->faker->company(),
            'barcode' => $this->faker->unique()->ean13(),
            'calories_per_100g' => $this->faker->numberBetween(30, 600),
            'protein_per_100g' => $this->faker->randomFloat(2, 0, 50),
            'carbs_per_100g' => $this->faker->randomFloat(2, 0, 80),
            'fat_per_100g' => $this->faker->randomFloat(2, 0, 40),
            'fiber_per_100g' => $this->faker->randomFloat(2, 0, 10),
            'sugar_per_100g' => $this->faker->randomFloat(2, 0, 50),
            'sodium_per_100g' => $this->faker->randomFloat(2, 0, 2000),
            'vitamins' => [],
            'minerals' => [],
            'category' => $this->faker->randomElement(['fruits','vegetables','grains','protein','dairy','fats','beverages','snacks','sweets','prepared','spices','other']),
            'tags' => [],
            'serving_sizes' => [],
            'default_unit' => 'g',
            'data_source' => 'local_db',
            'external_id' => null,
            'is_verified' => $this->faker->boolean(70),
            'is_public' => true,
            'created_by_user_id' => null,
        ];
    }
}
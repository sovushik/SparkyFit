<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'uuid' => $this->faker->uuid(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => bcrypt('password'),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'birth_date' => $this->faker->date('Y-m-d', '-18 years'),
            'gender' => $this->faker->randomElement(['male', 'female', 'other']),
            'phone' => $this->faker->phoneNumber(),
            'avatar_url' => $this->faker->imageUrl(200, 200, 'people'),
            'timezone' => 'Europe/Moscow',
            'locale' => 'ru',
            'is_active' => true,
            'is_verified' => $this->faker->boolean(80),
            'last_login_at' => $this->faker->dateTimeThisYear(),
            'last_login_ip' => $this->faker->ipv4(),
            'preferences' => [],
            'remember_token' => Str::random(10),
        ];
    }
}
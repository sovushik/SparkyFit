<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NutritionGoal extends Model
{
    use HasFactory;

    protected $table = 'nutrition_goals';

    protected $fillable = [
        'uuid',
        'user_id',
        'daily_calories',
        'daily_protein',
        'daily_carbs',
        'daily_fat',
        'daily_fiber',
        'daily_water',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'daily_calories' => 'float',
        'daily_protein' => 'float',
        'daily_carbs' => 'float',
        'daily_fat' => 'float',
        'daily_fiber' => 'float',
        'daily_water' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
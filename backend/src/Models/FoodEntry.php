<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FoodEntry extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'food_entries';

    protected $fillable = [
        'uuid',
        'user_id',
        'food_id',
        'amount',
        'meal_type',
        'date',
        'time',
        'total_calories',
        'total_protein',
        'total_carbs',
        'total_fat',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'time' => 'datetime:H:i:s',
        'total_calories' => 'float',
        'total_protein' => 'float',
        'total_carbs' => 'float',
        'total_fat' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function food(): BelongsTo
    {
        return $this->belongsTo(Food::class);
    }
}
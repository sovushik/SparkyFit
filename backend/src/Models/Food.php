<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Food extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'foods';

    protected $fillable = [
        'uuid',
        'name',
        'name_en',
        'description',
        'brand',
        'barcode',
        'calories_per_100g',
        'protein_per_100g',
        'carbs_per_100g',
        'fat_per_100g',
        'fiber_per_100g',
        'sugar_per_100g',
        'sodium_per_100g',
        'vitamins',
        'minerals',
        'category',
        'tags',
        'serving_sizes',
        'default_unit',
        'data_source',
        'external_id',
        'is_verified',
        'is_public',
        'created_by_user_id',
    ];

    protected $casts = [
        'vitamins' => 'array',
        'minerals' => 'array',
        'tags' => 'array',
        'serving_sizes' => 'array',
        'is_verified' => 'boolean',
        'is_public' => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
}
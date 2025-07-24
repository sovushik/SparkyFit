<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'user_profiles';

    protected $fillable = [
        'uuid',
        'user_id',
        'height',
        'current_weight',
        'target_weight',
        'activity_level',
        'fitness_goals',
        'primary_goal',
        'daily_calorie_goal',
        'protein_goal_percent',
        'carb_goal_percent',
        'fat_goal_percent',
        'daily_water_goal',
        'weekly_workout_goal',
        'preferred_workout_types',
        'preferred_workout_time',
        'avg_workout_duration',
        'health_conditions',
        'allergies',
        'notes',
        'notification_workouts',
        'notification_meals',
        'notification_water',
        'notification_progress',
        'notification_ai_tips',
        'profile_public',
        'show_progress_photos',
        'allow_friend_requests',
    ];

    protected $casts = [
        'fitness_goals' => 'array',
        'preferred_workout_types' => 'array',
        'health_conditions' => 'array',
        'allergies' => 'array',
        'notification_workouts' => 'boolean',
        'notification_meals' => 'boolean',
        'notification_water' => 'boolean',
        'notification_progress' => 'boolean',
        'notification_ai_tips' => 'boolean',
        'profile_public' => 'boolean',
        'show_progress_photos' => 'boolean',
        'allow_friend_requests' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
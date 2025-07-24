<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'users';

    protected $fillable = [
        'uuid',
        'email',
        'password',
        'first_name',
        'last_name',
        'birth_date',
        'gender',
        'phone',
        'avatar_url',
        'timezone',
        'locale',
        'is_active',
        'is_verified',
        'last_login_at',
        'last_login_ip',
        'preferences',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'preferences' => 'array',
        'is_active' => 'boolean',
        'is_verified' => 'boolean',
        'last_login_at' => 'datetime',
        'email_verified_at' => 'datetime',
    ];

    public function profile(): HasOne
    {
        return $this->hasOne(UserProfile::class);
    }
}
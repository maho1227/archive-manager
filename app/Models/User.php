<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'user_id',   // ← ログインID
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ★ ログインに user_id を使う
    public function username()
    {
        return 'user_id';
    }

    // ★ archives とのリレーション
    public function archives()
    {
        return $this->hasMany(Archives::class, 'user_id', 'user_id');
    }
}

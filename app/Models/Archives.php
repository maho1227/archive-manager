<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Archives extends Model
{
    use HasFactory;

    protected $table = 'archives';

    protected $fillable = [
        'user_id',
        'video_id',
        'title',
        'thumbnail',
        'published_at',
    ];

    // ★ User.user_id と紐づける
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}

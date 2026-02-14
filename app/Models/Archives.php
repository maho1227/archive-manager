<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Archives extends Model
{
    use HasFactory; // ★ archives テーブルを明示的に指定（これが最重要） 
    protected $table = 'archives';
    protected $fillable = ['user_id', 'video_id', 'title', 'thumbnail', 'published_at',];
    public function user() { return $this->belongsTo(User::class); }
}

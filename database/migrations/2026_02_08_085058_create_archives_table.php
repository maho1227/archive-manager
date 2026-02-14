<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('archives', function (Blueprint $table) {
            $table->id();

            // ログインユーザー
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // YouTube 情報
            $table->string('video_id');
            $table->string('title');
            $table->string('thumbnail')->nullable();
            $table->timestamp('published_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('archives');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('favorite_archives', function (Blueprint $table) {
            $table->id();

            // YouTube の videoId（unique を外す）
            $table->string('video_id');

            // 動画タイトル
            $table->string('title');

            // サムネイルURL
            $table->string('thumbnail');

            // 公開日
            $table->timestamp('published_at');

            // user_id を nullable に変更（外部キーなし）
            $table->unsignedBigInteger('user_id')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorite_archives');
    }
};

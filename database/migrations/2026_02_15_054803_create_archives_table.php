<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('archives', function (Blueprint $table) {
            $table->id();

            // ★ User.user_id と紐づける（string）
            $table->string('user_id');

            $table->string('video_id');
            $table->string('title');
            $table->string('thumbnail')->nullable();
            $table->timestamp('published_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archives');
    }
};

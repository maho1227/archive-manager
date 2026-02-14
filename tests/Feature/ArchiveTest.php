<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArchiveTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_archive()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/archives', [
            'video_id' => 'abc123',
            'title' => 'テスト動画',
            'thumbnail' => 'https://example.com/thumb.jpg',
            'published_at' => '2024-01-01T00:00:00Z',
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'アーカイブを登録しました',
                 ]);

        $this->assertDatabaseHas('archives', [
            'user_id' => $user->id,
            'video_id' => 'abc123',
        ]);
    }
}

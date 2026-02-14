<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Archives;

class ArchiveApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_fetch_archive_list()
    {
        Archives::factory()->create([
            'video_id' => 'abc123',
            'title' => 'テスト動画',
        ]);

        $response = $this->getJson('/archiveList');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'video_id' => 'abc123',
                'title' => 'テスト動画',
            ]);
    }
}
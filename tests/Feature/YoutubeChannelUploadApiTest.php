<?php

namespace Tests\Feature;
use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class YoutubeChannelUploadApiTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_http_status_400(): void
    {
        $response = $this->getJson('/api/youtube/channel-uploads');

        $response->assertStatus(400)
            ->assertJson(
                [
                    'error' => 'channelId is required'
                ]
            );
    }

    public function test_http_status_404(): void
    {
        Http::fake([
            'https://www.googleapis.com/youtube/v3/channels*' => Http::response([
                'items' => [
                    [
                        'contentDetails' => [
                            'relatedPlaylists' => [],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->getJson('/api/youtube/channel-uploads?channelId=INVALID_ID');

        $response->assertStatus(404)
            ->assertJson([
                'error' => 'uploads playlist not found',
            ]);
    }

    public function test_http_status_200(): void
    {
        Http::fake([
            'https://www.googleapis.com/youtube/v3/channels*' => Http::response([
                'items' => [
                    [
                        'contentDetails' => [
                            'relatedPlaylists' => [
                                'uploads' => 'UPLOADS_PLAYLIST_ID',
                            ],
                        ],
                    ],
                ],
            ], 200),

            'https://www.googleapis.com/youtube/v3/playlistItems*' => Http::response([
                'items' => [
                    ['snippet' => ['title' => 'Test Video']],
                ],
                'nextPageToken' => 'NEXT_TOKEN',
            ], 200),
        ]);

        $response = $this->getJson('/api/youtube/channel-uploads?channelId=VALID_ID');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'items',
                'nextPageToken',
            ])
            ->assertJsonFragment([
                'title' => 'Test Video',
            ]);
    }
}

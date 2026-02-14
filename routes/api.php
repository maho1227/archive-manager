<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArchiveController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;


Route::get('/youtube/channel-uploads', function (Request $request) {
    $channelId = $request->input('channelId');
    $pageToken = $request->input('pageToken');

    if (!$channelId) {
        return response()->json(['error' => 'channelId is required'], 400);
    }

    $apiKey = config('services.youtube.key');

    // チャンネルの uploads プレイリストID を取得
    $channelRes = Http::get('https://www.googleapis.com/youtube/v3/channels', [
        'key' => $apiKey,
        'id' => $channelId,
        'part' => 'contentDetails',
    ]);

    $channelData = $channelRes->json();

    if (empty($channelData['items'][0]['contentDetails']['relatedPlaylists']['uploads'])) {
        return response()->json(['error' => 'uploads playlist not found'], 404);
    }

    $uploadsPlaylistId = $channelData['items'][0]['contentDetails']['relatedPlaylists']['uploads'];

    // playlistItems を取得（ページトークン対応）
    $params = [
        'key' => $apiKey,
        'playlistId' => $uploadsPlaylistId,
        'part' => 'snippet',
        'maxResults' => 50,
    ];

    if ($pageToken) {
        $params['pageToken'] = $pageToken;
    }

    $playlistRes = Http::get('https://www.googleapis.com/youtube/v3/playlistItems', $params);
    return $playlistRes->json();
});

Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('api.login');
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
Route::post('/archives', [ArchiveController::class, 'store']);
Route::get('/archiveList', [ArchiveController::class, 'index']);
Route::delete('/archives/{videoId}', [ArchiveController::class, 'destroy']);
// Route::middleware('auth:sanctum')->get('/user', function (Request $request) { return $request->user(); });

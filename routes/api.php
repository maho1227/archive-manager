<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArchiveController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

/*
|--------------------------------------------------------------------------
| YouTube API
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Archive API
|--------------------------------------------------------------------------
*/

Route::post('/archives', [ArchiveController::class, 'store']);
Route::get('/archiveList', [ArchiveController::class, 'index']);
Route::delete('/archives/{videoId}', [ArchiveController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| Debug Routes（Render 本番デバッグ用）
|--------------------------------------------------------------------------
*/

// ログ閲覧
Route::get('/debug-log-text', function () {
    $path = storage_path('logs/laravel.log');

    if (!file_exists($path)) {
        return response()->json(['error' => 'log not found'], 404);
    }

    try {
        $content = file($path, FILE_IGNORE_NEW_LINES);
        return response()->json(['log' => $content]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// ログ強制生成
Route::get('/debug-force-log', function () {
    \Log::error('force log test');
    return response()->json(['status' => 'ok']);
});

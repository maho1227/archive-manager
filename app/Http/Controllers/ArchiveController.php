<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Archives;
use App\Models\User;

class ArchiveController extends Controller
{
    public function index(Request $request)
    {
        // ★ クエリパラメータから user_id を取得 
        $userId = $request->query('user_id'); // ★ user_id が無い場合は空配列を返す（安全） 
        if (!$userId) {
            return response()->json([]);
        }
        // ★ user_id で絞り込んで返す 
        return response()->json(Archives::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->distinct('video_id')
            ->get());
    }
    public function store(Request $request)
    {
        // 入力チェック
        $validated = $request->validate([
            'user_id' => 'string',
            'video_id' => 'required|string',
            'title' => 'required|string',
            'thumbnail' => 'required|string',
            'published_at' => 'required|string',
        ]);

        // ★ users テーブルに存在する user_id か確認
        $user = User::where('user_id', $validated['user_id'])->first();

        if (!$user) {
            return response()->json([
                'message' => '指定されたユーザーIDは存在しません'
            ], 404);
        }

        // ★ すでに登録済みかチェック（重複防止）
        $exists = Archives::where('user_id', $validated['user_id'])
            ->where('video_id', $validated['video_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'この動画はすでに登録されています'
            ], 409);
        }

        // ★ archives に保存
        $archive = Archives::create([
            'user_id' => $validated['user_id'],
            'video_id' => $validated['video_id'],
            'title' => $validated['title'],
            'thumbnail' => $validated['thumbnail'],
            'published_at' => isset($validated['published_at'])
                ? \Carbon\Carbon::parse($validated['published_at'])->format('Y-m-d H:i:s')
                : null,
        ]);

        return response()->json($archive, 201);
    }

    public function destroy(Request $request, $videoId)
    {
        $userId = $request->query('user_id');
        // video_id で検索 
        $archive = Archives::where('user_id', $userId)
            ->where('video_id', $videoId)->first();
        if (!$archive) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $archive->delete();
        return response()->json(['message' => 'Deleted'], 200);
    }
}


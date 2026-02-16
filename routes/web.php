<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Api\LoginController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Laravel のトップページは API 用に変更
Route::get('/', function () {
    return ['message' => 'API running'];
});

//SPA Sunctom 認証ルート 
Route::middleware(['web'])->group(function () {
    Route::post('/login', [LoginController::class, 'login']);
    Route::post('/logout', [LoginController::class, 'logout']);
});

// 管理画面ログイン 
Route::get('/admin/login', [AuthenticatedSessionController::class, 'create'])
    ->name('admin.login');

// 管理画面ログイン処理（POST） 
Route::post('/admin/login', [AuthenticatedSessionController::class, 'store'])
    ->name('admin.login.store');

// 管理画面ログアウト
Route::post('/admin/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')->name('admin.logout');

// 管理画面(ログイン後)
Route::middleware(['auth'])->prefix('admin')->group(function () {

    // 管理画面トップ
    Route::get('/', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');

    // YouTube 管理画面
    Route::get('/youtube', function () {
        return Inertia::render('Admin/YoutubeDashboard');
    })->name('admin.youtube');

    // アーカイブ一覧（管理画面）
    Route::get('/archives', function () {
        return Inertia::render('Admin/ArchiveList');
    })->name('admin.archives');

    // プロフィール（管理画面）
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('admin.profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('admin.profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('admin.profile.destroy');
});

// for debug
Route::get('/debug-columns', function () {//
    return \Illuminate\Support\Facades\Schema::getColumnListing('archives');
});

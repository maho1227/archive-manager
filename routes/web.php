<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Auth::check()
        ? redirect()->route('dashboard.youtube')
        : redirect()->route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/dashboard/youtube', function () {
        return Inertia::render('YoutubeDashboard');
    })->name('dashboard.youtube');

    Route::get('/archiveList', function () {
        return Inertia::render('ArchiveList');
    });
});
Route::get('/debug-columns', function () {
    return \Illuminate\Support\Facades\Schema::getColumnListing('archives');
});

require __DIR__ . '/auth.php';

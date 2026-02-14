<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
public function store(Request $request)
{
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (Auth::attempt($credentials, $request->remember)) {
        $request->session()->regenerate();

        // ★ user_id を保存
        if ($request->user_id) {
            $user = Auth::user();
            $user->user_id = $request->user_id;
            $user->save();
        }

        return redirect()->intended('/dashboard/youtube');
    }

    return back()->withErrors([
        'email' => 'ログイン情報が正しくありません。',
    ]);
}
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'user_id' => 'required|string',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt([
            'user_id' => $request->user_id,
            'password' => $request->password,
        ])) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Logged in',
            'user' => auth()->user(),
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out']);
    }
}

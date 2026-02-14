<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // $exceptions->render(function (HttpException $e) {
        //     //302のままだと、PUTやDELETEのリクエストがエラーになるため、303に変更
        //     if ($e->getStatusCode() === 419) {
        //         return back(303)->withErrors(['セッションが切れました。画面を再読み込みしてください。']);
        //     }
        //     return back(303)->withErrors(['エラーが発生しました。']);
        // });
    })->create();

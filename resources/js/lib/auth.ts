// CSRF Cookie を取得
export async function getCsrfCookie() {
    await fetch("http://localhost/sanctum/csrf-cookie", {
        method: "GET",
        credentials: "include",
    });
}

// ログイン処理
export async function login(email: string, password: string) {
    await getCsrfCookie();

    const res = await fetch("http://localhost/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    // if (!res.ok) {
    //     throw new Error("ログインに失敗しました");
    // }

    return await res.json();
}

// お気に入り登録 API
export async function addFavorite(archiveId: number) {
    await getCsrfCookie();

    return fetch("http://localhost/api/archive/favorite", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archive_id: archiveId }),
    });
}

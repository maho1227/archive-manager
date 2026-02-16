import { router, usePage } from "@inertiajs/react";
import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { props } = usePage();

  const handleLogout = () => {
    localStorage.removeItem("searchResults");
    localStorage.removeItem("channelId");
    localStorage.removeItem("ytSearchCache");

    router.post(route("admin.logout"));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ★ 共通ヘッダー */}
      <header className="bg-white shadow p-4 flex justify-between items-center">

        {/* ★ タイトルをクリックで YouTubeDashboard へ */}
        <h1
          className="text-xl font-bold cursor-pointer hover:text-blue-600 transition"
          onClick={() => router.get("/dashboard/youtube")}
        >
          アーカイブ管理システム
        </h1>

        <div className="flex items-center gap-4">
          {/* ★ お気に入り一覧 */}
          {props.auth?.user && (
            <button
              onClick={() => router.get("/archiveList")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              お気に入りアーカイブ一覧
            </button>
          )}

          {/* ★ ログアウト */}
          {props.auth?.user && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              ログアウト
            </button>
          )}
        </div>
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
}

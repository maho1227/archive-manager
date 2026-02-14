import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import VideoCardGrid from "../Components/VideoCard";
import Paginator from "../Parts/Paginator";

interface Archive {
  id: number;
  video_id: string;
  title: string;
  thumbnail: string;
  published_at: string;
}

const ITEMS_PER_PAGE = 8;

export default function ArchiveList() {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const res = await fetch("/api/archiveList");
        const data = await res.json();
        setArchives(data);
      } catch (e) {
        console.error("Failed to fetch archives", e);
      } finally {
        setLoading(false);
      }
    };

    fetchArchives();
  }, []);

  if (loading) {
    return <p className="p-6">読み込み中...</p>;
  }

  const totalPages = Math.ceil(archives.length / ITEMS_PER_PAGE);
  const currentItems = archives.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  // ★ 削除処理
  const deleteArchive = async (video: any) => {
    const ok = window.confirm("このアーカイブを削除しますか？");
    if (!ok) return;

    try {
      const res = await fetch(`/api/archives/${video.snippet.resourceId.videoId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("削除に失敗しました");
        return;
      }

      // ローカル状態から削除
      setArchives((prev) =>
        prev.filter((a) => a.video_id !== video.snippet.resourceId.videoId)
      );

      alert("削除しました");
    } catch (e) {
      console.error(e);
      alert("通信エラーが発生しました");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">お気に入りアーカイブ一覧</h1>

      <button
        onClick={() => router.get("/dashboard/youtube")}
        className="mb-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        YouTubeアーカイブ一覧に戻る
      </button>

      <VideoCardGrid
        videos={currentItems.map((item) => ({
          snippet: {
            title: item.title,
            description: "",
            publishedAt: item.published_at,
            thumbnails: {
              medium: { url: item.thumbnail },
            },
            resourceId: { videoId: item.video_id },
          },
        }))}
        showArchiveButton={false}
        showDeleteButton={true}   // ★ 削除ボタンを表示
        onDelete={deleteArchive}  // ★ 削除処理
      />

      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(index) => setCurrentPage(index)}
      />
    </div>
  );
}

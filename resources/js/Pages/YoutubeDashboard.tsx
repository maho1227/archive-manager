import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import SearchForm from '../Components/SearchForm';
import VideoCardGrid from '../Components/VideoCard';
import Paginator from '../Parts/Paginator';

interface VideoItem {
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    resourceId: {
      videoId: string;
    };
  };
}

const ITEMS_PER_PAGE = 8;

const YoutubeDashboard: React.FC = () => {
  const [channelId, setChannelId] = useState('');
  const [allVideos, setAllVideos] = useState<VideoItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ----------------------------------------
  // ★ 初期表示で localStorage から復元
  // ----------------------------------------
  useEffect(() => {
    const saved = localStorage.getItem("ytSearchCache");
    if (saved) {
      const parsed = JSON.parse(saved);
      setChannelId(parsed.channelId || "");
      setAllVideos(parsed.allVideos || []);
      setCurrentPage(parsed.currentPage || 0);
      setNextPageToken(parsed.nextPageToken || null);
    }
  }, []);

  // ----------------------------------------
  // ★ 検索結果を localStorage に保存
  // ----------------------------------------
  const saveCache = (
    videos: VideoItem[],
    page: number,
    token: string | null,
    channelId: string
  ) => {
    localStorage.setItem(
      "ytSearchCache",
      JSON.stringify({
        allVideos: videos,
        currentPage: page,
        nextPageToken: token,
        channelId: channelId,
      })
    );
  };

  // -----------------------------
  // ★ アーカイブ登録 API（localStorage の user_id を送信）
  // -----------------------------
  const saveArchive = async (video: VideoItem) => {
    const ok = window.confirm("アーカイブを登録しますか？");
    if (!ok) return;

    const userId = localStorage.getItem("user_id");
    console.log(userId)
    if (!userId) {
      alert("ユーザーIDが見つかりません。ログインし直してください。");
      return;
    }

    try {
      const res = await fetch('/api/archives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId, // ★ localStorage の user_id を送信
          video_id: video.snippet.resourceId.videoId,
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.medium.url,
          published_at: video.snippet.publishedAt,
        }),
      });

      if (res.status === 409) {
        alert("この動画はすでにアーカイブ登録されています");
        return;
      }

      if (!res.ok) {
        console.error(await res.text());
        alert('アーカイブ登録に失敗しました');
        return;
      }

      alert('アーカイブ登録しました');
      router.get('/archiveList');

    } catch (e) {
      console.error(e);
      alert('通信エラーが発生しました');
    }
  };

  // -----------------------------
  // ★ YouTube API（reset 対応 + 追加読み込み対応）
  // -----------------------------
  const fetchVideos = async (pageToken: string | null = null, reset = false) => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      params.append('channelId', channelId.trim());
      if (pageToken) params.append('pageToken', pageToken);

      const res = await fetch(
        `${window.location.origin}/api/youtube/channel-uploads?${params.toString()}`
      );
      const data = await res.json();

      if (data.error) {
        setError(data.error.message || 'エラーが発生しました');
      } else {
        const newItems = (data.items || []).filter(
          (item: any) => item.snippet?.resourceId?.videoId
        );

        // ★ 新規検索ならリセット、ページ追加なら追加
        const updated = reset ? newItems : [...allVideos, ...newItems];

        setAllVideos(updated);
        setNextPageToken(data.nextPageToken || null);

        saveCache(updated, currentPage, data.nextPageToken || null, channelId);
      }
    } catch (err) {
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(allVideos.length / ITEMS_PER_PAGE);
  const currentVideos = allVideos.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  // -----------------------------
  // ★ ページ変更時に追加読み込みを行う
  // -----------------------------
  const handlePageChange = (index: number) => {
    setCurrentPage(index);
    saveCache(allVideos, index, nextPageToken, channelId);

    // ★ 次ページに到達したら追加読み込み
    const isNearEnd = (index + 1) * ITEMS_PER_PAGE > allVideos.length - ITEMS_PER_PAGE;

    if (isNearEnd && nextPageToken) {
      fetchVideos(nextPageToken, false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">アーカイブ検索</h1>

      {/* ★ チャンネルID入力フォーム */}
      <SearchForm
        channelId={channelId}
        onChange={setChannelId}
        onSubmit={() => {
          setAllVideos([]);
          setCurrentPage(0);
          setNextPageToken(null);
          localStorage.removeItem("ytSearchCache");

          fetchVideos(null, true); // ★ 新規検索モード
        }}
        loading={loading}
      />

      {/* ★ お気に入りアーカイブ一覧 */}
      <div className="mt-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">お気に入りアーカイブ一覧</h2>

        <a
          href="/archiveList"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
        >
          お気に入りアーカイブ一覧を見る
        </a>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {loading && allVideos.length === 0 ? (
        <div className="flex justify-center items-center my-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <VideoCardGrid
            videos={currentVideos}
            onArchive={saveArchive}
            showArchiveButton={true}
          />

          <Paginator
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default YoutubeDashboard;

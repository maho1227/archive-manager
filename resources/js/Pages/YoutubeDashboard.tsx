import React, { useState, useEffect } from "react";
import { router, Head } from "@inertiajs/react";
import SearchForm from "../Components/SearchForm";
import VideoCardGrid from "../Components/VideoCard";
import Paginator from "../Parts/Paginator";
import AppLayout from "@/Layouts/AppLayout";
import { usePage } from "@inertiajs/react";

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
    const [channelId, setChannelId] = useState("");
    const [allVideos, setAllVideos] = useState<VideoItem[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const user = usePage().props.auth.user;

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
        channelId: string,
    ) => {
        localStorage.setItem(
            "ytSearchCache",
            JSON.stringify({
                allVideos: videos,
                currentPage: page,
                nextPageToken: token,
                channelId: channelId,
            }),
        );
    };

    // -----------------------------
    // ★ アーカイブ登録 API
    // -----------------------------
    const saveArchive = async (video: VideoItem) => {
        const ok = window.confirm("アーカイブを登録しますか？");
        if (!ok) return;

        const userId = user.user_id;
        if (!userId) {
            alert("ユーザーIDが見つかりません。ログインし直してください。");
            return;
        }

        try {
            const res = await fetch("/api/archives", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
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
                alert("アーカイブ登録に失敗しました");
                return;
            }

            alert("アーカイブ登録しました");
            router.get("/archiveList");
        } catch (e) {
            alert("通信エラーが発生しました");
        }
    };

    // -----------------------------
    // ★ YouTube API
    // -----------------------------
    const fetchVideos = async (
        pageToken: string | null = null,
        reset = false,
    ) => {
        setLoading(true);
        setError("");

        try {
            const params = new URLSearchParams();
            params.append("channelId", channelId.trim());
            if (pageToken) params.append("pageToken", pageToken);

            const res = await fetch(
                `${window.location.origin}/api/youtube/channel-uploads?${params.toString()}`,
            );
            const data = await res.json();

            if (data.error) {
                setError(data.error.message || "エラーが発生しました");
            } else {
                const newItems = (data.items || []).filter(
                    (item: any) => item.snippet?.resourceId?.videoId,
                );

                const updated = reset ? newItems : [...allVideos, ...newItems];

                setAllVideos(updated);
                setNextPageToken(data.nextPageToken || null);

                saveCache(
                    updated,
                    currentPage,
                    data.nextPageToken || null,
                    channelId,
                );
            }
        } catch {
            setError("データの取得に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(allVideos.length / ITEMS_PER_PAGE);
    const currentVideos = allVideos.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE,
    );

    const handlePageChange = (index: number) => {
        setCurrentPage(index);
        saveCache(allVideos, index, nextPageToken, channelId);

        const isNearEnd =
            (index + 1) * ITEMS_PER_PAGE > allVideos.length - ITEMS_PER_PAGE;

        if (isNearEnd && nextPageToken) {
            fetchVideos(nextPageToken, false);
        }
    };

    return (
        <AppLayout>
            {/* ★ タブタイトルを設定 */}
            <Head title="YouTube Dashboard" />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">アーカイブ検索</h1>

                <SearchForm
                    channelId={channelId}
                    onChange={setChannelId}
                    onSubmit={() => {
                        setAllVideos([]);
                        setCurrentPage(0);
                        setNextPageToken(null);
                        localStorage.removeItem("ytSearchCache");

                        fetchVideos(null, true);
                    }}
                    loading={loading}
                />

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
        </AppLayout>
    );
};

export default YoutubeDashboard;

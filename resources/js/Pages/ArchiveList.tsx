import { useEffect, useState } from "react";
import { router, usePage, Head } from "@inertiajs/react";
import VideoCardGrid from "../Components/VideoCard";
import Paginator from "../Parts/Paginator";
import AppLayout from "@/Layouts/AppLayout";

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

    const user = usePage().props.auth.user;

    useEffect(() => {
        const fetchArchives = async () => {
            try {
                const res = await fetch(
                    `/api/archiveList?user_id=${user.user_id}`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const data = await res.json();
                setArchives(data);
            } catch (e) {
                console.error("Failed to fetch archives", e);
            } finally {
                setLoading(false);
            }
        };

        fetchArchives();
    }, [user.id]);

    if (loading) {
        return (
            <AppLayout>
                <Head title="お気に入りアーカイブ一覧" />
                <p className="p-6">読み込み中...</p>
            </AppLayout>
        );
    }

    const totalPages = Math.ceil(archives.length / ITEMS_PER_PAGE);
    const currentItems = archives.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );

    const deleteArchive = async (video: any) => {
        const ok = window.confirm("このアーカイブを削除しますか？");
        if (!ok) return;

        try {
            const res = await fetch(
                `/api/archives/${video.snippet.resourceId.videoId}?user_id=${user.user_id}`,
                {
                    method: "DELETE",
                }
            );

            if (!res.ok) {
                alert("削除に失敗しました");
                return;
            }

            setArchives((prev) =>
                prev.filter(
                    (a) => a.video_id !== video.snippet.resourceId.videoId
                )
            );

            alert("削除しました");
        } catch (e) {
            console.error(e);
            alert("通信エラーが発生しました");
        }
    };

    return (
        <AppLayout>
            {/* ★ タブタイトル */}
            <Head title="お気に入りアーカイブ一覧" />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">
                    お気に入りアーカイブ一覧
                </h1>

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
                    showDeleteButton={true}
                    onDelete={deleteArchive}
                />

                <Paginator
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(index) => setCurrentPage(index)}
                />
            </div>
        </AppLayout>
    );
}

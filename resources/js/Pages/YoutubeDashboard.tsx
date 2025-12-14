import React, { useState } from 'react';
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
const PAGE_GROUP_SIZE = 8;

const YoutubeDashboard: React.FC = () => {
  const [channelId, setChannelId] = useState('');
  const [allVideos, setAllVideos] = useState<VideoItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchVideos = async (pageToken: string | null = null) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.append('channelId', channelId.trim());
      if (pageToken) {
        params.append('pageToken', pageToken);
      }

      const res = await fetch(`${window.location.origin}/api/youtube/channel-uploads?${params.toString()}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error.message || 'エラーが発生しました');
      } else {
        const newItems = (data.items || []).filter(
          (item: any) => item.snippet?.resourceId?.videoId
        );
        setAllVideos((prev) => [...prev, ...newItems]);
        setNextPageToken(data.nextPageToken || null);
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">アーカイブ検索</h1>

      <SearchForm
        channelId={channelId}
        onChange={setChannelId}
        onSubmit={() => {
          setAllVideos([]);
          setCurrentPage(0);
          setNextPageToken(null);
          fetchVideos();
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
          <VideoCardGrid videos={currentVideos} />
          <Paginator
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(index) => {
              const isLastPage = index >= totalPages - 1;
              const needsMore = isLastPage && nextPageToken;
              setCurrentPage(index);
              if (needsMore) {
                fetchVideos(nextPageToken);
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default YoutubeDashboard;

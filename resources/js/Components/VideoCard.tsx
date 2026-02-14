import React from 'react';

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

interface Props {
  videos: VideoItem[];
  onArchive?: (video: VideoItem) => void;
  onDelete?: (video: VideoItem) => void;
  showArchiveButton?: boolean;
  showDeleteButton?: boolean;
}

const VideoCardGrid: React.FC<Props> = ({
  videos,
  onArchive,
  onDelete,
  showArchiveButton = true,
  showDeleteButton = false,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {videos.map((video) => {
        const v = video.snippet;
        const videoUrl = `https://www.youtube.com/watch?v=${v.resourceId.videoId}`;

        return (
          <div
            key={v.resourceId.videoId}
            className="border rounded-lg shadow p-4 bg-white flex flex-col"
          >
            <a href={videoUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={v.thumbnails.medium.url}
                alt={v.title}
                className="w-full rounded hover:opacity-90 transition"
              />
            </a>

            <h3 className="font-bold mt-2 text-sm">{v.title}</h3>
            <p className="text-xs text-gray-500">
              {new Date(v.publishedAt).toLocaleString()}
            </p>

            {/* アーカイブ登録ボタン */}
            {showArchiveButton && onArchive && (
              <button
                onClick={() => onArchive(video)}
                className="mt-auto bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
              >
                お気に入りアーカイブ登録
              </button>
            )}

            {/* 削除ボタン */}
            {showDeleteButton && onDelete && (
              <button
                onClick={() => onDelete(video)}
                className="mt-auto bg-red-500 text-white py-1 rounded hover:bg-red-600"
              >
                お気に入りアーカイブ削除
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default VideoCardGrid;

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

interface VideoCardGridProps {
  videos: VideoItem[];
}

const VideoCardGrid: React.FC<VideoCardGridProps> = ({ videos }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {videos.map((video) => (
      <div
        key={video.snippet.resourceId.videoId}
        className="border border-gray-300 rounded shadow p-3 text-sm bg-white"
      >
        <a
          href={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={video.snippet.thumbnails.medium.url}
            alt={video.snippet.title}
            className="w-full h-auto mb-2 rounded"
          />
        </a>
        <h2 className="font-semibold text-sm line-clamp-2">{video.snippet.title}</h2>
        <p className="text-gray-600 text-xs mb-1">
          投稿日: {new Date(video.snippet.publishedAt).toLocaleDateString()}
        </p>
        <p className="text-gray-800 text-xs line-clamp-2">{video.snippet.description}</p>
      </div>
    ))}
  </div>
);

export default VideoCardGrid;

import React from 'react';

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PAGE_GROUP_SIZE = 8;

const Paginator: React.FC<PaginatorProps> = ({ currentPage, totalPages, onPageChange }) => {
  const currentGroup = Math.floor(currentPage / PAGE_GROUP_SIZE);
  const startPage = currentGroup * PAGE_GROUP_SIZE;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE, totalPages);

  return totalPages > 1 ? (
    <div className="mt-6 flex justify-center flex-wrap gap-2">
      {currentPage > 0 && (
        <>
          <button
            onClick={() => onPageChange(0)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            最初に戻る
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            前へ
          </button>
        </>
      )}

      {Array.from({ length: endPage - startPage }).map((_, i) => {
        const pageIndex = startPage + i;
        return (
          <button
            key={pageIndex}
            onClick={() => onPageChange(pageIndex)}
            className={`px-3 py-1 rounded ${
              pageIndex === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {pageIndex + 1}
          </button>
        );
      })}

      {currentPage > 0 && currentPage < totalPages - 1 && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          次へ
        </button>
      )}
    </div>
  ) : null;
};

export default Paginator;

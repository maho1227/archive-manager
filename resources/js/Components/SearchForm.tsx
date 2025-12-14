import React from 'react';

interface SearchFormProps {
  channelId: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ channelId, onChange, onSubmit, loading }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
    className="mb-6 space-y-2"
  >
    <input
      type="text"
      value={channelId}
      onChange={(e) => onChange(e.target.value)}
      placeholder="チャンネルIDを入力"
      className="border px-3 py-2 mr-2 rounded w-80"
    />
    {loading ? (
      <div className="inline-flex items-center space-x-2">
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-700">検索中...</span>
      </div>
    ) : (
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        検索
      </button>
    )}
  </form>
);

export default SearchForm;

import React from 'react';

interface SearchFormProps {
  channelId: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
  channelId,
  onChange,
  onSubmit,
  loading
}) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!channelId.trim()) {
      alert("チャンネルIDを入力してください");
      return;
    }

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center gap-x-4">
        <input
          type="text"
          value={channelId}
          onChange={(e) => onChange(e.target.value)}
          placeholder="チャンネルIDを入力"
          className="border px-3 py-2 rounded w-80"
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "検索中..." : "検索"}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;

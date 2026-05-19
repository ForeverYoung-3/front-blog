interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export default function Pagination({ current, total, pageSize, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="flex justify-center gap-2 mt-8">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 0}
        className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50"
      >
        上一页
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onChange(page)}
          className={`px-3 py-1.5 rounded-lg text-sm border ${
            page === current
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page + 1}
        </button>
      ))}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === totalPages - 1}
        className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50"
      >
        下一页
      </button>
    </div>
  );
}

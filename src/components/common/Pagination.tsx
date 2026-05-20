interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export default function Pagination({ current, total, pageSize, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  // 移动端最多显示 5 个页码，桌面端显示全部
  const getVisiblePages = (isMobile: boolean) => {
    const maxVisible = isMobile ? 3 : totalPages;
    if (totalPages <= maxVisible) return Array.from({ length: totalPages }, (_, i) => i);

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(0, current - half);
    const end = Math.min(totalPages - 1, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(0, end - maxVisible + 1);

    const pages: (number | '...')[] = [];
    if (start > 0) { pages.push(0); if (start > 1) pages.push('...'); }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) { if (end < totalPages - 2) pages.push('...'); pages.push(totalPages - 1); }
    return pages;
  };

  const btnBase = 'px-3 py-1.5 rounded-lg text-sm border transition-colors';
  const btnActive = 'bg-indigo-600 text-white border-indigo-600';
  const btnNormal = 'border-gray-200 hover:bg-gray-50 text-gray-600';
  const btnDisabled = 'disabled:opacity-40 disabled:cursor-not-allowed';

  const renderPages = (pages: (number | '...')[]) =>
    pages.map((page, idx) =>
      page === '...' ? (
        <span key={`ellipsis-${idx}`} className="px-1 py-1.5 text-sm text-gray-400">…</span>
      ) : (
        <button
          key={page}
          onClick={() => onChange(page as number)}
          className={`${btnBase} ${page === current ? btnActive : btnNormal}`}
        >
          {(page as number) + 1}
        </button>
      )
    );

  return (
    <div className="flex justify-center gap-1.5 mt-8 flex-wrap">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 0}
        className={`${btnBase} ${btnNormal} ${btnDisabled}`}
      >
        ‹
      </button>

      {/* 移动端：省略模式 */}
      <div className="flex gap-1.5 sm:hidden">
        {renderPages(getVisiblePages(true))}
      </div>

      {/* 桌面端：全量或省略 */}
      <div className="hidden sm:flex gap-1.5">
        {renderPages(getVisiblePages(false))}
      </div>

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === totalPages - 1}
        className={`${btnBase} ${btnNormal} ${btnDisabled}`}
      >
        ›
      </button>
    </div>
  );
}

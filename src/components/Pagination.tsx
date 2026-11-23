interface PaginationProps {
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
  onChange: (page: number) => void;
}

/** Список номеров страниц с «окном» вокруг текущей. */
function pageNumbers(page: number, totalPages: number): (number | 'gap')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: (number | 'gap')[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) pages.push('gap');
  for (let i = start; i <= end; i += 1) pages.push(i);
  if (end < totalPages - 1) pages.push('gap');
  pages.push(totalPages);

  return pages;
}

export function Pagination({ page, totalPages, from, to, total, onChange }: PaginationProps) {
  if (total === 0) return null;

  return (
    <nav className="pagination" aria-label="Постраничная навигация">
      <p className="pagination__summary">
        Показано {from}–{to} из {total}
      </p>

      <div className="pagination__controls">
        <button
          type="button"
          className="ghost-button"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
        >
          Назад
        </button>

        <div className="pagination__pages">
          {pageNumbers(page, totalPages).map((item, index) =>
            item === 'gap' ? (
              <span key={`gap-${index}`} className="pagination__gap" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                className={`page-button${item === page ? ' page-button--active' : ''}`}
                onClick={() => onChange(item)}
                aria-current={item === page ? 'page' : undefined}
              >
                {item}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          className="ghost-button"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
        >
          Вперёд
        </button>
      </div>
    </nav>
  );
}

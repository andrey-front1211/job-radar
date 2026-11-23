interface StatusBannerProps {
  isFallback: boolean;
  errorMessage: string | null;
  onReload: () => void;
}

/**
 * Честно сообщает, что показаны демо-данные, и почему.
 * Это часть продукта: пользователь должен понимать, что он видит.
 */
export function StatusBanner({ isFallback, errorMessage, onReload }: StatusBannerProps) {
  if (!isFallback) return null;

  return (
    <div className="banner" role="status">
      <div className="banner__body">
        <p className="banner__title">Показаны демо-данные</p>
        <p className="banner__text">
          Внешнее API сейчас недоступно{errorMessage ? ` (${errorMessage})` : ''}, поэтому
          приложение подставило локальный набор вакансий. Всё остальное — фильтры,
          сортировка, пагинация — работает как обычно.
        </p>
      </div>
      <button type="button" className="ghost-button" onClick={onReload}>
        Повторить запрос
      </button>
    </div>
  );
}

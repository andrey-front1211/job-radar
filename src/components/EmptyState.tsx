interface EmptyStateProps {
  onReset: () => void;
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true" focusable="false" className="empty-state__icon">
        <circle cx="28" cy="28" r="16" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.5" />
        <path d="m40 40 12 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        <path d="M22 28h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      </svg>
      <h2 className="empty-state__title">Ничего не нашлось</h2>
      <p className="empty-state__text">
        Попробуйте изменить запрос — например, оставить только название технологии,
        или снять фильтры по уровню и формату работы.
      </p>
      <button type="button" className="primary-button" onClick={onReset}>
        Сбросить фильтры
      </button>
    </div>
  );
}

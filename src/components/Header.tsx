interface HeaderProps {
  found: number;
  total: number;
  isLoading: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onReload: () => void;
}

function RadarMark() {
  return (
    <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.35" />
      <circle cx="16" cy="16" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
      <circle cx="16" cy="16" r="2.6" fill="currentColor" />
      <path d="M16 16 L27 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="24.5" cy="21" r="2" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

export function Header({ found, total, isLoading, theme, onToggleTheme, onReload }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">
          <RadarMark />
        </span>
        <div>
          <h1 className="brand__title">Job Radar</h1>
          <p className="brand__subtitle">
            Поиск вакансий: фильтры, сортировка и данные из REST API
          </p>
        </div>
      </div>

      <div className="header-controls">
        <p className="header-counter" aria-live="polite">
          {isLoading ? 'Загружаем…' : `${found} из ${total}`}
          <span className="header-counter__label">вакансий</span>
        </p>

        <button type="button" className="icon-button" onClick={onReload} title="Обновить данные">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <path
              d="M21 12a9 9 0 1 1-2.64-6.36M21 4v5h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="visually-hidden">Обновить данные</span>
        </button>

        <button
          type="button"
          className="icon-button"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="4.5" fill="currentColor" />
              <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
              </g>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <path
                d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
                fill="currentColor"
              />
            </svg>
          )}
          <span className="visually-hidden">
            {theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
          </span>
        </button>
      </div>
    </header>
  );
}

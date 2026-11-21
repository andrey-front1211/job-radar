export type Theme = 'light' | 'dark';

/**
 * Тема по умолчанию берётся из системных настроек пользователя.
 * Функция вызывается дважды: до первого рендера (чтобы не было вспышки
 * нестилизованной страницы) и как начальное значение useState в App.
 */
export function getInitialTheme(): Theme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = theme;
}

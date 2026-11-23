import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { applyTheme, getInitialTheme } from './lib/theme';
import './styles/global.css';

// Тему выставляем до первого рендера, иначе на мгновение мелькнёт
// нестилизованная страница (FOUC).
applyTheme(getInitialTheme());

const container = document.getElementById('root');
if (!container) {
  throw new Error('Не найден корневой элемент #root');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

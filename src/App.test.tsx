import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { mockJobs } from './data/mockJobs';

/**
 * Интеграционные тесты на уровне всего приложения.
 * Сеть подменяем упавшим fetch — так проверяем и счастливый путь
 * (демо-данные + баннер), и работу фильтров без зависимости от API.
 */
beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.reject(new Error('network down'))),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const rowButtons = () => screen.getAllByRole('button', { name: 'Подробнее' });

describe('App', () => {
  it('показывает баннер о демо-данных, если API недоступно', async () => {
    render(<App />);

    expect(await screen.findByText('Показаны демо-данные')).toBeInTheDocument();
  });

  it('выводит первую страницу результатов (8 из 27)', async () => {
    render(<App />);

    await screen.findByText('Показаны демо-данные');

    expect(rowButtons()).toHaveLength(8);
    expect(screen.getByText(`Показано 1–8 из ${mockJobs.length}`)).toBeInTheDocument();
  });

  it('фильтрует список по поисковому запросу', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText('Показаны демо-данные');
    await user.type(screen.getByLabelText('Поиск вакансий'), 'django');

    await waitFor(() => {
      expect(rowButtons().length).toBeGreaterThan(0);
      expect(rowButtons().length).toBeLessThan(8);
    });

    expect(screen.getAllByText(/django/i).length).toBeGreaterThan(0);
  });

  it('фильтрует по уровню через чипы и сбрасывается кнопкой «Сбросить»', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText('Показаны демо-данные');

    const juniorChip = screen.getByRole('button', { name: 'Junior' });
    await user.click(juniorChip);
    expect(juniorChip).toHaveAttribute('aria-pressed', 'true');

    // Junior + офис — заведомо меньше одной страницы.
    await user.click(screen.getByRole('button', { name: 'Офис' }));
    await waitFor(() => expect(rowButtons().length).toBeLessThan(8));
    expect(rowButtons().length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: 'Сбросить' }));

    expect(juniorChip).toHaveAttribute('aria-pressed', 'false');
    await waitFor(() => expect(rowButtons()).toHaveLength(8));
  });

  it('открывает панель деталей и закрывает её по Escape', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText('Показаны демо-данные');
    await user.click(rowButtons()[0]!);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('показывает пустое состояние, если ничего не найдено', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText('Показаны демо-данные');
    await user.type(screen.getByLabelText('Поиск вакансий'), 'cobol');

    expect(await screen.findByText('Ничего не нашлось')).toBeInTheDocument();
  });
});

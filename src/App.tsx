import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { EmptyState } from './components/EmptyState';
import { Header } from './components/Header';
import { JobDetails } from './components/JobDetails';
import { JobList } from './components/JobList';
import { Pagination } from './components/Pagination';
import { SkeletonList } from './components/SkeletonList';
import { StatusBanner } from './components/StatusBanner';
import { Toolbar } from './components/Toolbar';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import { useJobs } from './hooks/useJobs';
import { applyFilters } from './lib/filtering';
import { applyTheme, getInitialTheme, type Theme } from './lib/theme';
import { filtersReducer, hasActiveFilters, initialFilters } from './state/filtersReducer';
import type { Job } from './types';

const PER_PAGE = 8;

export default function App() {
  const [filters, dispatch] = useReducer(filtersReducer, initialFilters);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { jobs, status, isFallback, errorMessage, reload } = useJobs();

  // Поиск срабатывает не на каждый символ, а когда пользователь притормозил.
  const debouncedQuery = useDebouncedValue(filters.query, 250);

  const effectiveFilters = useMemo(
    () => ({ ...filters, query: debouncedQuery }),
    [filters, debouncedQuery],
  );

  const result = useMemo(
    () => applyFilters(jobs, effectiveFilters, PER_PAGE),
    [jobs, effectiveFilters],
  );

  // Если после смены фильтров текущая страница стала недоступной — синхронизируем state.
  useEffect(() => {
    if (result.page !== filters.page) {
      dispatch({ type: 'page', value: result.page });
    }
  }, [result.page, filters.page]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const closeDetails = useCallback(() => setSelectedJob(null), []);
  const resetFilters = useCallback(() => dispatch({ type: 'reset' }), []);
  const isLoading = status === 'loading';

  return (
    <div className="app">
      <Header
        found={isLoading ? 0 : result.total}
        total={jobs.length}
        isLoading={isLoading}
        theme={theme}
        onToggleTheme={toggleTheme}
        onReload={reload}
      />

      <Toolbar filters={filters} dispatch={dispatch} isFiltered={hasActiveFilters(filters)} />

      <StatusBanner isFallback={isFallback} errorMessage={errorMessage} onReload={reload} />

      <main className="results">
        {isLoading ? (
          <SkeletonList rows={PER_PAGE} />
        ) : result.total === 0 ? (
          <EmptyState onReset={resetFilters} />
        ) : (
          <>
            <JobList jobs={result.items} onSelect={setSelectedJob} />
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              from={result.from}
              to={result.to}
              total={result.total}
              onChange={(page) => dispatch({ type: 'page', value: page })}
            />
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Демо-проект: React 18 + TypeScript + Vite. Данные — публичное API
          arbeitnow.com, при недоступности подставляется локальный набор.
        </p>
        <p className="app-footer__hint">
          Пробел для проверки: попробуйте «react», затем включите фильтр Junior и
          отсортируйте по зарплате.
        </p>
      </footer>

      <JobDetails job={selectedJob} onClose={closeDetails} />
    </div>
  );
}

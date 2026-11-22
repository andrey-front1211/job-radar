import { salaryToMonthlyUsd } from './format';
import type { Filters, Job } from '../types';

/** Ищет совпадение по названию, компании и стеку. Регистр и лишние пробелы не важны. */
export function matchesQuery(job: Job, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  const haystack = [job.title, job.company, job.location, ...job.stack].join(' ').toLowerCase();

  // Каждое слово запроса должно найтись хотя бы где-то — это предсказуемее
  // простого includes по всей строке («react джуниор» найдёт больше, чем нужно).
  return needle
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}

export function filterJobs(jobs: Job[], filters: Filters): Job[] {
  return jobs.filter((job) => {
    if (filters.levels.length > 0 && !filters.levels.includes(job.level)) return false;
    if (filters.formats.length > 0 && !filters.formats.includes(job.workFormat)) return false;
    if (!matchesQuery(job, filters.query)) return false;
    return true;
  });
}

export function sortJobs(jobs: Job[], sort: Filters['sort']): Job[] {
  // Сортировка не мутирует входной массив — важно, т.к. массив приходит из state.
  const copy = [...jobs];

  switch (sort) {
    case 'date':
      return copy.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    case 'salary':
      return copy.sort((a, b) => {
        const left = salaryToMonthlyUsd(a.salary);
        const right = salaryToMonthlyUsd(b.salary);
        // Вакансии без зарплаты — всегда в конце.
        if (left === null && right === null) return 0;
        if (left === null) return 1;
        if (right === null) return -1;
        return right - left;
      });
    case 'title':
      return copy.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
    default:
      return copy;
  }
}

export interface PaginatedResult {
  items: Job[];
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
}

/**
 * Фильтрация + сортировка + пагинация в одной чистой функции.
 * Если после фильтрации текущая страница «уехала» за пределы — возвращаем последнюю доступную.
 */
export function applyFilters(jobs: Job[], filters: Filters, perPage: number): PaginatedResult {
  const filtered = filterJobs(jobs, filters);
  const sorted = sortJobs(filtered, filters.sort);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, filters.page), totalPages);
  const start = (page - 1) * perPage;
  const items = sorted.slice(start, start + perPage);

  return {
    items,
    page,
    totalPages,
    total,
    from: total === 0 ? 0 : start + 1,
    to: start + items.length,
  };
}

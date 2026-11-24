import { describe, expect, it } from 'vitest';
import { applyFilters, filterJobs, matchesQuery, sortJobs } from './filtering';
import { initialFilters } from '../state/filtersReducer';
import type { Filters, Job, Salary } from '../types';

const salary = (from: number | null, to: number | null): Salary => ({
  from,
  to,
  currency: 'RUB',
  period: 'month',
});

const makeJob = (overrides: Partial<Job> = {}): Job => ({
  id: 'test-1',
  title: 'Frontend Developer',
  company: 'Acme',
  location: 'Удалённо',
  workFormat: 'remote',
  level: 'junior',
  salary: salary(80000, 120000),
  stack: ['React', 'TypeScript'],
  postedAt: '2026-11-20T10:00:00.000Z',
  description: 'Описание',
  source: 'demo',
  ...overrides,
});

const withFilters = (overrides: Partial<Filters> = {}): Filters => ({
  ...initialFilters,
  ...overrides,
});

describe('matchesQuery', () => {
  it('пустой запрос совпадает с любой вакансией', () => {
    expect(matchesQuery(makeJob(), '   ')).toBe(true);
  });

  it('ищет по названию, компании и стеку без учёта регистра', () => {
    const job = makeJob({ title: 'Junior React Developer', company: 'Nordwind' });

    expect(matchesQuery(job, 'react')).toBe(true);
    expect(matchesQuery(job, 'NORDWIND')).toBe(true);
    expect(matchesQuery(job, 'typescript')).toBe(true);
    expect(matchesQuery(job, 'python')).toBe(false);
  });

  it('требует совпадения по всем словам запроса', () => {
    const job = makeJob({ title: 'Junior Python Developer', stack: ['Django'] });

    expect(matchesQuery(job, 'python django')).toBe(true);
    expect(matchesQuery(job, 'python react')).toBe(false);
  });
});

describe('filterJobs', () => {
  const jobs: Job[] = [
    makeJob({ id: '1', level: 'junior', workFormat: 'remote' }),
    makeJob({ id: '2', level: 'middle', workFormat: 'office' }),
    makeJob({ id: '3', level: 'senior', workFormat: 'hybrid' }),
  ];

  it('фильтрует по нескольким уровням сразу', () => {
    const result = filterJobs(jobs, withFilters({ levels: ['junior', 'senior'] }));
    expect(result.map((job) => job.id)).toEqual(['1', '3']);
  });

  it('фильтрует по формату работы', () => {
    const result = filterJobs(jobs, withFilters({ formats: ['remote'] }));
    expect(result.map((job) => job.id)).toEqual(['1']);
  });

  it('комбинирует уровень, формат и запрос', () => {
    const result = filterJobs(
      jobs,
      withFilters({ levels: ['junior'], formats: ['remote'], query: 'frontend' }),
    );
    expect(result).toHaveLength(1);
  });

  it('возвращает пустой массив, если ничего не подошло', () => {
    const result = filterJobs(jobs, withFilters({ query: 'kubernetes' }));
    expect(result).toEqual([]);
  });
});

describe('sortJobs', () => {
  const jobs: Job[] = [
    makeJob({ id: 'old', postedAt: '2026-11-01T00:00:00.000Z', salary: salary(50000, 70000) }),
    makeJob({ id: 'new', postedAt: '2026-11-22T00:00:00.000Z', salary: salary(200000, 250000) }),
    makeJob({ id: 'no-salary', postedAt: '2026-11-10T00:00:00.000Z', salary: null }),
  ];

  it('сортирует по дате: новые сверху', () => {
    expect(sortJobs(jobs, 'date').map((job) => job.id)).toEqual(['new', 'no-salary', 'old']);
  });

  it('сортирует по зарплате и уводит вакансии без зарплаты в конец', () => {
    expect(sortJobs(jobs, 'salary').map((job) => job.id)).toEqual(['new', 'old', 'no-salary']);
  });

  it('не мутирует исходный массив', () => {
    const snapshot = jobs.map((job) => job.id);
    sortJobs(jobs, 'salary');
    expect(jobs.map((job) => job.id)).toEqual(snapshot);
  });
});

describe('applyFilters', () => {
  const jobs = Array.from({ length: 20 }, (_, index) =>
    makeJob({ id: `job-${index}`, postedAt: `2026-11-${String(index + 1).padStart(2, '0')}T00:00:00.000Z` }),
  );

  it('делит результат на страницы и считает границы', () => {
    const result = applyFilters(jobs, withFilters({ page: 1 }), 8);

    expect(result.items).toHaveLength(8);
    expect(result.total).toBe(20);
    expect(result.totalPages).toBe(3);
    expect(result.from).toBe(1);
    expect(result.to).toBe(8);
  });

  it('возвращает последнюю доступную страницу, если запрошенная вне диапазона', () => {
    const result = applyFilters(jobs, withFilters({ page: 99 }), 8);

    expect(result.page).toBe(3);
    expect(result.items).toHaveLength(4);
    expect(result.from).toBe(17);
    expect(result.to).toBe(20);
  });

  it('не падает на пустом результате', () => {
    const result = applyFilters(jobs, withFilters({ query: 'нет-такой-вакансии' }), 8);

    expect(result.items).toEqual([]);
    expect(result.totalPages).toBe(1);
    expect(result.from).toBe(0);
    expect(result.to).toBe(0);
  });
});

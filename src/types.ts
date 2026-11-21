/** Уровень грейда вакансии. */
export type Level = 'junior' | 'middle' | 'senior';

/** Формат работы. */
export type WorkFormat = 'remote' | 'hybrid' | 'office';

/** Валюта зарплаты. */
export type Currency = 'USD' | 'EUR' | 'PLN' | 'GBP' | 'RUB';

/** Период, к которому относится зарплата. */
export type SalaryPeriod = 'month' | 'day' | 'year';

export interface Salary {
  /** Нижняя граница, может отсутствовать. */
  from: number | null;
  /** Верхняя граница, может отсутствовать. */
  to: number | null;
  currency: Currency;
  period: SalaryPeriod;
}

/**
 * Единая модель вакансии.
 * В неё маппятся и демо-данные, и ответ внешнего API —
 * весь остальной код приложения работает только с этой моделью.
 */
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  workFormat: WorkFormat;
  level: Level;
  /** null — если зарплата не указана (частый случай на реальных досках). */
  salary: Salary | null;
  /** Теги стека, максимум 8 штук. */
  stack: string[];
  /** ISO-дата публикации. */
  postedAt: string;
  description: string;
  url?: string;
  source: 'demo' | 'api';
}

export type SortKey = 'date' | 'salary' | 'title';

export interface Filters {
  query: string;
  levels: Level[];
  formats: WorkFormat[];
  sort: SortKey;
  page: number;
}

export interface JobsState {
  jobs: Job[];
  status: 'loading' | 'ready' | 'error';
  /** true, если показаны демо-данные вместо ответа API. */
  isFallback: boolean;
  errorMessage: string | null;
}

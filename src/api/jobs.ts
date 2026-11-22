import { mockJobs } from '../data/mockJobs';
import type { Job, Level, WorkFormat } from '../types';

/**
 * Публичное API без ключа и без регистрации.
 * Возвращает реальные вакансии (в основном европейский рынок).
 * Если запрос падает (CORS, офлайн, таймаут, 5xx) — приложение
 * переходит на демо-данные и честно сообщает об этом баннером.
 */
const API_URL = 'https://www.arbeitnow.com/api/job-board-api';
const REQUEST_TIMEOUT_MS = 8000;

interface ArbeitnowJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
}

interface ArbeitnowResponse {
  data: ArbeitnowJob[];
}

export interface FetchResult {
  jobs: Job[];
  isFallback: boolean;
  errorMessage: string | null;
}

/** Убирает html-теги, сущности и лишние пробелы из описания. */
export function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Эвристика определения грейда по заголовку.
 * У стороннего API нет поля «уровень», поэтому выводим его сами —
 * и это явно описано в README, чтобы не выдавать эвристику за факт.
 */
export function detectLevel(title: string): Level {
  const value = title.toLowerCase();
  if (/(senior|sr\.?|lead|principal|staff|head|architect)/.test(value)) return 'senior';
  if (/(junior|jr\.?|intern|trainee|graduate|entry)/.test(value)) return 'junior';
  return 'middle';
}

export function detectWorkFormat(remote: boolean, location: string): WorkFormat {
  if (remote) return 'remote';
  if (/hybrid/i.test(location)) return 'hybrid';
  return 'office';
}

/** Приводит теги к аккуратному виду: уникальные, не длиннее 8, с заглавной буквы. */
export function normalizeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const tag of tags) {
    const clean = tag.trim().replace(/\s+/g, ' ');
    if (!clean) continue;
    const pretty = clean.charAt(0).toUpperCase() + clean.slice(1);
    const key = pretty.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(pretty);
    if (result.length === 8) break;
  }

  return result;
}

export function mapApiJob(raw: ArbeitnowJob, index: number): Job {
  return {
    id: raw.slug || `api-${index}`,
    title: raw.title,
    company: raw.company_name,
    location: raw.location || 'Не указано',
    workFormat: detectWorkFormat(raw.remote, raw.location ?? ''),
    level: detectLevel(raw.title),
    salary: null, // API не отдаёт зарплату — показываем «не указана»
    stack: normalizeTags(raw.tags ?? []),
    postedAt: new Date((raw.created_at ?? 0) * 1000).toISOString(),
    description: stripHtml(raw.description ?? '').slice(0, 900),
    url: raw.url,
    source: 'api',
  };
}

export async function fetchJobs(signal?: AbortSignal): Promise<FetchResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  // Внешний signal (например, размонтирование компонента) тоже должен прерывать запрос.
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort, { once: true });

  try {
    const response = await fetch(API_URL, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`API ответил ${response.status} ${response.statusText}`);
    }

    const payload = (await response.json()) as ArbeitnowResponse;
    const jobs = (payload.data ?? []).map(mapApiJob);

    if (jobs.length === 0) {
      throw new Error('API вернул пустой список вакансий');
    }

    return { jobs, isFallback: false, errorMessage: null };
  } catch (error) {
    // Не считаем ошибкой отмену по размонтированию — просто отдаём демо-данные.
    const message =
      error instanceof DOMException && error.name === 'AbortError'
        ? 'Запрос к API прерван или превысил таймаут'
        : error instanceof Error
          ? error.message
          : 'Неизвестная ошибка при загрузке вакансий';

    return { jobs: mockJobs, isFallback: true, errorMessage: message };
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', onAbort);
  }
}

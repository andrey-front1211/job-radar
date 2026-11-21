import type { Currency, Level, Salary, WorkFormat } from '../types';

const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  PLN: 'zł',
  GBP: '£',
  RUB: '₽',
};

const PERIOD_SUFFIX: Record<Salary['period'], string> = {
  month: 'в месяц',
  day: 'в день',
  year: 'в год',
};

const AMOUNT_FORMATTER = new Intl.NumberFormat('ru-RU');

/**
 * Примерные курсы для нормализации зарплат при сортировке.
 * Это НЕ финансовый сервис: значения нужны только чтобы вакансии
 * в разных валютах можно было сравнивать между собой.
 */
const USD_RATE: Record<Currency, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  PLN: 0.25,
  RUB: 0.0125,
};

const PERIOD_TO_MONTH: Record<Salary['period'], number> = {
  day: 21, // рабочих дней в месяце
  month: 1,
  year: 1 / 12,
};

/** Человекочитаемая зарплата: «80 000 – 120 000 ₽ в месяц» или «не указана». */
export function formatSalary(salary: Salary | null): string {
  if (!salary) return 'не указана';

  const symbol = CURRENCY_SYMBOL[salary.currency];
  const prefix = salary.currency === 'USD' || salary.currency === 'EUR' ? symbol : '';
  const suffix = prefix ? '' : ` ${symbol}`;

  const formatAmount = (value: number, withCurrency = true): string => {
    const rounded = Math.round(value);
    // Суммы без копеек: на досках вакансий дробей не бывает.
    // Intl в ru-RU разделяет разряды неразрывным пробелом — приводим к обычному,
    // чтобы строку было предсказуемо сравнивать в тестах и копировать.
    const formatted = AMOUNT_FORMATTER.format(rounded).replace(/[\u00A0\u202F]/g, ' ');
    return `${prefix}${formatted}${withCurrency ? suffix : ''}`;
  };

  let range: string;
  if (salary.from !== null && salary.to !== null) {
    // Валюту пишем один раз — в конце диапазона: «80 000 – 120 000 ₽».
    range = `${formatAmount(salary.from, false)} – ${formatAmount(salary.to)}`;
  } else if (salary.from !== null) {
    range = `от ${formatAmount(salary.from)}`;
  } else if (salary.to !== null) {
    range = `до ${formatAmount(salary.to)}`;
  } else {
    return 'не указана';
  }

  return `${range} ${PERIOD_SUFFIX[salary.period]}`;
}

/**
 * Приводит зарплату к «условным долларам в месяц» — только для сортировки.
 * null означает «нет данных» и при сортировке уходит в конец списка.
 */
export function salaryToMonthlyUsd(salary: Salary | null): number | null {
  if (!salary) return null;
  const value = salary.to ?? salary.from;
  if (value === null || value <= 0) return null;
  return value * USD_RATE[salary.currency] * PERIOD_TO_MONTH[salary.period];
}

const RU_PLURAL_DAYS = (n: number): string => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'день';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'дня';
  return 'дней';
};

/** Относительная дата: «сегодня», «вчера», «3 дня назад», «2 недели назад». */
export function formatRelativeDate(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'дата неизвестна';

  const diffMs = now.getTime() - date.getTime();
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (days <= 0) return 'сегодня';
  if (days === 1) return 'вчера';
  if (days < 30) return `${days} ${RU_PLURAL_DAYS(days)} назад`;
  if (days < 60) return 'месяц назад';

  const months = Math.floor(days / 30);
  return `${months} мес. назад`;
}

export const LEVEL_LABEL: Record<Level, string> = {
  junior: 'Junior',
  middle: 'Middle',
  senior: 'Senior',
};

export const FORMAT_LABEL: Record<WorkFormat, string> = {
  remote: 'Удалённо',
  hybrid: 'Гибрид',
  office: 'Офис',
};

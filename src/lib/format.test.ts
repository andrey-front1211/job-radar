import { describe, expect, it } from 'vitest';
import { formatRelativeDate, formatSalary, salaryToMonthlyUsd } from './format';
import type { Salary } from '../types';

const makeSalary = (overrides: Partial<Salary> = {}): Salary => ({
  from: 80000,
  to: 120000,
  currency: 'RUB',
  period: 'month',
  ...overrides,
});

describe('formatSalary', () => {
  it('показывает диапазон в рублях', () => {
    expect(formatSalary(makeSalary())).toBe('80 000 – 120 000 ₽ в месяц');
  });

  it('показывает валюту перед числом для USD и EUR', () => {
    expect(formatSalary(makeSalary({ from: 3000, to: 4500, currency: 'EUR' }))).toBe(
      '€3 000 – €4 500 в месяц',
    );
  });

  it('поддерживает открытые границы', () => {
    expect(formatSalary(makeSalary({ from: 150000, to: null }))).toBe('от 150 000 ₽ в месяц');
    expect(formatSalary(makeSalary({ from: null, to: 90000 }))).toBe('до 90 000 ₽ в месяц');
  });

  it('учитывает период', () => {
    expect(formatSalary(makeSalary({ from: 175, to: null, currency: 'GBP', period: 'day' }))).toBe(
      'от 175 £ в день',
    );
  });

  it('возвращает «не указана» для null', () => {
    expect(formatSalary(null)).toBe('не указана');
  });
});

describe('salaryToMonthlyUsd', () => {
  it('нормализует дневную ставку к месяцу', () => {
    const monthly = salaryToMonthlyUsd(makeSalary({ from: 100, to: 100, currency: 'GBP', period: 'day' }));
    expect(monthly).toBeGreaterThan(2000);
  });

  it('возвращает null, если зарплаты нет', () => {
    expect(salaryToMonthlyUsd(null)).toBeNull();
  });

  it('позволяет сравнивать валюты между собой', () => {
    const rub = salaryToMonthlyUsd(makeSalary({ from: 300000, to: 300000, currency: 'RUB' }));
    const eur = salaryToMonthlyUsd(makeSalary({ from: 2000, to: 2000, currency: 'EUR' }));
    expect(rub).not.toBeNull();
    expect(eur).not.toBeNull();
    expect(rub!).toBeGreaterThan(eur!);
  });
});

describe('formatRelativeDate', () => {
  const now = new Date('2026-11-23T12:00:00.000Z');

  it('распознаёт «сегодня» и «вчера»', () => {
    expect(formatRelativeDate('2026-11-23T08:00:00.000Z', now)).toBe('сегодня');
    expect(formatRelativeDate('2026-11-22T08:00:00.000Z', now)).toBe('вчера');
  });

  it('склоняет дни правильно', () => {
    expect(formatRelativeDate('2026-11-21T08:00:00.000Z', now)).toBe('2 дня назад');
    expect(formatRelativeDate('2026-11-19T08:00:00.000Z', now)).toBe('4 дня назад');
    expect(formatRelativeDate('2026-11-13T08:00:00.000Z', now)).toBe('10 дней назад');
  });

  it('переходит на месяцы для старых дат', () => {
    expect(formatRelativeDate('2026-10-20T08:00:00.000Z', now)).toBe('месяц назад');
    expect(formatRelativeDate('2026-08-20T08:00:00.000Z', now)).toBe('3 мес. назад');
  });

  it('не падает на некорректной дате', () => {
    expect(formatRelativeDate('не-дата', now)).toBe('дата неизвестна');
  });
});

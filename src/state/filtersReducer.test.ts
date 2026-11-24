import { describe, expect, it } from 'vitest';
import { filtersReducer, hasActiveFilters, initialFilters } from './filtersReducer';

describe('filtersReducer', () => {
  it('меняет запрос и сбрасывает страницу на первую', () => {
    const state = filtersReducer({ ...initialFilters, page: 3 }, { type: 'query', value: 'react' });

    expect(state.query).toBe('react');
    expect(state.page).toBe(1);
  });

  it('включает и выключает уровень (toggle)', () => {
    const on = filtersReducer(initialFilters, { type: 'toggleLevel', value: 'junior' });
    expect(on.levels).toEqual(['junior']);

    const off = filtersReducer(on, { type: 'toggleLevel', value: 'junior' });
    expect(off.levels).toEqual([]);
  });

  it('поддерживает несколько уровней одновременно', () => {
    let state = filtersReducer(initialFilters, { type: 'toggleLevel', value: 'junior' });
    state = filtersReducer(state, { type: 'toggleLevel', value: 'senior' });

    expect(state.levels).toEqual(['junior', 'senior']);
  });

  it('переключает формат работы независимо от уровней', () => {
    const state = filtersReducer(initialFilters, { type: 'toggleFormat', value: 'remote' });

    expect(state.formats).toEqual(['remote']);
    expect(state.levels).toEqual([]);
  });

  it('меняет сортировку', () => {
    const state = filtersReducer(initialFilters, { type: 'sort', value: 'salary' });
    expect(state.sort).toBe('salary');
  });

  it('сбрасывает всё к дефолту', () => {
    const dirty = { query: 'python', levels: ['middle' as const], formats: ['remote' as const], sort: 'salary' as const, page: 4 };
    expect(filtersReducer(dirty, { type: 'reset' })).toEqual(initialFilters);
  });
});

describe('hasActiveFilters', () => {
  it('false для дефолтного состояния', () => {
    expect(hasActiveFilters(initialFilters)).toBe(false);
  });

  it('true при любом активном фильтре', () => {
    expect(hasActiveFilters({ ...initialFilters, query: 'go' })).toBe(true);
    expect(hasActiveFilters({ ...initialFilters, levels: ['junior'] })).toBe(true);
    expect(hasActiveFilters({ ...initialFilters, sort: 'title' })).toBe(true);
  });

  it('игнорирует строку из одних пробелов', () => {
    expect(hasActiveFilters({ ...initialFilters, query: '   ' })).toBe(false);
  });
});

import type { Filters, Level, SortKey, WorkFormat } from '../types';

export const initialFilters: Filters = {
  query: '',
  levels: [],
  formats: [],
  sort: 'date',
  page: 1,
};

export type FiltersAction =
  | { type: 'query'; value: string }
  | { type: 'toggleLevel'; value: Level }
  | { type: 'toggleFormat'; value: WorkFormat }
  | { type: 'sort'; value: SortKey }
  | { type: 'page'; value: number }
  | { type: 'reset' };

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

/**
 * Все фильтры меняются через редьюсер: состояние нельзя случайно
 * размазать по десятку useState, а переходы описаны в одном месте.
 * Любое изменение фильтра сбрасывает страницу на первую — иначе
 * пользователь остаётся на «странице 5» пустого результата.
 */
export function filtersReducer(state: Filters, action: FiltersAction): Filters {
  switch (action.type) {
    case 'query':
      return { ...state, query: action.value, page: 1 };
    case 'toggleLevel':
      return { ...state, levels: toggle(state.levels, action.value), page: 1 };
    case 'toggleFormat':
      return { ...state, formats: toggle(state.formats, action.value), page: 1 };
    case 'sort':
      return { ...state, sort: action.value, page: 1 };
    case 'page':
      return { ...state, page: action.value };
    case 'reset':
      return initialFilters;
    default:
      return state;
  }
}

/** true, если хотя бы один фильтр отличается от дефолтного. */
export function hasActiveFilters(filters: Filters): boolean {
  return (
    filters.query.trim() !== '' ||
    filters.levels.length > 0 ||
    filters.formats.length > 0 ||
    filters.sort !== initialFilters.sort
  );
}

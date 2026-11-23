import { FORMAT_LABEL, LEVEL_LABEL } from '../lib/format';
import type { FiltersAction } from '../state/filtersReducer';
import type { Filters, Level, SortKey, WorkFormat } from '../types';

const LEVELS: Level[] = ['junior', 'middle', 'senior'];
const FORMATS: WorkFormat[] = ['remote', 'hybrid', 'office'];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'date', label: 'Сначала новые' },
  { value: 'salary', label: 'По зарплате' },
  { value: 'title', label: 'По названию' },
];

interface ToolbarProps {
  filters: Filters;
  dispatch: React.Dispatch<FiltersAction>;
  isFiltered: boolean;
}

export function Toolbar({ filters, dispatch, isFiltered }: ToolbarProps) {
  return (
    <section className="toolbar" aria-label="Фильтры вакансий">
      <div className="search">
        <svg className="search__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
          <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          id="job-search"
          className="search__input"
          type="search"
          placeholder="Должность, компания или технология — например, «react»"
          value={filters.query}
          onChange={(event) => dispatch({ type: 'query', value: event.target.value })}
          autoComplete="off"
        />
        <label className="visually-hidden" htmlFor="job-search">
          Поиск вакансий
        </label>
      </div>

      <div className="filter-row">
        <fieldset className="chip-group">
          <legend className="visually-hidden">Уровень</legend>
          {LEVELS.map((level) => {
            const active = filters.levels.includes(level);
            return (
              <button
                key={level}
                type="button"
                className={`chip${active ? ' chip--active' : ''}`}
                onClick={() => dispatch({ type: 'toggleLevel', value: level })}
                aria-pressed={active}
              >
                {LEVEL_LABEL[level]}
              </button>
            );
          })}
        </fieldset>

        <fieldset className="chip-group">
          <legend className="visually-hidden">Формат работы</legend>
          {FORMATS.map((format) => {
            const active = filters.formats.includes(format);
            return (
              <button
                key={format}
                type="button"
                className={`chip${active ? ' chip--active' : ''}`}
                onClick={() => dispatch({ type: 'toggleFormat', value: format })}
                aria-pressed={active}
              >
                {FORMAT_LABEL[format]}
              </button>
            );
          })}
        </fieldset>

        <div className="toolbar__tail">
          <label className="select">
            <span className="select__label">Сортировка</span>
            <select
              className="select__control"
              value={filters.sort}
              onChange={(event) => dispatch({ type: 'sort', value: event.target.value as SortKey })}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="reset-button"
            onClick={() => dispatch({ type: 'reset' })}
            disabled={!isFiltered}
          >
            Сбросить
          </button>
        </div>
      </div>
    </section>
  );
}

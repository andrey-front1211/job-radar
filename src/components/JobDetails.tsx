import { useEffect, useRef } from 'react';
import { FORMAT_LABEL, formatRelativeDate, formatSalary } from '../lib/format';
import { LevelBadge } from './LevelBadge';
import type { Job } from '../types';

interface JobDetailsProps {
  job: Job | null;
  onClose: () => void;
}

/**
 * Панель с деталями вакансии.
 * Доступность: role="dialog", закрытие по Esc и по клику на подложку,
 * фокус переводится на кнопку закрытия, прокрутка страницы блокируется.
 */
export function JobDetails({ job, onClose }: JobDetailsProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = job !== null;

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('is-locked');
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('is-locked');
    };
  }, [isOpen, onClose]);

  if (!job) return null;

  return (
    <div className="drawer-root">
      <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        aria-describedby="drawer-company"
      >
        <div className="drawer__header">
          <div>
            <LevelBadge level={job.level} />
            <h2 className="drawer__title" id="drawer-title">
              {job.title}
            </h2>
            <p className="drawer__company" id="drawer-company">
              {job.company} · {job.location} · {FORMAT_LABEL[job.workFormat]}
            </p>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            ref={closeRef}
            aria-label="Закрыть"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <dl className="drawer__facts">
          <div>
            <dt>Зарплата</dt>
            <dd>{formatSalary(job.salary)}</dd>
          </div>
          <div>
            <dt>Опубликовано</dt>
            <dd>{formatRelativeDate(job.postedAt)}</dd>
          </div>
          <div>
            <dt>Источник</dt>
            <dd>{job.source === 'api' ? 'Внешнее API' : 'Демо-данные'}</dd>
          </div>
        </dl>

        <p className="drawer__text">{job.description}</p>

        {job.stack.length > 0 && (
          <div className="drawer__stack">
            <h3 className="drawer__subtitle">Стек</h3>
            <ul className="tags">
              {job.stack.map((tag) => (
                <li key={tag} className="tag">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="drawer__footer">
          {job.url ? (
            <a className="primary-button" href={job.url} target="_blank" rel="noreferrer noopener">
              Открыть оригинал
            </a>
          ) : (
            <p className="drawer__note">
              Это демонстрационная запись: ссылка на оригинальную вакансию отсутствует.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}

import { FORMAT_LABEL, formatRelativeDate, formatSalary } from '../lib/format';
import { LevelBadge } from './LevelBadge';
import type { Job } from '../types';

interface JobRowProps {
  job: Job;
  onSelect: (job: Job) => void;
}

export function JobRow({ job, onSelect }: JobRowProps) {
  const visibleStack = job.stack.slice(0, 5);
  const restCount = job.stack.length - visibleStack.length;

  return (
    <li className="job-row">
      <div className="job-row__main">
        <div className="job-row__title-line">
          <h3 className="job-row__title">
            <button type="button" className="link-button" onClick={() => onSelect(job)}>
              {job.title}
            </button>
          </h3>
          <LevelBadge level={job.level} />
        </div>

        <p className="job-row__meta">
          <span className="job-row__company">{job.company}</span>
          <span className="dot" aria-hidden="true" />
          <span>{job.location}</span>
          <span className="dot" aria-hidden="true" />
          <span>{FORMAT_LABEL[job.workFormat]}</span>
        </p>

        {visibleStack.length > 0 && (
          <ul className="tags" aria-label="Стек">
            {visibleStack.map((tag) => (
              <li key={tag} className="tag">
                {tag}
              </li>
            ))}
            {restCount > 0 && <li className="tag tag--muted">+{restCount}</li>}
          </ul>
        )}
      </div>

      <div className="job-row__side">
        <span className={`job-row__salary${job.salary ? '' : ' job-row__salary--empty'}`}>
          {formatSalary(job.salary)}
        </span>
        <span className="job-row__date">{formatRelativeDate(job.postedAt)}</span>
        <button type="button" className="ghost-button" onClick={() => onSelect(job)}>
          Подробнее
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
            <path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </li>
  );
}

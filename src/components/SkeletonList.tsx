/** Скелетоны на время загрузки: держат ту же сетку, что и реальные строки, чтобы не прыгала вёрстка. */
export function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <ul className="job-list" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <li className="job-row job-row--skeleton" key={index}>
          <div className="job-row__main">
            <span className="skeleton skeleton--title" />
            <span className="skeleton skeleton--meta" />
            <span className="skeleton skeleton--tags" />
          </div>
          <div className="job-row__side">
            <span className="skeleton skeleton--salary" />
            <span className="skeleton skeleton--date" />
          </div>
        </li>
      ))}
    </ul>
  );
}

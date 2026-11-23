import { JobRow } from './JobRow';
import type { Job } from '../types';

interface JobListProps {
  jobs: Job[];
  onSelect: (job: Job) => void;
}

export function JobList({ jobs, onSelect }: JobListProps) {
  return (
    <ul className="job-list" aria-label="Список вакансий">
      {jobs.map((job) => (
        <JobRow key={job.id} job={job} onSelect={onSelect} />
      ))}
    </ul>
  );
}

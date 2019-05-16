import { JobStatus } from './JobStatus';

export interface Job {
  id: string;
  url: string;
  status: JobStatus;
  content?: string;
  error?: string;
}

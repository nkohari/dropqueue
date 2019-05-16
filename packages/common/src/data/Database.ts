import { Job } from './Job';

export interface Database {
  createJob(url: string): Promise<Job>;
  getJob(id: string): Promise<Job | null>;
  updateJob(job: Job): Promise<void>;
  waitForJob(): Promise<Job | null>;
  disconnect(): Promise<void>;
}

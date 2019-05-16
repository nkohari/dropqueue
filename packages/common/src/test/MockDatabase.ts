import { Database } from '../data/Database';
import { Job } from '../data/Job';
import { uuid } from '../data/uuid';
import { Deferred } from '../Deferred';
import { dummyJobs } from './data';

export class MockDatabase implements Database {
  jobs: Record<string, Job>;
  queue: string[];
  waitingCallbacks: Deferred<Job>[];

  constructor() {
    this.jobs = {};
    this.queue = [];
    this.waitingCallbacks = [];
    this.reset();
  }

  reset() {
    this.jobs = { ...dummyJobs };
    this.queue = Object.values(dummyJobs)
      .filter(j => j.status === 'queued')
      .map(j => j.id);
    this.waitingCallbacks = [];
  }

  createJob(url: string): Promise<Job> {
    const job: Job = {
      id: uuid(),
      url,
      status: 'queued',
    };

    this.jobs[job.id] = { ...job };
    this.queue.push(job.id);
    this.flushWaitingCallbacks();

    return Promise.resolve(job);
  }

  getJob(id: string): Promise<Job | null> {
    const job = this.jobs[id];
    return Promise.resolve(job ? { ...job } : null);
  }

  updateJob(job: Job): Promise<void> {
    this.jobs[job.id] = { ...job };
    return Promise.resolve();
  }

  waitForJob(): Promise<Job | null> {
    const deferred = new Deferred<Job>();
    this.waitingCallbacks.push(deferred);
    return deferred.promise;
  }

  disconnect(): Promise<void> {
    return Promise.resolve();
  }

  flushWaitingCallbacks() {
    while (true) {
      const deferred = this.waitingCallbacks.shift();
      if (!deferred) break;
      const id = this.queue.shift();
      if (!id) break;
      deferred.resolve(this.jobs[id]);
    }
  }
}

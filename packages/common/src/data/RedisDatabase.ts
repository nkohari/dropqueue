import { createHandyClient, IHandyRedis } from 'handy-redis';
import { Database } from './Database';
import { Job } from './Job';
import { uuid } from './uuid';

const JOBS_LIST_KEY = 'jobs';

export class RedisDatabase implements Database {
  client: IHandyRedis;

  constructor(redisUrl: string) {
    this.client = createHandyClient(redisUrl);
  }

  async createJob(url: string): Promise<Job> {
    const job: Job = {
      id: uuid(),
      url,
      status: 'queued',
    };

    const key = this.getKey(job.id);
    await this.client.set(key, JSON.stringify(job));
    await this.client.rpush(JOBS_LIST_KEY, key);

    return job;
  }

  async getJob(id: string): Promise<Job | null> {
    const key = this.getKey(id);
    const json = await this.client.get(key);
    if (!json) {
      return null;
    } else {
      return JSON.parse(json) as Job;
    }
  }

  async updateJob(job: Job): Promise<void> {
    const key = this.getKey(job.id);
    await this.client.set(key, JSON.stringify(job));
  }

  async waitForJob(): Promise<Job | null> {
    const [list, key] = await this.client.blpop([JOBS_LIST_KEY], 0);
    if (!key) return null;
    const json = await this.client.get(key);
    if (!json) {
      throw new Error(`Invalid job key was found in the queue`);
    } else {
      return JSON.parse(json) as Job;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }

  private getKey(id: string) {
    return `job:${id}`;
  }
}

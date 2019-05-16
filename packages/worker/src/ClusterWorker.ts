import { Database, Job, Logger } from '@dropqueue/common';
import { Configuration } from './config';

export class ClusterWorker {
  config: Configuration;
  database: Database;
  log: Logger;
  handler: (job: Job) => Promise<void>;
  shuttingDown: boolean;

  constructor(config: Configuration, database: Database, log: Logger, handler: (job: Job) => Promise<void>) {
    this.config = config;
    this.database = database;
    this.log = log;
    this.handler = handler;
    this.shuttingDown = false;
  }

  start() {
    this.log.info('Worker started');
    this.processJobs();
  }

  stop() {
    this.shuttingDown = true;
    this.database.disconnect();
    this.log.info('Worker stopped');
  }

  private async processJobs() {
    while (!this.shuttingDown) {
      this.log.info('Waiting for jobs');
      const job = await this.database.waitForJob();
      if (job) {
        await this.handler(job);
        await this.database.updateJob(job);
      }
    }
  }
}

import * as cluster from 'cluster';
import { Logger } from '@dropqueue/common';
import { Configuration } from './Configuration';

export class ClusterManager {
  config: Configuration;
  log: Logger;
  shuttingDown: boolean;

  constructor(config: Configuration, log: Logger) {
    this.config = config;
    this.log = log;
    this.shuttingDown = false;
  }

  start() {
    process.on('SIGINT', () => {
      this.log.info('Caught SIGINT, shutting down');
      this.stop();
    });

    process.on('SIGTERM', () => {
      this.log.info('Caught SIGTERM, shutting down');
      this.stop();
    });

    for (let index = 0; index < this.config.workers; index++) {
      this.spawnWorker();
    }

    cluster.on('exit', (worker: cluster.Worker, code: number) => {
      if (!this.shuttingDown) {
        this.log.info(`Worker ${worker.process.pid} exited with code ${code}, spawning replacement`);
        this.spawnWorker();
      }
    });

    this.log.info(`Spawned ${this.config.workers} worker processes`);
  }

  stop() {
    this.shuttingDown = true;
    cluster.disconnect(() => {
      this.log.info('Cluster disconnected, exiting');
      process.exit(0);
    });
  }

  private spawnWorker() {
    cluster.fork();
  }
}

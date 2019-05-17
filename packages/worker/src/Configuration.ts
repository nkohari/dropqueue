import * as os from 'os';
import { readConfig } from '@dropqueue/common';

export interface Configuration {
  redisUrl: string;
  workers: number;
}

export function readConfigFromEnvironment(): Configuration {
  return {
    redisUrl: readConfig('REDIS_URL'),
    workers: Number(readConfig('WEB_CONCURRENCY', os.cpus().length)),
  };
}

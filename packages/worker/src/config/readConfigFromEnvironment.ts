import * as os from 'os';
import { readConfig } from '@dropqueue/common';
import { Configuration } from './Configuration';

export function readConfigFromEnvironment(): Configuration {
  return {
    redisUrl: readConfig('REDIS_URL'),
    workers: Number(readConfig('WEB_CONCURRENCY', os.cpus().length)),
  };
}

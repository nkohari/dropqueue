import { readConfig } from '@dropqueue/common';
import { Configuration } from './Configuration';

export function readConfigFromEnvironment(): Configuration {
  return {
    baseUrl: readConfig('BASE_URL'),
    port: Number(readConfig('PORT')),
    redisUrl: readConfig('REDIS_URL'),
  };
}

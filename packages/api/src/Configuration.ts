import { readConfig } from '@dropqueue/common';

export interface Configuration {
  baseUrl: string;
  port: number;
  redisUrl: string;
}

export function readConfigFromEnvironment(): Configuration {
  return {
    baseUrl: readConfig('BASE_URL'),
    port: Number(readConfig('PORT')),
    redisUrl: readConfig('REDIS_URL'),
  };
}

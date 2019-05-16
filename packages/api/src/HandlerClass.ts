import { Database, Logger } from '@dropqueue/common';
import { Configuration } from './config';
import { Handler } from './Handler';

export interface HandlerClass {
  new (config: Configuration, database: Database, log: Logger): Handler;
}

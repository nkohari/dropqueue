import { Request, ResponseToolkit, RouteOptionsValidate } from 'hapi';
import { Database, Logger } from '@dropqueue/common';
import { Configuration } from './config';

export abstract class Handler {
  config: Configuration;
  database: Database;
  log: Logger;

  abstract route: string;
  schema: RouteOptionsValidate | undefined;

  constructor(config: Configuration, database: Database, log: Logger) {
    this.config = config;
    this.database = database;
    this.log = log;
  }

  abstract handle(request: Request, h?: ResponseToolkit): Promise<any>;
}

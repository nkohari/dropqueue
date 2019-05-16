import { Server } from 'hapi';
import { Database, Logger } from '@dropqueue/common';
import { Configuration } from './config';
import { HandlerClass } from './HandlerClass';
import * as handlers from './handlers';

export class ApiServer {
  server: Server;
  config: Configuration;
  database: Database;
  log: Logger;

  constructor(config: Configuration, database: Database, log: Logger) {
    this.config = config;
    this.database = database;
    this.log = log;
    this.server = new Server({
      address: '0.0.0.0',
      port: config.port,
    });
  }

  configure() {
    for (const name in handlers) {
      const handlerClass = (handlers as Record<string, HandlerClass>)[name];
      const handler = new handlerClass(this.config, this.database, this.log);
      const [method, path] = handler.route.split(/\s+/, 2);

      this.server.route({
        method,
        path,
        handler: (request, h) => handler.handle(request, h),
        options: {
          id: handler.constructor.name,
          json: { space: 2 },
          validate: handler.schema,
        },
      });

      this.log.info(`Mounted ${name} at ${method} ${path}`);
    }
  }

  start() {
    this.server.start();
  }

  stop() {
    this.server.stop();
    this.database.disconnect();
  }
}

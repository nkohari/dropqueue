import { Headers } from 'shot';
import { MockDatabase, MockLogger } from '@dropqueue/common';
import { ApiServer } from '../ApiServer';
import { Configuration } from '../Configuration';

type Payload = string | Buffer | object;

interface RequestOptions {
  headers?: Headers;
}

export class Tester {
  config: Configuration;
  database: MockDatabase;
  log: MockLogger;
  server: ApiServer;

  constructor() {
    this.database = new MockDatabase();
    this.log = new MockLogger();
    this.config = {
      port: 0,
      baseUrl: 'http://test.local/',
      redisUrl: '',
    };

    this.server = new ApiServer(this.config, this.database, this.log);
    this.server.configure();
  }

  get(url: string, options: RequestOptions = {}) {
    return this.server.server.inject({ ...options, url, method: 'get' });
  }

  post(url: string, payload: Payload, options: RequestOptions = {}) {
    return this.server.server.inject({ ...options, url, method: 'post', payload });
  }

  put(url: string, payload: Payload, options: RequestOptions = {}) {
    return this.server.server.inject({ ...options, url, method: 'put', payload });
  }

  delete(url: string, options: RequestOptions = {}) {
    return this.server.server.inject({ ...options, url, method: 'delete' });
  }
}

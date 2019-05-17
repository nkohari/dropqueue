import * as dotenv from 'dotenv';
dotenv.config();

import * as cluster from 'cluster';
import { createLogger, RedisDatabase } from '@dropqueue/common';
import { ClusterManager } from './ClusterManager';
import { ClusterWorker } from './ClusterWorker';
import { readConfigFromEnvironment } from './Configuration';
import { createJobHandler } from './createJobHandler';

const config = readConfigFromEnvironment();
const log = createLogger('dropqueue-worker');

if (cluster.isMaster) {
  const manager = new ClusterManager(config, log);
  manager.start();
} else {
  const database = new RedisDatabase(config.redisUrl);
  const handler = createJobHandler(log);
  const worker = new ClusterWorker(config, database, log, handler);
  worker.start();
}

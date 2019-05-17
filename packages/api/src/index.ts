import * as dotenv from 'dotenv';
dotenv.config();

import { createLogger, RedisDatabase } from '@dropqueue/common';
import { ApiServer } from './ApiServer';
import { readConfigFromEnvironment } from './Configuration';

const config = readConfigFromEnvironment();
const database = new RedisDatabase(config.redisUrl);
const log = createLogger('dropqueue-api');
const server = new ApiServer(config, database, log);

server.configure();
server.start();

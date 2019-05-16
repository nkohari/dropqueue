import * as bunyan from 'bunyan';
import { Logger } from './Logger';

export const createLogger = (name: string): Logger =>
  bunyan.createLogger({
    name,
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  });

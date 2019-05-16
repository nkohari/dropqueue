import { Logger } from '@dropqueue/common';

export class MockLogger implements Logger {
  trace(message: string | object | Error, ...params: any[]): void {}
  debug(message: string | object | Error, ...params: any[]): void {}
  info(message: string | object | Error, ...params: any[]): void {}
  warn(message: string | object | Error, ...params: any[]): void {}
  error(message: string | object | Error, ...params: any[]): void {}
  fatal(message: string | object | Error, ...params: any[]): void {}
}

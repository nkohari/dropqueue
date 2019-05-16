type MessageErrorOrFormat = Error | object | string;

export interface Logger {
  trace(message: MessageErrorOrFormat, ...params: any[]): void;
  debug(message: MessageErrorOrFormat, ...params: any[]): void;
  info(message: MessageErrorOrFormat, ...params: any[]): void;
  warn(message: MessageErrorOrFormat, ...params: any[]): void;
  error(message: MessageErrorOrFormat, ...params: any[]): void;
  fatal(message: MessageErrorOrFormat, ...params: any[]): void;
}

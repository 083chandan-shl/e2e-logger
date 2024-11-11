import { env } from 'node:process';

import { LogLevel } from '@models/index';

const console = global.console;
const LogLevelToNumber = (logLevel: LogLevel): number => {
  switch (logLevel) {
    case 'DEBUG':
      return 0;
    case 'INFO':
      return 1;
    default:
    case 'WARN':
      return 2;
    case 'ERROR':
      return 3;
  }
};
const writeLog = (
  message: string | object,
  color?: 'default' | 'blue' | 'yellow' | 'red',
  error?: Error,
) =>
  color !== undefined
    ? error
      ? console.log(`%c` + message, `color:${color};`, error)
      : console.log(`%c` + message, `color:${color};`)
    : error
    ? console.log(message, error)
    : console.log(message);

type LogFunction = (
  message: string | object,
  level?: LogLevel,
  error?: Error,
) => void;

const logMessage: LogFunction = (
  message: string | object,
  level: LogLevel = 'WARN',
  error?: Error,
) => {
  /**
   * DEBUG = 0
   * INFO = 1
   * WARN = 2
   * ERROR = 3
   */
  const configuredLogLevel = getConfiguredLogLevel();
  if (configuredLogLevel === 'DEBUG')
    if (typeof message === 'object') {
      writeLog(`[${level}]`, 'blue');
      writeLog(message, undefined);
    } else {
      error
        ? writeLog(`[${level}] ${message}`, 'blue', error)
        : writeLog(`[${level}] ${message}`, 'blue');
    }
  if (configuredLogLevel === 'INFO' && LogLevelToNumber(level) > 0)
    if (typeof message === 'object') {
      writeLog(`[${level}]`, undefined);
      writeLog(message, undefined);
    } else {
      error
        ? writeLog(`[${level}] ${message}`, undefined, error)
        : writeLog(`[${level}] ${message}`);
    }
  if (configuredLogLevel === 'WARN' && LogLevelToNumber(level) > 1)
    if (typeof message === 'object') {
      writeLog(`[${level}]`, 'yellow');
      writeLog(message, undefined);
    } else {
      error
        ? writeLog(`[${level}] ${message}`, 'yellow', error)
        : writeLog(`[${level}] ${message}`, 'yellow');
    }
  if (configuredLogLevel === 'ERROR' && LogLevelToNumber(level) === 3)
    if (typeof message === 'object') {
      writeLog(`[${level}]`, 'red');
      writeLog(message, undefined);
    } else {
      error
        ? writeLog(`[${level}] ${message}`, 'red', error)
        : writeLog(`[${level}] ${message}`, 'red');
    }
};
const getConfiguredLogLevel: () => LogLevel = () => {
  if (env.LOG_LEVEL !== undefined) return env.LOG_LEVEL as LogLevel;
  return 'WARN';
};
const logWarning = (messageOrObject: string | object, error?: Error) => {
  logMessage(messageOrObject, 'WARN', error);
};
const logError = (messageOrObject: string | object, error?: Error) => {
  logMessage(messageOrObject, 'ERROR', error);
};
const logInfo = (messageOrObject: string | object, error?: Error) => {
  logMessage(messageOrObject, 'INFO', error);
};
const logDebug = (messageOrObject: string | object, error?: Error) => {
  logMessage(messageOrObject, 'DEBUG', error);
};

export class Logger {
  private constructor() {}
  static log = logMessage;
  static error = logError;
  static warn = logWarning;
  static info = logInfo;
  static debug = logDebug;
}

import { LogLevel } from '@models/LogLevel';

import { env } from 'node:process';

import rewire from 'rewire';

import { Logger } from './Logger';

describe('e2e-logger', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rewireLogger: any;
  beforeAll(() => {
    rewireLogger = rewire('../../dist/logger/Logger');
  });
  afterAll(() => jest.resetAllMocks());
  describe('Logger', () => {});
  describe.skip('getConfiguredLogLevel configuration observer', () => {
    // TODO Ersetzen der process.env funktioniert während der Tests noch nicht, aktualisieren zu gegebener Zeit
    beforeEach(() => {
      rewireLogger = rewire('../../dist/logger/Logger');
      delete process.env.LOG_LEVEL;
      // env.LOG_LEVEL = undefined;
    });
    afterAll(() => jest.resetAllMocks());
    it.each(['DEBUG', 'INFO', 'WARN', 'ERROR'])(
      'should return the configured log level %s',
      (logLevel) => {
        const getConfiguredLogLevel = rewireLogger.__get__(
          'getConfiguredLogLevel',
        );
        console.log('Log Level was ' + env.LOG_LEVEL);
        env.LOG_LEVEL = logLevel;
        console.log('Log Level is now ' + env.LOG_LEVEL);
        expect(getConfiguredLogLevel()).toBe(logLevel);
      },
    );
  });
  describe('logMessage', () => {
    const oldEnv = process.env;
    afterEach(() => {
      process.env = oldEnv;
    });
    beforeEach(() => {
      jest.resetModules();
    });
    afterAll(() => jest.resetAllMocks());
    it.each(['DEBUG', 'INFO', 'WARN', 'ERROR'])(
      'calls logMessage for log level %s',
      (logLevel) => {
        const message = 'Test message';
        process.env.LOG_LEVEL = logLevel;
        jest.restoreAllMocks();
        const logMessageSpy = jest
          .spyOn(Logger, 'log')
          .mockImplementation(jest.fn());
        expect(() => Logger.log(message, logLevel as LogLevel)).not.toThrow();
        expect(logMessageSpy).toHaveBeenCalledTimes(1);
        expect(logMessageSpy).toHaveBeenCalledWith(message, logLevel);
      },
    );
    it('calls logMessage without given log level', () => {
      const message = 'Test message';
      jest.restoreAllMocks();
      const logMessageSpy = jest
        .spyOn(Logger, 'log')
        .mockImplementation(jest.fn());
      expect(() => Logger.log(message)).not.toThrow();
      expect(logMessageSpy).toHaveBeenCalledTimes(1);
      expect(logMessageSpy).toHaveBeenCalledWith(message);
    });
  });
  describe('writeLog', () => {
    let writeLog: (
      message: string,
      color?: 'default' | 'blue' | 'yellow' | 'red',
      error?: Error,
    ) => void;
    let consoleLogSpy: unknown;
    beforeAll(() => {
      writeLog = rewireLogger.__get__('writeLog');
      console = rewireLogger.__get__('console');
      expect(typeof writeLog).toBe('function');
      expect(writeLog).not.toBeUndefined();
    });
    beforeEach(() => {
      jest.restoreAllMocks();
      consoleLogSpy = jest
        .spyOn(global.console, 'log')
        .mockImplementation(jest.fn());
    });
    afterAll(() => jest.resetAllMocks());

    it('logs the message without color and error', () => {
      const message = 'Test message';
      writeLog(message);
      expect(consoleLogSpy).toHaveBeenCalledWith(message);
    });

    it('logs the message with color and without error', () => {
      const message = 'Test message';
      const color = 'blue';
      writeLog(message, color);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `%c${message}`,
        `color:${color}`,
      );
    });

    it('logs the message with color and error', () => {
      const message = 'Test message';
      const color = 'red';
      const error = new Error('Test error');
      writeLog(message, color, error);
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `%c${message}`,
        `color:${color}`,
        error,
      );
    });
  });
  describe('console access', () => {
    let consoleRewire: typeof console;
    beforeAll(() => {
      consoleRewire = rewireLogger.__get__('console');
    });
    afterAll(() => jest.resetAllMocks());
    it('access the global console object', () => {
      expect(typeof consoleRewire).toEqual(typeof global.console);
    });
  });
  describe('LogLevelToNumber factory', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let LogLevelToNumber: any;
    beforeAll(() => {
      LogLevelToNumber = rewireLogger.__get__('LogLevelToNumber');
    });
    afterAll(() => jest.resetAllMocks());

    it.each([
      { givenLogLevel: 'DEBUG', expectedNumber: 0 },
      { givenLogLevel: 'INFO', expectedNumber: 1 },
      { givenLogLevel: 'WARN', expectedNumber: 2 },
      { givenLogLevel: 'ERROR', expectedNumber: 3 },
    ])(
      'transforms the correct number for the given log level $givenLogLevel',
      (testDataSet) => {
        const numberOfLogLevel = LogLevelToNumber(testDataSet.givenLogLevel);
        expect(numberOfLogLevel).toBe(testDataSet.expectedNumber);
      },
    );
  });
});

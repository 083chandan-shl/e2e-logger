import { LogLevel } from '@models/index';
type LogFunction = (message: string | object, level?: LogLevel, error?: Error) => void;
export declare class Logger {
    private constructor();
    static log: LogFunction;
    static error: (messageOrObject: string | object, error?: Error | undefined) => void;
    static warn: (messageOrObject: string | object, error?: Error | undefined) => void;
    static info: (messageOrObject: string | object, error?: Error | undefined) => void;
    static debug: (messageOrObject: string | object, error?: Error | undefined) => void;
}
export {};

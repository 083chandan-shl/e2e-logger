"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const node_process_1 = require("node:process");
const console = global.console;
const LogLevelToNumber = (logLevel) => {
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
const writeLog = (message, color, error) => color !== undefined
    ? error
        ? console.log(`%c` + message, `color:${color};`, error)
        : console.log(`%c` + message, `color:${color};`)
    : error
        ? console.log(message, error)
        : console.log(message);
const logMessage = (message, level = 'WARN', error) => {
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
        }
        else {
            error
                ? writeLog(`[${level}] ${message}`, 'blue', error)
                : writeLog(`[${level}] ${message}`, 'blue');
        }
    if (configuredLogLevel === 'INFO' && LogLevelToNumber(level) > 0)
        if (typeof message === 'object') {
            writeLog(`[${level}]`, undefined);
            writeLog(message, undefined);
        }
        else {
            error
                ? writeLog(`[${level}] ${message}`, undefined, error)
                : writeLog(`[${level}] ${message}`);
        }
    if (configuredLogLevel === 'WARN' && LogLevelToNumber(level) > 1)
        if (typeof message === 'object') {
            writeLog(`[${level}]`, 'yellow');
            writeLog(message, undefined);
        }
        else {
            error
                ? writeLog(`[${level}] ${message}`, 'yellow', error)
                : writeLog(`[${level}] ${message}`, 'yellow');
        }
    if (configuredLogLevel === 'ERROR' && LogLevelToNumber(level) === 3)
        if (typeof message === 'object') {
            writeLog(`[${level}]`, 'red');
            writeLog(message, undefined);
        }
        else {
            error
                ? writeLog(`[${level}] ${message}`, 'red', error)
                : writeLog(`[${level}] ${message}`, 'red');
        }
};
const getConfiguredLogLevel = () => {
    if (node_process_1.env.LOG_LEVEL !== undefined)
        return node_process_1.env.LOG_LEVEL;
    return 'WARN';
};
const logWarning = (messageOrObject, error) => {
    logMessage(messageOrObject, 'WARN', error);
};
const logError = (messageOrObject, error) => {
    logMessage(messageOrObject, 'ERROR', error);
};
const logInfo = (messageOrObject, error) => {
    logMessage(messageOrObject, 'INFO', error);
};
const logDebug = (messageOrObject, error) => {
    logMessage(messageOrObject, 'DEBUG', error);
};
class Logger {
    constructor() { }
}
exports.Logger = Logger;
Logger.log = logMessage;
Logger.error = logError;
Logger.warn = logWarning;
Logger.info = logInfo;
Logger.debug = logDebug;

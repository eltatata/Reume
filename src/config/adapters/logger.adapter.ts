import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
  },
};

winston.addColors(customLevels.colors);

const logDirectory = path.resolve(__dirname, '../../logs');
const { NODE_ENV } = process.env;
const isDevelopment = NODE_ENV === 'development';
const isTest = NODE_ENV === 'test';
const isProduction = NODE_ENV === 'production';

const timestampFormat = winston.format.timestamp({
  format: 'YYYY-MM-DD HH:mm:ss',
});
const jsonFormat = winston.format.json();
const errorStackFormat = winston.format.errors({ stack: true });

const transports: winston.transport[] = [];

if (isProduction) {
  transports.push(
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        timestampFormat,
        errorStackFormat,
        jsonFormat,
      ),
    }),
  );
  transports.push(
    new DailyRotateFile({
      level: 'error',
      dirname: logDirectory,
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      format: winston.format.combine(
        timestampFormat,
        errorStackFormat,
        jsonFormat,
      ),
    }),
    new DailyRotateFile({
      level: 'info',
      dirname: logDirectory,
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(timestampFormat, jsonFormat),
    }),
  );
} else if (isDevelopment) {
  transports.push(
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        timestampFormat,
        winston.format.printf(
          ({ level, message, timestamp, stack, ...meta }) => {
            const base = `${timestamp} [${level}]: ${message}`;
            const rest = Object.keys(meta).length ? JSON.stringify(meta) : '';
            return stack ? `${base} - ${stack}` : `${base} ${rest}`;
          },
        ),
      ),
    }),
  );
} else if (isTest) {
  transports.push(new winston.transports.Console({ silent: true }));
}

export const logger = winston.createLogger({
  levels: customLevels.levels,
  level: isDevelopment ? 'debug' : isProduction ? 'info' : 'warn',
  transports,
  exitOnError: false,
});

export function loggerAdapter(service: string) {
  return {
    log: (message: string) => logger.log('info', message, { service }),
    error: (message: string) =>
      logger.log('error', message, {
        service,
        at: new Date().toISOString(),
      }),
  };
}

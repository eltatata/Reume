import morgan, { StreamOptions } from 'morgan';
import { envs, logger } from '../';

const stream: StreamOptions = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

const skip = () => envs.NODE_ENV === 'test';

const customFormat = ':method :url :status - ":user-agent"';

export function morganAdapter() {
  return morgan(customFormat, { stream, skip });
}

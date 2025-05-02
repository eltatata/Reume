import { Response } from 'express';
import { logger } from '../../config';
import { CustomError } from '../../domain';

export class ErrorHandlerService {
  static handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      logger.warn(`${error}`);
      return res.status(error.statusCode).json({ error: error.message });
    }

    logger.error(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

import { Response } from 'express';
import { envs } from '../../config';
import { CustomError } from '../../domain';

export class ErrorHandlerService {
  static handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    if (envs.NODE_ENV === 'development') console.error(`Error: ${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

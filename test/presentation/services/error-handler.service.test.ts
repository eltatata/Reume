import { Response } from 'express';
import { CustomError } from '../../../src/domain';
import { ErrorHandlerService } from '../../../src/presentation';

describe('ErrorHandlerService', () => {
  it('should handle custom errors', () => {
    const error = CustomError.badRequest('Test error');
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    ErrorHandlerService.handleError(error, res as unknown as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Test error' });
  });

  it('should handle unknown errors', () => {
    const error = new Error('Unknown error');
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    ErrorHandlerService.handleError(error, res as unknown as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});

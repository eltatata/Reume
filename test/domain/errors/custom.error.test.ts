import { CustomError } from '../../../src/domain';

describe('CustomError', () => {
  test('should create a custom error', () => {
    const error = new CustomError(400, 'Custom error message');
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Custom error message');
  });

  test('should create a bad request error', () => {
    const error = CustomError.badRequest('Custom error message');
    expect(error).toBeInstanceOf(CustomError);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Custom error message');
  });

  test('should create a not found error', () => {
    const error = CustomError.notFound('Custom error message');
    expect(error).toBeInstanceOf(CustomError);
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Custom error message');
  });

  test('should create a unauthorized error', () => {
    const error = CustomError.unauthorized('Custom error message');
    expect(error).toBeInstanceOf(CustomError);
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Custom error message');
  });

  test('should create a forbidden error', () => {
    const error = CustomError.forbidden('Custom error message');
    expect(error).toBeInstanceOf(CustomError);
    expect(error.statusCode).toBe(403);
    expect(error.message).toBe('Custom error message');
  });

  test('should create a conflict error', () => {
    const error = CustomError.conflict('Custom error message');
    expect(error).toBeInstanceOf(CustomError);
    expect(error.statusCode).toBe(409);
    expect(error.message).toBe('Custom error message');
  });

  test('should create a internal server error', () => {
    const error = CustomError.internalServer('Custom error message');
    expect(error).toBeInstanceOf(CustomError);
    expect(error.statusCode).toBe(500);
    expect(error.message).toBe('Custom error message');
  });
});

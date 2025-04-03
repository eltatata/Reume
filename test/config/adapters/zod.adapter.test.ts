import { z } from 'zod';
import { ZodAdapter } from '../../../src/config/adapters/zod.adapter';

describe('ZodAdapter', () => {
  test('should validate a schema', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
      email: z.string().email(),
    });

    const result = ZodAdapter.validate(schema, {
      name: 'John',
      age: 30,
      email: 'john@example.com',
    });

    expect(result.validatedData).toEqual({
      name: 'John',
      age: 30,
      email: 'john@example.com',
    });
  });

  test('should return errors when validation fails', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
      email: z.string().email(),
    });

    const result = ZodAdapter.validate(schema, {
      name: 'John',
      age: 30,
      email: 'invalid-email',
    });

    expect(result.errors).toEqual([
      { field: 'email', message: 'Invalid email' },
    ]);
  });

  test('should handle unknown validation errors', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
      email: z.string().email(),
    });

    const mockError = new Error('Some unexpected error');
    jest.spyOn(schema, 'parse').mockImplementation(() => {
      throw mockError;
    });

    const result = ZodAdapter.validate(schema, {
      name: 'John',
      age: 30,
      email: 'john@example.com',
    });

    expect(result.errors).toEqual([
      { field: 'unknown', message: 'Unknown validation error' },
    ]);
  });
});

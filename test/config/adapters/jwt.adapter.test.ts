import { jwtAdapter } from '../../../src/config/';

describe('JwtAdapter', () => {
  const payload = { id: '123', name: 'John Doe' };

  test('should generate a valid JWT token as a string', async () => {
    const token = await jwtAdapter.generateToken(payload);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  test('should verify a valid token and return the correct payload', async () => {
    const token = await jwtAdapter.generateToken(payload);
    const decoded = await jwtAdapter.verifyToken(token!);

    expect(decoded).toBeDefined();
    expect(decoded).toMatchObject(payload);
  });

  test('should return null for an invalid token', async () => {
    const result = await jwtAdapter.verifyToken('invalid.token.here');
    expect(result).toBeNull();
  });
});

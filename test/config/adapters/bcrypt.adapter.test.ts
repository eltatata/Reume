import { bcryptAdapter } from '../../../src/config';

describe('bcryptAdapter', () => {
  test('should hash a password', () => {
    const password = 'password';
    const hashedPassword = bcryptAdapter.hash(password);

    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(password);
  });

  test('should compare a password', () => {
    const password = 'password';
    const hashedPassword = bcryptAdapter.hash(password);

    const isMatch = bcryptAdapter.compare(password, hashedPassword);
    expect(isMatch).toBe(true);
  });
});

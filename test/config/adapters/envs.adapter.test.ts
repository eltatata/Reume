import { envs } from '../../../src/config';

describe('envs', () => {
  test('should have all required environment variables with correct types', () => {
    expect(envs).toHaveProperty('NODE_ENV', expect.any(String));
    expect(envs).toHaveProperty('PORT', expect.any(Number));
    expect(envs).toHaveProperty('DATABASE_URL', expect.any(String));
    expect(envs).toHaveProperty('POSTGRES_USER', expect.any(String));
    expect(envs).toHaveProperty('POSTGRES_PASSWORD', expect.any(String));
    expect(envs).toHaveProperty('POSTGRES_DB', expect.any(String));
    expect(envs).toHaveProperty('RESEND_API_KEY', expect.any(String));
    expect(envs).toHaveProperty('JWT_SECRET', expect.any(String));
    expect(envs).toHaveProperty('REUME_FRONTEND_URL', expect.any(String));
    expect(envs).toHaveProperty('ORIGIN_URL', expect.any(String));
  });
});

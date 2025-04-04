import { envs } from '../../../src/config';

describe('envs', () => {
  test('should return the environment variables', async () => {
    expect(envs).toEqual({
      NODE_ENV: 'test',
      PORT: 3000,
      DATABASE_URL:
        'postgresql://postgres:postgres@localhost:5433/reume_test?schema=public',
      POSTGRES_USER: 'postgres',
      POSTGRES_PASSWORD: 'postgres',
      POSTGRES_DB: 'reume_test',
    });
  });
});

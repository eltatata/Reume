import { registerUserSchema } from '../../../src/config/schemas/user-dtos.schemas';

describe('registerUserSchema', () => {
  test('should validate a valid user', () => {
    const user = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'Password123!',
      phone: '+1234567890',
    };

    const result = registerUserSchema.safeParse(user);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(user);
  });
});

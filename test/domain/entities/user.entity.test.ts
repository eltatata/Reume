import { UserEntity, UserRole } from '../../../src/domain/';

describe('UserEntity', () => {
  test('should convert user to JSON object', () => {
    const user = {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password',
      role: UserRole.USER,
      verified: true,
      createdAt: new Date('2023-01-01'),
      phone: '+1234567890',
    };

    const result = UserEntity.toJSON(user);

    expect(result).toEqual({
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: UserRole.USER,
      verified: true,
      createdAt: new Date('2023-01-01'),
      phone: '+1234567890',
    });
  });
});

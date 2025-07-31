import { UserEntity, UserRole } from '../../../../src/domain';
import { UpdateUserRole } from '../../../../src/application';

describe('UpdateUserRole', () => {
  const userRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const updateUserRole = new UpdateUserRole(userRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should update user role successfully', async () => {
    const user = new UserEntity(
      '123e4567-e89b-12d3-a456-426614174001',
      'John',
      'Doe',
      'john.doe@example.com',
      UserRole.USER,
      true,
      new Date(),
      '+1234567890',
    );

    userRepository.findById.mockResolvedValue(user);
    userRepository.update.mockResolvedValue(user);

    const result = await updateUserRole.execute(
      '123e4567-e89b-12d3-a456-426614174001',
      { role: UserRole.ADMIN },
    );

    expect(result).toEqual(user);
    expect(userRepository.findById).toHaveBeenCalledWith(user.id);
    expect(userRepository.update).toHaveBeenCalledWith(user.id, {
      role: UserRole.ADMIN,
    });
  });

  test('should throw not found error when user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(
      updateUserRole.execute('123e4567-e89b-12d3-a456-426614174001', {
        role: UserRole.ADMIN,
      }),
    ).rejects.toThrow('User not found');
  });
});

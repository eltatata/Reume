import { UserEntity, UserRole } from '../../../../src/domain';
import { DeleteUser } from '../../../../src/application';

describe('DeleteUser', () => {
  const userRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const deleteUser = new DeleteUser(userRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should delete user successfully', async () => {
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
    userRepository.delete.mockResolvedValue(user);

    await deleteUser.execute(
      '123e4567-e89b-12d3-a456-426614174001',
      '123e4567-e89b-12d3-a456-426614174001',
      UserRole.USER,
    );

    expect(userRepository.findById).toHaveBeenCalledWith(user.id);
    expect(userRepository.delete).toHaveBeenCalledWith(user.id);
  });

  test('should throw forbidden error when user tries to delete another user', async () => {
    await expect(
      deleteUser.execute(
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174002',
        UserRole.USER,
      ),
    ).rejects.toThrow('You do not have permission to delete this user');
  });

  test('should throw not found error when user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(
      deleteUser.execute(
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174001',
        UserRole.USER,
      ),
    ).rejects.toThrow('User not found');
  });
});

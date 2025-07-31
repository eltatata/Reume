import { UserEntity, UserRole } from '../../../../src/domain';
import { FindOneUser } from '../../../../src/application';

describe('FindOneUser', () => {
  const userRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const findOneUser = new FindOneUser(userRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return a user by ID', async () => {
    const user = new UserEntity(
      '123e4567-e89b-12d3-a456-426614174001',
      'John',
      'Doe',
      'john.doe@example.com',
      UserRole.ADMIN,
      true,
      new Date(),
    );
    userRepository.findById.mockResolvedValue(user);

    const result = await findOneUser.execute(
      '123e4567-e89b-12d3-a456-426614174001',
      '123e4567-e89b-12d3-a456-426614174001',
      UserRole.ADMIN,
    );

    expect(result).toEqual(user);
  });

  test('should throw error if user not found by ID', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(
      findOneUser.execute(
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174001',
        UserRole.ADMIN,
      ),
    ).rejects.toThrow('User not found');

    expect(userRepository.findById).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174001',
    );
  });

  test('should throw forbidden error if user tries to access another user', async () => {
    const userId = 'user-123';
    const otherUserId = 'user-456';
    const role = UserRole.USER;

    await expect(
      findOneUser.execute(otherUserId, userId, role),
    ).rejects.toThrow('You do not have permission to access this user');

    expect(userRepository.findById).not.toHaveBeenCalled();
  });
});

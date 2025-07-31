import { UserEntity, UserRole } from '../../../../src/domain';
import { UpdateUser } from '../../../../src/application';

describe('UpdateUserEmail', () => {
  const userRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const updateUserEmail = new UpdateUser(userRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should update user successfully', async () => {
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

    const result = await updateUserEmail.execute(
      '123e4567-e89b-12d3-a456-426614174001',
      '123e4567-e89b-12d3-a456-426614174001',
      UserRole.USER,
      {
        firstname: 'John',
        lastname: 'Doe',
        phone: '+1234567890',
      },
    );

    expect(result).toEqual(user);
    expect(userRepository.findById).toHaveBeenCalledWith(user.id);
    expect(userRepository.update).toHaveBeenCalledWith(user.id, {
      firstname: 'John',
      lastname: 'Doe',
      phone: '+1234567890',
    });
  });

  test('should throw forbidden error when user tries to update another user', async () => {
    await expect(
      updateUserEmail.execute(
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174002',
        UserRole.USER,
        {
          firstname: 'John',
          lastname: 'Doe',
          phone: '+1234567890',
        },
      ),
    ).rejects.toThrow('You do not have permission to update this user');
  });

  test('should throw not found error when user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(
      updateUserEmail.execute(
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174001',
        UserRole.USER,
        {
          firstname: 'John',
          lastname: 'Doe',
          phone: '+1234567890',
        },
      ),
    ).rejects.toThrow('User not found');
  });
});

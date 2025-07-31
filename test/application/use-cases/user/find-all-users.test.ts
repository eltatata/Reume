import { UserEntity, UserRole } from '../../../../src/domain';
import { FindAllUsers } from '../../../../src/application';

describe('FindAllUsers', () => {
  const userRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const findAllUsers = new FindAllUsers(userRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return all users', async () => {
    const users = [
      new UserEntity(
        '123e4567-e89b-12d3-a456-426614174001',
        'John',
        'Doe',
        'john.doe@example.com',
        UserRole.ADMIN,
        true,
        new Date(),
      ),
      new UserEntity(
        '123e4567-e89b-12d3-a456-426614174002',
        'Jane',
        'Smith',
        'jane.smith@example.com',
        UserRole.USER,
        false,
        new Date(),
      ),
    ];
    userRepository.findAll.mockResolvedValue(users);

    const result = await findAllUsers.execute();

    expect(result).toEqual(users);
  });
});

import { UserEntity, UserRole, CustomError } from '../../../../src/domain';
import { UpdateUserEmail } from '../../../../src/application';
import { jwtAdapter } from '../../../../src/config';

jest.mock('../../../../src/config', () => ({
  jwtAdapter: {
    verifyToken: jest.fn(),
  },
  loggerAdapter: jest.fn(() => ({
    log: jest.fn(),
    error: jest.fn(),
  })),
}));

describe('UpdateUserEmail', () => {
  const userRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const updateUserEmail = new UpdateUserEmail(userRepository);

  const validToken = 'valid.jwt.token';
  const mockPayload = { id: '123', email: 'new.email@example.com' };
  const mockUpdatedUser: UserEntity = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'new.email@example.com',
    role: UserRole.USER,
    verified: true,
    createdAt: new Date(),
    phone: '+1234567890',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should update user email successfully', async () => {
    (jwtAdapter.verifyToken as jest.Mock).mockResolvedValue(mockPayload);
    userRepository.update.mockResolvedValue(mockUpdatedUser);

    await updateUserEmail.execute(validToken);

    expect(jwtAdapter.verifyToken).toHaveBeenCalledWith(validToken);
    expect(userRepository.update).toHaveBeenCalledWith('123', {
      email: 'new.email@example.com',
    });
  });

  test('should throw unauthorized error when token is invalid', async () => {
    (jwtAdapter.verifyToken as jest.Mock).mockResolvedValue(null);

    await expect(updateUserEmail.execute(validToken)).rejects.toThrow(
      CustomError.unauthorized('Invalid or expired token'),
    );

    expect(jwtAdapter.verifyToken).toHaveBeenCalledWith(validToken);
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  test('should throw unauthorized error when token payload is undefined', async () => {
    (jwtAdapter.verifyToken as jest.Mock).mockResolvedValue(undefined);

    await expect(updateUserEmail.execute(validToken)).rejects.toThrow(
      CustomError.unauthorized('Invalid or expired token'),
    );

    expect(jwtAdapter.verifyToken).toHaveBeenCalledWith(validToken);
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  test('should throw not found error when user does not exist', async () => {
    (jwtAdapter.verifyToken as jest.Mock).mockResolvedValue(mockPayload);
    userRepository.update.mockResolvedValue(null);

    await expect(updateUserEmail.execute(validToken)).rejects.toThrow(
      CustomError.notFound('User not found'),
    );

    expect(jwtAdapter.verifyToken).toHaveBeenCalledWith(validToken);
    expect(userRepository.update).toHaveBeenCalledWith('123', {
      email: 'new.email@example.com',
    });
  });
});

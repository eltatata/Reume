import { UserEntity, UserRole } from '../../../../src/domain';
import { RequestUpdateUserEmail } from '../../../../src/application';
import { bcryptAdapter } from '../../../../src/config';

jest.mock('../../../../src/config', () => ({
  ...jest.requireActual('../../../../src/config'),
  bcryptAdapter: {
    compare: jest.fn(),
    hash: jest.fn(),
  },
}));

describe('RequestUpdateUserEmail', () => {
  const emailService = {
    sendVerificationEmail: jest.fn(),
    sendEmailVerificationLink: jest.fn(),
  };

  const userRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const requestUpdateUserEmail = new RequestUpdateUserEmail(
    userRepository,
    emailService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should request email update for user', async () => {
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
    userRepository.findByEmail.mockResolvedValue(null);
    emailService.sendEmailVerificationLink.mockResolvedValue('link');

    await requestUpdateUserEmail.execute(
      '123e4567-e89b-12d3-a456-426614174001',
      '123e4567-e89b-12d3-a456-426614174001',
      UserRole.ADMIN,
      {
        email: 'new.email@example.com',
      },
    );

    expect(userRepository.findById).toHaveBeenCalledWith(user.id);
    expect(emailService.sendEmailVerificationLink).toHaveBeenCalledWith(
      'new.email@example.com',
      expect.stringMatching(
        /^http:\/\/localhost:3000\/api\/user\/update-email\?token=[\w.-]+$/,
      ),
    );
  });

  test('should throw forbidden error if user tries to update another users email', async () => {
    expect(
      requestUpdateUserEmail.execute(
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174002',
        UserRole.USER,
        {
          email: 'new.email@example.com',
        },
      ),
    ).rejects.toThrow(
      'You do not have permission to request an email update for this user',
    );

    expect(userRepository.findById).not.toHaveBeenCalled();
    expect(emailService.sendEmailVerificationLink).not.toHaveBeenCalled();
  });

  test('should throw error if email is not provided', async () => {
    await expect(
      requestUpdateUserEmail.execute(
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174001',
        UserRole.ADMIN,
        {
          email: '',
        },
      ),
    ).rejects.toThrow('Email is required');

    expect(userRepository.findById).not.toHaveBeenCalled();
    expect(emailService.sendEmailVerificationLink).not.toHaveBeenCalled();
  });

  test('should throw error if user not found', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(
      requestUpdateUserEmail.execute(
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174001',
        UserRole.ADMIN,
        {
          email: 'new.email@example.com',
        },
      ),
    ).rejects.toThrow('User not found');

    expect(userRepository.findById).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174001',
    );
    expect(emailService.sendEmailVerificationLink).not.toHaveBeenCalled();
  });

  test('should throw unauthorized error if password is required and not provided', async () => {
    const user = new UserEntity(
      '123e4567-e89b-12d3-a456-426614174001',
      'John',
      'Doe',
      'john.doe@example.com',
      UserRole.USER,
      true,
      new Date(),
    );

    userRepository.findById.mockResolvedValue(user);
    await expect(
      requestUpdateUserEmail.execute(
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174001',
        UserRole.USER,
        {
          email: 'new.email@example.com',
        },
      ),
    ).rejects.toThrow('Password is required');

    expect(userRepository.findById).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174001',
    );
    expect(emailService.sendEmailVerificationLink).not.toHaveBeenCalled();
  });

  test('should throw unauthorized error if password is invalid', async () => {
    const user = new UserEntity(
      '123e4567-e89b-12d3-a456-426614174001',
      'John',
      'Doe',
      'john.doe@example.com',
      UserRole.USER,
      true,
      new Date(),
      '+1234567890',
      '$2a$10$hashedpassword',
    );

    userRepository.findById.mockResolvedValue(user);
    (bcryptAdapter.compare as jest.Mock).mockReturnValue(false);

    await expect(
      requestUpdateUserEmail.execute(
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174001',
        UserRole.USER,
        {
          email: 'new.email@example.com',
          password: 'wrong-password',
        },
      ),
    ).rejects.toThrow('Invalid password');

    expect(userRepository.findById).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174001',
    );
    expect(bcryptAdapter.compare).toHaveBeenCalledWith(
      'wrong-password',
      '$2a$10$hashedpassword',
    );
    expect(emailService.sendEmailVerificationLink).not.toHaveBeenCalled();
  });

  test('should throw error if email already in use by another user', async () => {
    const user = new UserEntity(
      '123e4567-e89b-12d3-a456-426614174001',
      'John',
      'Doe',
      'john.doe@example.com',
      UserRole.USER,
      true,
      new Date(),
    );

    userRepository.findById.mockResolvedValue(user);
    userRepository.findByEmail.mockResolvedValue(
      new UserEntity(
        '123e4567-e89b-12d3-a456-426614174002',
        'Jane',
        'Doe',
        'jane.doe@example.com',
        UserRole.USER,
        true,
        new Date(),
      ),
    );

    await expect(
      requestUpdateUserEmail.execute(
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174001',
        UserRole.ADMIN,
        {
          email: 'jane.doe@example.com',
        },
      ),
    ).rejects.toThrow('Email already in use');

    expect(userRepository.findById).toHaveBeenCalledWith(user.id);
    expect(emailService.sendEmailVerificationLink).not.toHaveBeenCalled();
  });
});

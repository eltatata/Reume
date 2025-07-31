import { LoginUserDto } from '../../../../src/domain';

describe('LoginUserDto', () => {
  test('should create a valid LoginUserDto with email and password', () => {
    const data = {
      email: 'alice.smith@example.com',
      password: 'mySecurePassword123!',
    };

    const result = LoginUserDto.create(data);

    expect(result).toHaveProperty('validatedData');
    expect(result.validatedData?.email).toBe(data.email);
    expect(result.validatedData?.password).toBe(data.password);
  });

  test('should return error for invalid email format', () => {
    const data = {
      email: 'invalid-email-format',
      password: 'mySecurePassword123!',
    };

    const result = LoginUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Invalid email format',
      }),
    );
  });

  test('should return error for empty email', () => {
    const data = {
      email: '',
      password: 'mySecurePassword123!',
    };

    const result = LoginUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Invalid email format',
      }),
    );
  });

  test('should return error for password too short', () => {
    const data = {
      email: 'alice.smith@example.com',
      password: '1234',
    };

    const result = LoginUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Password must be at least 5 characters long',
      }),
    );
  });

  test('should return error for empty password', () => {
    const data = {
      email: 'alice.smith@example.com',
      password: '',
    };

    const result = LoginUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Password must be at least 5 characters long',
      }),
    );
  });

  test('should return multiple errors for invalid email and password', () => {
    const data = {
      email: 'invalid-email',
      password: '123',
    };

    const result = LoginUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Invalid email format',
      }),
    );
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Password must be at least 5 characters long',
      }),
    );
  });

  test('should handle email with whitespace (trimmed)', () => {
    const data = {
      email: '  alice.smith@example.com  ',
      password: 'mySecurePassword123!',
    };

    const result = LoginUserDto.create(data);

    expect(result).toHaveProperty('validatedData');
    expect(result.validatedData?.email).toBe('alice.smith@example.com');
  });

  test('should handle password with whitespace (trimmed)', () => {
    const data = {
      email: 'alice.smith@example.com',
      password: '  mySecurePassword123!  ',
    };

    const result = LoginUserDto.create(data);

    expect(result).toHaveProperty('validatedData');
    expect(result.validatedData?.password).toBe('mySecurePassword123!');
  });

  test('should accept minimum valid password length', () => {
    const data = {
      email: 'alice.smith@example.com',
      password: '12345',
    };

    const result = LoginUserDto.create(data);

    expect(result).toHaveProperty('validatedData');
    expect(result.validatedData?.password).toBe('12345');
  });

  test('should accept valid email formats', () => {
    const validEmails = [
      'test@example.com',
      'user.name@example.com',
      'user+label@example.co.uk',
      'firstname.lastname@company.org',
    ];

    validEmails.forEach((email) => {
      const data = {
        email,
        password: 'password123',
      };

      const result = LoginUserDto.create(data);

      expect(result).toHaveProperty('validatedData');
      expect(result.validatedData?.email).toBe(email);
    });
  });
});

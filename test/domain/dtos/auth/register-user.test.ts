import { RegisterUserDto } from '../../../../src/domain';

describe('RegisterUserDto', () => {
  test('should create a valid RegisterUserDto with all fields', () => {
    const data = {
      firstname: 'Alice',
      lastname: 'Smith',
      email: 'alice.smith@example.com',
      password: 'mySecurePassword123!',
      phone: '+1234567890',
    };

    const result = RegisterUserDto.create(data);

    expect(result).toHaveProperty('validatedData');
    expect(result.validatedData?.firstname).toBe(data.firstname);
    expect(result.validatedData?.lastname).toBe(data.lastname);
    expect(result.validatedData?.email).toBe(data.email);
    expect(result.validatedData?.password).toBe(data.password);
    expect(result.validatedData?.phone).toBe(data.phone);
  });

  test('should return error for invalid name and lastname fields', () => {
    const data = {
      firstname: '',
      lastname: '',
      email: 'alice.smith@example.com',
      password: 'mySecurePassword123!',
      phone: '+1234567890',
    };

    const result = RegisterUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        message: 'Name is required',
      }),
    );
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        message: 'Lastname is required',
      }),
    );
  });

  test('should return error for invalid email format', () => {
    const data = {
      firstname: 'Alice',
      lastname: 'Smith',
      email: 'invalid-email-format',
      password: 'mySecurePassword123!',
      phone: '+1234567890',
    };

    const result = RegisterUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Invalid email format',
      }),
    );
  });

  test('should return error for invalid password format', () => {
    const data = {
      firstname: 'Alice',
      lastname: 'Smith',
      email: 'alice.smith@example.com',
      password: 'abc',
      phone: '+1234567890',
    };

    const result = RegisterUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Password must be at least 5 characters long',
      }),
    );
  });

  test('should return error for password without lowercase letter', () => {
    const data = {
      firstname: 'Alice',
      lastname: 'Smith',
      email: 'alice.smith@example.com',
      password: 'PASSWORD123!',
      phone: '+1234567890',
    };

    const result = RegisterUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Password must contain at least one lowercase letter',
      }),
    );
  });

  test('should return error for password without uppercase letter', () => {
    const data = {
      firstname: 'Alice',
      lastname: 'Smith',
      email: 'alice.smith@example.com',
      password: 'password123!',
      phone: '+1234567890',
    };

    const result = RegisterUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Password must contain at least one uppercase letter',
      }),
    );
  });

  test('should return error for password without number', () => {
    const data = {
      firstname: 'Alice',
      lastname: 'Smith',
      email: 'alice.smith@example.com',
      password: 'Password!',
      phone: '+1234567890',
    };

    const result = RegisterUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Password must contain at least one number',
      }),
    );
  });

  test('should return error for password without special character', () => {
    const data = {
      firstname: 'Alice',
      lastname: 'Smith',
      email: 'alice.smith@example.com',
      password: 'Password123',
      phone: '+1234567890',
    };

    const result = RegisterUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Password must contain at least one special character',
      }),
    );
  });

  test('should return error for password too long', () => {
    const data = {
      firstname: 'Alice',
      lastname: 'Smith',
      email: 'alice.smith@example.com',
      password: 'A'.repeat(101) + '1!',
      phone: '+1234567890',
    };

    const result = RegisterUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Password must be at most 100 characters long',
      }),
    );
  });

  test('should return error for name too long', () => {
    const data = {
      firstname: 'A'.repeat(51),
      lastname: 'Smith',
      email: 'alice.smith@example.com',
      password: 'mySecurePassword123!',
      phone: '+1234567890',
    };

    const result = RegisterUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Name must be at most 50 characters long',
      }),
    );
  });

  test('should return error for lastname too long', () => {
    const data = {
      firstname: 'Alice',
      lastname: 'A'.repeat(51),
      email: 'alice.smith@example.com',
      password: 'mySecurePassword123!',
      phone: '+1234567890',
    };

    const result = RegisterUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Lastname must be at most 50 characters long',
      }),
    );
  });

  test('should return error for invalid phone number format', () => {
    const data = {
      firstname: 'Alice',
      lastname: 'Smith',
      email: 'alice.smith@example.com',
      password: 'mySecurePassword123!',
      phone: 'invalid-phone',
    };

    const result = RegisterUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Invalid phone number format',
      }),
    );
  });

  test('should return error for phone number too short', () => {
    const data = {
      firstname: 'Alice',
      lastname: 'Smith',
      email: 'alice.smith@example.com',
      password: 'mySecurePassword123!',
      phone: '12345',
    };

    const result = RegisterUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Invalid phone number format',
      }),
    );
  });

  test('should return error for phone number too long', () => {
    const data = {
      firstname: 'Alice',
      lastname: 'Smith',
      email: 'alice.smith@example.com',
      password: 'mySecurePassword123!',
      phone: '1234567890123456',
    };

    const result = RegisterUserDto.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Invalid phone number format',
      }),
    );
  });

  test('should create a valid RegisterUserDto without phone number', () => {
    const data = {
      firstname: 'Alice',
      lastname: 'Smith',
      email: 'alice.smith@example.com',
      password: 'mySecurePassword123!',
    };

    const result = RegisterUserDto.create(data);

    expect(result).toHaveProperty('validatedData');
    expect(result.validatedData?.firstname).toBe(data.firstname);
    expect(result.validatedData?.lastname).toBe(data.lastname);
    expect(result.validatedData?.email).toBe(data.email);
    expect(result.validatedData?.password).toBe(data.password);
    expect(result.validatedData?.phone).toBeUndefined();
  });

  test('should create a valid RegisterUserDto with phone number with plus sign', () => {
    const data = {
      firstname: 'Alice',
      lastname: 'Smith',
      email: 'alice.smith@example.com',
      password: 'mySecurePassword123!',
      phone: '+1234567890',
    };

    const result = RegisterUserDto.create(data);

    expect(result).toHaveProperty('validatedData');
    expect(result.validatedData?.phone).toBe(data.phone);
  });

  test('should create a valid RegisterUserDto with phone number without plus sign', () => {
    const data = {
      firstname: 'Alice',
      lastname: 'Smith',
      email: 'alice.smith@example.com',
      password: 'mySecurePassword123!',
      phone: '1234567890',
    };

    const result = RegisterUserDto.create(data);

    expect(result).toHaveProperty('validatedData');
    expect(result.validatedData?.phone).toBe(data.phone);
  });
});

import { FindAvailableTimesDTO } from '../../../../src/domain';

describe('FindAvailableTimesDTO', () => {
  test('should create a valid FindAvailableTimesDTO with date only', () => {
    const timeZone = 'Asia/Dubai';

    const date = new Intl.DateTimeFormat('en-CA', { timeZone }).format(
      new Date(Date.now() + 1 * 86400000),
    );

    const result = FindAvailableTimesDTO.create({ date, timeZone });

    expect(result).toHaveProperty('validatedData');
    expect(result?.validatedData?.date).toBe(date);
    expect(result?.validatedData?.schedule).toBeUndefined();
  });

  test('should create a valid FindAvailableTimesDTO with date and schedule', () => {
    const timeZone = 'Australia/Melbourne';
    const schedule = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

    const date = new Intl.DateTimeFormat('en-CA', { timeZone }).format(
      new Date(Date.now() + 1 * 86400000),
    );

    const result = FindAvailableTimesDTO.create({
      date,
      timeZone,
      schedule,
    });

    expect(result).toHaveProperty('validatedData');
    expect(result?.validatedData?.date).toBe(date);
    expect(result?.validatedData?.schedule).toBe(schedule);
  });

  test('should return error because date format is invalid', () => {
    const result = FindAvailableTimesDTO.create({
      date: '2025/05/24',
      timeZone: 'America/New_York',
    });

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Invalid date format. Expected YYYY-MM-DD',
      }),
    );
  });

  test('should return error because date is in the past', () => {
    const result = FindAvailableTimesDTO.create({
      date: '2024-01-01',
      timeZone: 'America/New_York',
    });

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Date cannot be in the past',
      }),
    );
  });

  test('should return error because schedule is not a valid UUID', () => {
    const timeZone = 'Pacific/Tahiti';

    const date = new Intl.DateTimeFormat('en-CA', { timeZone }).format(
      new Date(Date.now() + 1 * 86400000),
    );

    const result = FindAvailableTimesDTO.create({
      date,
      timeZone,
      schedule: 'invalid-uuid',
    });

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Schedule must be a valid UUID',
      }),
    );
  });

  test('should return error for multiple validation failures', () => {
    const result = FindAvailableTimesDTO.create({
      date: '2025/05/24',
      timeZone: 'America/New_York',
      schedule: 'invalid-uuid',
    });

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toHaveLength(3);
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Invalid date format. Expected YYYY-MM-DD',
      }),
    );
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Schedule must be a valid UUID',
      }),
    );
  });

  test('should handle empty string schedule by treating it as undefined', () => {
    const timeZone = 'Australia/Melbourne';

    const date = new Intl.DateTimeFormat('en-CA', { timeZone }).format(
      new Date(Date.now() + 1 * 86400000),
    );

    const result = FindAvailableTimesDTO.create({
      date,
      timeZone,
      schedule: '   ',
    });

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Schedule must be a valid UUID',
      }),
    );
  });
});

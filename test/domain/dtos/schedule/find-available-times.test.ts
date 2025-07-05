import { FindAvailableTimesDTO } from '../../../../src/domain';

const getNextWeekday = (daysFromToday: number = 1): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  // Ensure it's not a weekend
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }

  return date;
};

const getNextWeekendDay = (dayOfWeek: 0 | 6): Date => {
  const date = new Date();
  while (date.getDay() !== dayOfWeek) {
    date.setDate(date.getDate() + 1);
  }
  return date;
};

describe('FindAvailableTimesDTO', () => {
  test('should create a valid FindAvailableTimesDTO with date only', () => {
    const tomorrow = getNextWeekday();

    const data = {
      date: tomorrow.toISOString().split('T')[0], // YYYY-MM-DD format
    };

    const result = FindAvailableTimesDTO.create(data);

    expect(result).toHaveProperty('validatedData');
    expect(result?.validatedData?.date).toBe(data.date);
    expect(result?.validatedData?.schedule).toBeUndefined();
  });

  test('should create a valid FindAvailableTimesDTO with date and schedule', () => {
    const tomorrow = getNextWeekday();

    const data = {
      date: tomorrow.toISOString().split('T')[0], // YYYY-MM-DD format
      schedule: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    };

    const result = FindAvailableTimesDTO.create(data);

    expect(result).toHaveProperty('validatedData');
    expect(result?.validatedData?.date).toBe(data.date);
    expect(result?.validatedData?.schedule).toBe(data.schedule);
  });

  test('should return error because date format is invalid', () => {
    const data = {
      date: '2025/05/24',
    };

    const result = FindAvailableTimesDTO.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Invalid date format. Expected YYYY-MM-DD',
      }),
    );
  });

  test('should return error because date is in the past', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const data = {
      date: yesterday.toISOString().split('T')[0],
    };

    const result = FindAvailableTimesDTO.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Date cannot be in the past',
      }),
    );
  });

  test('should return error because date is a weekend (Saturday)', () => {
    const saturday = getNextWeekendDay(6);

    const data = {
      date: saturday.toISOString().split('T')[0],
    };

    const result = FindAvailableTimesDTO.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Date cannot be a weekend',
      }),
    );
  });

  test('should return error because date is a weekend (Sunday)', () => {
    const sunday = getNextWeekendDay(0);

    const data = {
      date: sunday.toISOString().split('T')[0],
    };

    const result = FindAvailableTimesDTO.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Date cannot be a weekend',
      }),
    );
  });

  test('should return error because schedule is not a valid UUID', () => {
    const tomorrow = getNextWeekday();

    const data = {
      date: tomorrow.toISOString().split('T')[0],
      schedule: 'invalid-uuid',
    };

    const result = FindAvailableTimesDTO.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Schedule must be a valid UUID',
      }),
    );
  });

  test('should return error for multiple validation failures', () => {
    const tomorrow = getNextWeekday();

    const data = {
      date: tomorrow.toISOString().replace(/-/g, '/').split('T')[0], // Invalid date format: YYYY/MM/DD
      schedule: 'invalid-uuid', // Invalid UUID
    };

    const result = FindAvailableTimesDTO.create(data);

    expect(result).toHaveProperty('errors');
    expect(result?.errors).toHaveLength(2);
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
    const tomorrow = getNextWeekday();

    const data = {
      date: tomorrow.toISOString().split('T')[0],
      schedule: '   ', // Empty string should be trimmed and treated as invalid
    };

    const result = FindAvailableTimesDTO.create(data);

    // Empty string after trim should fail UUID validation
    expect(result).toHaveProperty('errors');
    expect(result?.errors).toContainEqual(
      expect.objectContaining({
        message: 'Schedule must be a valid UUID',
      }),
    );
  });

  test('should handle today as a valid date if it is not a weekend', () => {
    const today = new Date();

    // Only test if today is not a weekend
    if (today.getDay() !== 0 && today.getDay() !== 6) {
      const data = {
        date: today.toISOString().split('T')[0],
      };

      const result = FindAvailableTimesDTO.create(data);

      expect(result).toHaveProperty('validatedData');
      expect(result?.validatedData?.date).toBe(data.date);
    }
  });
});

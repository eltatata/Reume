import { ScheduleEntity } from '../../../../src/domain';
import { FindAvailableTimes } from '../../../../src/application';

describe('FindAvailableTimes', () => {
  const scheduleRepository = {
    findById: jest.fn(),
    findOverlapping: jest.fn(),
    findByDate: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const findAvailableTimes = new FindAvailableTimes(scheduleRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return all available times for a day with no schedules', async () => {
    const timeZone = 'Asia/Dubai';

    const date = new Intl.DateTimeFormat('en-CA', { timeZone }).format(
      new Date(Date.now() + 1 * 86400000),
    );

    scheduleRepository.findByDate.mockResolvedValue([]);

    const result = await findAvailableTimes.execute({ date, timeZone });

    expect(result).toHaveLength(96);
    expect(result[0]).toBe('00:00');
    expect(result[result.length - 1]).toBe('23:45');
    expect(scheduleRepository.findByDate).toHaveBeenCalledWith({
      date,
      timeZone,
    });
  });

  test('should exclude occupied time slots from available times', async () => {
    const timeZone = 'America/Bogota';

    const date = new Intl.DateTimeFormat('en-CA', { timeZone }).format(
      new Date(Date.now() + 1 * 86400000),
    );

    const schedules = [
      new ScheduleEntity(
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174000',
        'Meeting',
        `${date}T11:00:00.000Z`, // 6:00 AM
        `${date}T12:00:00.000Z`, // 7:00 AM
        new Date(),
        new Date(),
      ),
      new ScheduleEntity(
        '123e4567-e89b-12d3-a456-426614174002',
        '123e4567-e89b-12d3-a456-426614174000',
        'Lunch Meeting',
        `${date}T18:00:00.000Z`, // 1:00 PM
        `${date}T19:00:00.000Z`, // 2:00 PM
        new Date(),
        new Date(),
      ),
    ];

    scheduleRepository.findByDate.mockResolvedValue(schedules);

    const result = await findAvailableTimes.execute({ date, timeZone });

    // Should not include time slots between 6:00-7:00 AM and 1:00-3:00 PM
    expect(result).not.toContain('06:15');
    expect(result).not.toContain('06:30');
    expect(result).not.toContain('06:45');

    expect(result).not.toContain('13:15');
    expect(result).not.toContain('13:30');
    expect(result).not.toContain('13:45');

    expect(scheduleRepository.findByDate).toHaveBeenCalledWith({
      date,
      timeZone,
    });
  });

  test('should return an empty array for invalid date format', async () => {
    const invalidDate = '2025/06/15';

    const result = await findAvailableTimes.execute({
      date: invalidDate,
      timeZone: 'Europe/Zurich',
    });

    expect(result).toEqual([]);
  });

  test('should handle schedules that span partial time slots', async () => {
    const timeZone = 'America/Bogota';

    const date = new Intl.DateTimeFormat('en-CA', { timeZone }).format(
      new Date(Date.now() + 1 * 86400000),
    );

    const schedules = [
      new ScheduleEntity(
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174000',
        'Short Meeting',
        `${date}T13:00:00.000Z`, // 8:00 AM
        `${date}T14:00:00.000Z`, // 9:00 AM
        new Date(),
        new Date(),
      ),
    ];

    scheduleRepository.findByDate.mockResolvedValue(schedules);

    const result = await findAvailableTimes.execute({ date, timeZone });

    // Should not include 8:00 and 9:00 (slots that are occupied)
    expect(result).not.toContain('08:15');
    expect(result).not.toContain('08:30');
    expect(result).not.toContain('08:45');

    // Should include time slots before and after
    expect(result).toContain('08:00');
    expect(result).toContain('09:00');

    expect(scheduleRepository.findByDate).toHaveBeenCalledWith({
      date,
      timeZone,
    });
  });
});

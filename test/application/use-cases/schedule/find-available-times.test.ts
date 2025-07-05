import { ScheduleEntity } from '../../../../src/domain';
import { FindAvailableTimes } from '../../../../src/application';

const getNextWeekday = (daysFromToday: number = 1): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  // Ensure it's not a weekend
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }

  return date;
};

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
    const validDate = getNextWeekday();
    const date = validDate.toISOString().split('T')[0];

    scheduleRepository.findByDate.mockResolvedValue([]);

    const result = await findAvailableTimes.execute({ date });

    expect(result).toHaveLength(49);
    expect(result[0]).toBe('06:00');
    expect(result[result.length - 1]).toBe('18:00');
    expect(scheduleRepository.findByDate).toHaveBeenCalledWith({ date });
  });

  test('should exclude occupied time slots from available times', async () => {
    const validDate = getNextWeekday();
    const date = validDate.toISOString().split('T')[0];
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

    const result = await findAvailableTimes.execute({ date });

    // No debería incluir horarios entre 6:00-10:00 AM y 1:00-3:00 PM
    expect(result).not.toContain('06:00');
    expect(result).not.toContain('06:15');
    expect(result).not.toContain('06:30');
    expect(result).not.toContain('06:45');

    expect(result).not.toContain('13:15');
    expect(result).not.toContain('13:30');
    expect(result).not.toContain('13:45');

    expect(scheduleRepository.findByDate).toHaveBeenCalledWith({ date });
  });

  test('should return an empty array for invalid date format', async () => {
    const invalidDate = '2025/06/15';

    const result = await findAvailableTimes.execute({ date: invalidDate });

    expect(result).toEqual([]);
  });

  test('should handle schedules that span partial time slots', async () => {
    const validDate = getNextWeekday();
    const date = validDate.toISOString().split('T')[0];
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

    const result = await findAvailableTimes.execute({ date });

    // No debería incluir 8:00 y 9:00 (slots que están ocupados)
    expect(result).not.toContain('08:15');
    expect(result).not.toContain('08:30');
    expect(result).not.toContain('08:45');

    // Debería incluir horarios antes y después
    expect(result).toContain('08:00');
    expect(result).toContain('09:00');

    expect(scheduleRepository.findByDate).toHaveBeenCalledWith({ date });
  });
});

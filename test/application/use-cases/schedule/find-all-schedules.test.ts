import { ScheduleEntity } from '../../../../src/domain';
import { FindAllSchedules } from '../../../../src/application';

describe('FindAllSchedules', () => {
  const scheduleRepository = {
    findById: jest.fn(),
    findOverlapping: jest.fn(),
    findByDate: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const findAllSchedules = new FindAllSchedules(scheduleRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return all schedules', async () => {
    const schedules = [
      new ScheduleEntity(
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174000',
        'Meeting',
        '2025-05-24T11:30:00.000Z',
        '2025-05-24T12:00:00.000Z',
        new Date(),
        new Date(),
      ),
      new ScheduleEntity(
        '123e4567-e89b-12d3-a456-426614174002',
        '123e4567-e89b-12d3-a456-426614174000',
        'Conference',
        '2025-05-25T11:30:00.000Z',
        '2025-05-25T12:00:00.000Z',
        new Date(),
        new Date(),
      ),
    ];

    scheduleRepository.findAll.mockResolvedValue(schedules);

    const result = await findAllSchedules.execute();

    expect(result).toEqual(schedules);
    expect(scheduleRepository.findAll).toHaveBeenCalledWith(undefined);
  });
});

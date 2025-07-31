import { ScheduleEntity, CreateScheduleDTO } from '../../../../src/domain';
import { CreateSchedule } from '../../../../src/application';

describe('CreateSchedule', () => {
  const scheduleRepository = {
    findById: jest.fn(),
    findOverlapping: jest.fn(),
    findByDate: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const createSchedule = new CreateSchedule(scheduleRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create a schedule successfully', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const scheduleData = {
      title: 'Meeting',
      startTime: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
      endTime: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    };

    const { validatedData } = CreateScheduleDTO.create(scheduleData);

    scheduleRepository.findOverlapping.mockResolvedValue([]);
    scheduleRepository.create.mockResolvedValue(
      new ScheduleEntity(
        '123e4567-e89b-12d3-a456-426614174000',
        userId,
        validatedData!.title,
        new Date(validatedData!.startTime).toISOString(),
        new Date(validatedData!.endTime).toISOString(),
        new Date(),
        new Date(),
      ),
    );

    const result = await createSchedule.execute(userId, validatedData!);

    expect(result).toEqual(expect.any(ScheduleEntity));
    expect(result).toEqual(
      new ScheduleEntity(
        '123e4567-e89b-12d3-a456-426614174000',
        userId,
        validatedData!.title,
        new Date(validatedData!.startTime).toISOString(),
        new Date(validatedData!.endTime).toISOString(),
        expect.any(Date),
        expect.any(Date),
      ),
    );
    expect(scheduleRepository.findOverlapping).toHaveBeenCalledWith(
      validatedData!.startTime,
      validatedData!.endTime,
    );
    expect(scheduleRepository.create).toHaveBeenCalledWith(
      userId,
      validatedData!,
    );
  });

  test('should throw an error if schedule overlaps with existing schedules', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const scheduleData = {
      title: 'Meeting',
      startTime: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
      endTime: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    };

    const { validatedData } = CreateScheduleDTO.create(scheduleData);

    scheduleRepository.findOverlapping.mockResolvedValue([
      new ScheduleEntity(
        '123e4567-e89b-12d3-a456-426614174000',
        userId,
        'Existing Meeting',
        new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
        new Date(new Date().setHours(12, 30, 0, 0)).toISOString(),
        new Date(),
        new Date(),
      ),
    ]);

    await expect(
      createSchedule.execute(userId, validatedData!),
    ).rejects.toThrow('Schedule overlaps with existing schedules');
  });
});

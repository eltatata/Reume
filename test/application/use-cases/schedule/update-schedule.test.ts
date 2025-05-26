import { ScheduleEntity, UpdateScheduleDTO } from '../../../../src/domain';
import { UpdateSchedule } from '../../../../src/application';

describe('UpdateSchedule', () => {
  const scheduleRepository = {
    findById: jest.fn(),
    findOverlapping: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const updateSchedule = new UpdateSchedule(scheduleRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should update a schedule successfully', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const scheduleId = '123e4567-e89b-12d3-a456-426614174001';
    const existingSchedule = new ScheduleEntity(
      scheduleId,
      userId,
      'Meeting',
      new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
      new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
      new Date(),
      new Date(),
    );
    const updatedData = {
      title: 'Updated Meeting',
      startTime: new Date(new Date().setHours(12, 30, 0, 0)).toISOString(),
      endTime: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
    };

    scheduleRepository.findById.mockResolvedValue(existingSchedule);
    scheduleRepository.findOverlapping.mockResolvedValue([]);
    scheduleRepository.update.mockResolvedValue(
      new ScheduleEntity(
        scheduleId,
        userId,
        updatedData.title,
        updatedData.startTime,
        updatedData.endTime,
        new Date(),
        new Date(),
      ),
    );

    const { validatedData } = UpdateScheduleDTO.create(updatedData);

    const result = await updateSchedule.execute(
      userId,
      scheduleId,
      validatedData!,
    );

    expect(result).toEqual(expect.any(ScheduleEntity));
    expect(result).toEqual(
      new ScheduleEntity(
        scheduleId,
        userId,
        updatedData.title,
        updatedData.startTime,
        updatedData.endTime,
        expect.any(Date),
        expect.any(Date),
      ),
    );
    expect(scheduleRepository.findById).toHaveBeenCalledWith(scheduleId);
    expect(scheduleRepository.findOverlapping).toHaveBeenCalledWith(
      validatedData!.startTime,
      validatedData!.endTime,
    );
    expect(scheduleRepository.update).toHaveBeenCalledWith(
      scheduleId,
      validatedData!,
    );
  });

  test('should throw not found error if schedule does not exist', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const scheduleId = '123e4567-e89b-12d3-a456-426614174001';
    const updatedData = {
      title: 'Updated Meeting',
      startTime: '2025-05-24T12:30:00.000Z',
      endTime: '2025-05-24T13:00:00.000Z',
    };

    scheduleRepository.findById.mockResolvedValue(null);

    const { validatedData } = UpdateScheduleDTO.create(updatedData);

    await expect(
      updateSchedule.execute(userId, scheduleId, validatedData!),
    ).rejects.toThrow('Schedule not found');
    expect(scheduleRepository.findById).toHaveBeenCalledWith(scheduleId);
  });

  test('should throw forbidden error if user does not own the schedule', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const scheduleId = '123e4567-e89b-12d3-a456-426614174001';
    const existingSchedule = new ScheduleEntity(
      scheduleId,
      'different-user-id',
      'Meeting',
      '2025-05-24T11:30:00.000Z',
      '2025-05-24T12:00:00.000Z',
      new Date(),
      new Date(),
    );
    const updatedData = {
      title: 'Updated Meeting',
      startTime: '2025-05-24T12:30:00.000Z',
      endTime: '2025-05-24T13:00:00.000Z',
    };

    const { validatedData } = UpdateScheduleDTO.create(updatedData);

    scheduleRepository.findById.mockResolvedValue(existingSchedule);

    await expect(
      updateSchedule.execute(userId, scheduleId, validatedData!),
    ).rejects.toThrow('You do not have permission to update this schedule');
    expect(scheduleRepository.findById).toHaveBeenCalledWith(scheduleId);
    expect(scheduleRepository.update).not.toHaveBeenCalled();
    expect(scheduleRepository.findOverlapping).not.toHaveBeenCalled();
  });

  test('should throw error if schedule overlaps with existing schedules', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const scheduleId = '123e4567-e89b-12d3-a456-426614174001';
    const existingSchedule = new ScheduleEntity(
      scheduleId,
      userId,
      'Meeting',
      new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
      new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
      new Date(),
      new Date(),
    );
    const updatedData = {
      title: 'Updated Meeting',
      startTime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
      endTime: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
    };

    const { validatedData } = UpdateScheduleDTO.create(updatedData);

    scheduleRepository.findById.mockResolvedValue(existingSchedule);
    scheduleRepository.findOverlapping.mockResolvedValue([
      new ScheduleEntity(
        '123e4567-e89b-12d3-a456-426614174000',
        userId,
        'Existing Meeting',
        new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
        new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
        new Date(),
        new Date(),
      ),
    ]);

    await expect(
      updateSchedule.execute(userId, scheduleId, validatedData!),
    ).rejects.toThrow('Schedule overlaps with existing schedules');
    expect(scheduleRepository.findById).toHaveBeenCalledWith(scheduleId);
    expect(scheduleRepository.findOverlapping).toHaveBeenCalledWith(
      validatedData!.startTime,
      validatedData!.endTime,
    );
    expect(scheduleRepository.update).not.toHaveBeenCalled();
  });
});

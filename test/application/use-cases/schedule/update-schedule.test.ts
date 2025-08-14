import {
  ScheduleEntity,
  UpdateScheduleDTO,
  UserRole,
} from '../../../../src/domain';
import { UpdateSchedule } from '../../../../src/application';

const toISOInTimeZone = (timeZone: string, hour: number, minute = 0) => {
  const { year, month, day } = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );

  return new Date(
    Date.UTC(+year, +month - 1, +day, hour, minute),
  ).toISOString();
};

describe('UpdateSchedule', () => {
  const scheduleRepository = {
    findById: jest.fn(),
    findOverlapping: jest.fn(),
    findByDate: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const updateSchedule = new UpdateSchedule(scheduleRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should update a schedule successfully as owner', async () => {
    const timeZone = 'America/New_York';

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
      startTime: toISOInTimeZone(timeZone, 12, 30),
      endTime: toISOInTimeZone(timeZone, 13, 0),
      timeZone,
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
      UserRole.USER,
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

  test('should update a schedule successfully as admin (not owner)', async () => {
    const timeZone = 'Africa/Accra';

    const adminId = '123e4567-e89b-12d3-a456-426614174000';
    const scheduleId = '123e4567-e89b-12d3-a456-426614174001';
    const differentUserId = 'different-user-id';

    const existingSchedule = new ScheduleEntity(
      scheduleId,
      differentUserId,
      'Meeting',
      new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
      new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
      new Date(),
      new Date(),
    );

    const updatedData = {
      title: 'Updated Meeting',
      startTime: toISOInTimeZone(timeZone, 12, 30),
      endTime: toISOInTimeZone(timeZone, 13, 0),
      timeZone,
    };

    scheduleRepository.findById.mockResolvedValue(existingSchedule);
    scheduleRepository.findOverlapping.mockResolvedValue([]);
    scheduleRepository.update.mockResolvedValue(
      new ScheduleEntity(
        scheduleId,
        differentUserId,
        updatedData.title,
        updatedData.startTime,
        updatedData.endTime,
        new Date(),
        new Date(),
      ),
    );

    const { validatedData } = UpdateScheduleDTO.create(updatedData);

    const result = await updateSchedule.execute(
      adminId,
      scheduleId,
      validatedData!,
      UserRole.ADMIN,
    );

    expect(result).toEqual(expect.any(ScheduleEntity));
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
    const timeZone = 'America/Bogota';

    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const scheduleId = '123e4567-e89b-12d3-a456-426614174001';

    const updatedData = {
      title: 'Updated Meeting',
      startTime: toISOInTimeZone(timeZone, 12, 30),
      endTime: toISOInTimeZone(timeZone, 13, 0),
      timeZone,
    };

    scheduleRepository.findById.mockResolvedValue(null);

    const { validatedData } = UpdateScheduleDTO.create(updatedData);

    await expect(
      updateSchedule.execute(userId, scheduleId, validatedData!, UserRole.USER),
    ).rejects.toThrow('Schedule not found');
    expect(scheduleRepository.findById).toHaveBeenCalledWith(scheduleId);
  });

  test('should throw forbidden error if regular user does not own the schedule', async () => {
    const timeZone = 'Europe/London';

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
      startTime: toISOInTimeZone(timeZone, 12, 30),
      endTime: toISOInTimeZone(timeZone, 13, 0),
      timeZone,
    };

    const { validatedData } = UpdateScheduleDTO.create(updatedData);

    scheduleRepository.findById.mockResolvedValue(existingSchedule);

    await expect(
      updateSchedule.execute(userId, scheduleId, validatedData!, UserRole.USER),
    ).rejects.toThrow('You do not have permission to update this schedule');
    expect(scheduleRepository.findById).toHaveBeenCalledWith(scheduleId);
    expect(scheduleRepository.update).not.toHaveBeenCalled();
    expect(scheduleRepository.findOverlapping).not.toHaveBeenCalled();
  });

  test('should throw error if schedule overlaps with existing schedules', async () => {
    const timeZone = 'Pacific/Tahiti';

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
      startTime: toISOInTimeZone(timeZone, 14, 0),
      endTime: toISOInTimeZone(timeZone, 15, 30),
      timeZone,
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
      updateSchedule.execute(userId, scheduleId, validatedData!, UserRole.USER),
    ).rejects.toThrow('Schedule overlaps with existing schedules');
    expect(scheduleRepository.findById).toHaveBeenCalledWith(scheduleId);
    expect(scheduleRepository.findOverlapping).toHaveBeenCalledWith(
      validatedData!.startTime,
      validatedData!.endTime,
    );
    expect(scheduleRepository.update).not.toHaveBeenCalled();
  });
});

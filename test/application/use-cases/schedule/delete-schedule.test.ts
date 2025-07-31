import { ScheduleEntity, UserRole } from '../../../../src/domain';
import { DeleteSchedule } from '../../../../src/application';

describe('DeleteSchedule', () => {
  const scheduleRepository = {
    findById: jest.fn(),
    findOverlapping: jest.fn(),
    findByDate: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const deleteSchedule = new DeleteSchedule(scheduleRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should delete a schedule successfully as owner', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const scheduleId = '123e4567-e89b-12d3-a456-426614174001';
    const existingSchedule = new ScheduleEntity(
      scheduleId,
      userId,
      'Meeting',
      '2025-05-24T11:30:00.000Z',
      '2025-05-24T12:00:00.000Z',
      new Date(),
      new Date(),
    );

    scheduleRepository.findById.mockResolvedValue(existingSchedule);
    scheduleRepository.delete.mockResolvedValue(undefined);

    await deleteSchedule.execute(userId, scheduleId, UserRole.USER);

    expect(scheduleRepository.findById).toHaveBeenCalledWith(scheduleId);
    expect(scheduleRepository.delete).toHaveBeenCalledWith(scheduleId);
  });

  test('should delete a schedule successfully as admin (not owner)', async () => {
    const adminId = '123e4567-e89b-12d3-a456-426614174000';
    const scheduleId = '123e4567-e89b-12d3-a456-426614174001';
    const differentUserId = 'different-user-id';
    const existingSchedule = new ScheduleEntity(
      scheduleId,
      differentUserId,
      'Meeting',
      '2025-05-24T11:30:00.000Z',
      '2025-05-24T12:00:00.000Z',
      new Date(),
      new Date(),
    );

    scheduleRepository.findById.mockResolvedValue(existingSchedule);
    scheduleRepository.delete.mockResolvedValue(undefined);

    await deleteSchedule.execute(adminId, scheduleId, UserRole.ADMIN);

    expect(scheduleRepository.findById).toHaveBeenCalledWith(scheduleId);
    expect(scheduleRepository.delete).toHaveBeenCalledWith(scheduleId);
  });

  test('should throw not found error if schedule does not exist', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const scheduleId = '123e4567-e89b-12d3-a456-426614174001';

    scheduleRepository.findById.mockResolvedValue(null);

    await expect(
      deleteSchedule.execute(userId, scheduleId, UserRole.USER),
    ).rejects.toThrow('Schedule not found');
    expect(scheduleRepository.findById).toHaveBeenCalledWith(scheduleId);
  });

  test('should throw forbidden error if regular user does not own the schedule', async () => {
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

    scheduleRepository.findById.mockResolvedValue(existingSchedule);

    await expect(
      deleteSchedule.execute(userId, scheduleId, UserRole.USER),
    ).rejects.toThrow('You do not have permission to delete this schedule');
    expect(scheduleRepository.findById).toHaveBeenCalledWith(scheduleId);
    expect(scheduleRepository.delete).not.toHaveBeenCalled();
  });
});

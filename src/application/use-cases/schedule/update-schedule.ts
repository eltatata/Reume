import { loggerAdapter } from '../../../config';
import {
  CustomError,
  UpdateScheduleDTO,
  ScheduleEntity,
  ScheduleRepository,
  UpdateScheduleUseCase,
} from '../../../domain';

const logger = loggerAdapter('UpdateScheduleUseCase');

export class UpdateSchedule implements UpdateScheduleUseCase {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(
    userId: string,
    scheduleId: string,
    updateScheduleDTO: UpdateScheduleDTO,
  ): Promise<ScheduleEntity> {
    logger.log(`Updating schedule: ${scheduleId}`);

    const existingSchedule = await this.scheduleRepository.findById(scheduleId);
    if (!existingSchedule) throw CustomError.notFound('Schedule not found');
    if (existingSchedule.userId !== userId) {
      throw CustomError.forbidden(
        'You do not have permission to update this schedule',
      );
    }

    logger.log(`Checking for overlapping schedules`);
    const overlappingSchedules = await this.scheduleRepository.findOverlapping(
      updateScheduleDTO.startTime as Date,
      updateScheduleDTO.endTime as Date,
    );
    if (overlappingSchedules.length > 0) {
      throw CustomError.badRequest('Schedule overlaps with existing schedules');
    }

    const schedule = await this.scheduleRepository.update(
      scheduleId,
      updateScheduleDTO,
    );

    logger.log(`Schedule updated successfully: ${scheduleId}`);

    return schedule!;
  }
}

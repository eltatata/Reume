import { loggerAdapter } from '../../../config';
import {
  CustomError,
  CreateScheduleDTO,
  ScheduleEntity,
  ScheduleRepository,
  CreateScheduleUseCase,
} from '../../../domain';

const logger = loggerAdapter('CreateScheduleUseCase');

export class CreateSchedule implements CreateScheduleUseCase {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(
    userId: string,
    createScheduleDTO: CreateScheduleDTO,
  ): Promise<ScheduleEntity> {
    logger.log(`Creating schedule for user: ${userId}`);

    logger.log(`Checking for overlapping schedules`);
    const overlappingSchedules = await this.scheduleRepository.findOverlapping(
      createScheduleDTO.startTime as Date,
      createScheduleDTO.endTime as Date,
    );
    if (overlappingSchedules.length > 0) {
      throw CustomError.conflict('Schedule overlaps with existing schedules');
    }

    const schedule = await this.scheduleRepository.create(
      userId,
      createScheduleDTO,
    );
    logger.log(`Schedule created successfully for user: ${userId}`);

    return schedule;
  }
}

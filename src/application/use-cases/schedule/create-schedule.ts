import { loggerAdapter } from '../../../config';
import {
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

    const schedule = await this.scheduleRepository.create(
      userId,
      createScheduleDTO,
    );

    logger.log(`Schedule created successfully for user: ${userId}`);

    return schedule;
  }
}

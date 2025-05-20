import { loggerAdapter } from '../../../config';
import {
  ScheduleEntity,
  ScheduleRepository,
  FindAllSchedulesUseCase,
} from '../../../domain';

const logger = loggerAdapter('CreateScheduleUseCase');

export class FindAllSchedules implements FindAllSchedulesUseCase {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(userId?: string): Promise<ScheduleEntity[]> {
    logger.log(`Finding schedules`);
    const schedules = await this.scheduleRepository.findAll(userId);
    return schedules;
  }
}

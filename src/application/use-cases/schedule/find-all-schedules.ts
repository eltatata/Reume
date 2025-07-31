import { loggerAdapter } from '../../../config';
import {
  ScheduleEntity,
  ScheduleRepository,
  FindAllSchedulesUseCase,
  UserRole,
} from '../../../domain';

const logger = loggerAdapter('FindAllSchedulesUseCase');

export class FindAllSchedules implements FindAllSchedulesUseCase {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(userId: string, role: UserRole): Promise<ScheduleEntity[]> {
    logger.log(`Finding schedules`);
    const schedules = await this.scheduleRepository.findAll(
      role === UserRole.ADMIN ? undefined : userId,
    );
    return schedules;
  }
}

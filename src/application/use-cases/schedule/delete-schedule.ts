import { loggerAdapter } from '../../../config';
import {
  CustomError,
  ScheduleRepository,
  DeleteScheduleUseCase,
} from '../../../domain';

const logger = loggerAdapter('DeleteScheduleUseCase');

export class DeleteSchedule implements DeleteScheduleUseCase {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(userId: string, scheduleId: string): Promise<void> {
    logger.log(`Deleting schedule: ${scheduleId}`);

    const existingSchedule = await this.scheduleRepository.findById(scheduleId);
    if (!existingSchedule) throw CustomError.notFound('Schedule not found');
    if (existingSchedule.userId !== userId) {
      throw CustomError.forbidden(
        'You do not have permission to delete this schedule',
      );
    }

    await this.scheduleRepository.delete(scheduleId);

    logger.log(`Schedule deleted successfully: ${scheduleId}`);
  }
}

import { ScheduleEntity, UpdateScheduleDTO } from '../..';

export interface UpdateScheduleUseCase {
  execute: (
    userId: string,
    scheduleId: string,
    updateScheduleDTO: UpdateScheduleDTO,
  ) => Promise<ScheduleEntity>;
}

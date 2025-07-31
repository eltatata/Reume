import { ScheduleEntity, UpdateScheduleDTO, UserRole } from '../..';

export interface UpdateScheduleUseCase {
  execute: (
    userId: string,
    scheduleId: string,
    updateScheduleDTO: UpdateScheduleDTO,
    userRole: UserRole,
  ) => Promise<ScheduleEntity>;
}

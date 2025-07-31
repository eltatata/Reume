import { ScheduleEntity, UserRole } from '../../';

export interface FindAllSchedulesUseCase {
  execute: (userId: string, role: UserRole) => Promise<ScheduleEntity[]>;
}

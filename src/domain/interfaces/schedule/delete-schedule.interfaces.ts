import { UserRole } from '../..';

export interface DeleteScheduleUseCase {
  execute: (
    userId: string,
    scheduleId: string,
    userRole: UserRole,
  ) => Promise<void>;
}

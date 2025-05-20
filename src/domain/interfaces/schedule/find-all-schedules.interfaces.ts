import { ScheduleEntity } from '../../';

export interface FindAllSchedulesUseCase {
  execute: (userId?: string) => Promise<ScheduleEntity[]>;
}

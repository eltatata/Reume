import { ScheduleEntity } from '../../';

export interface FindAllSchedulesUseCase {
  execute: () => Promise<ScheduleEntity[]>;
}

import { CreateScheduleDTO, ScheduleEntity } from '../../';

export interface CreateScheduleUseCase {
  execute: (
    userId: string,
    createScheduleDTO: CreateScheduleDTO,
  ) => Promise<ScheduleEntity>;
}

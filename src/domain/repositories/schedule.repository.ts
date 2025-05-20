import { ScheduleEntity, CreateScheduleDTO, UpdateScheduleDTO } from '../';

export interface ScheduleRepository {
  findById(id: string): Promise<ScheduleEntity | null>;
  findAll(userId?: string): Promise<ScheduleEntity[]>;
  create(
    userId: string,
    createScheduleDto: CreateScheduleDTO,
  ): Promise<ScheduleEntity>;
  update(
    id: string,
    updateScheduleDto: UpdateScheduleDTO,
  ): Promise<ScheduleEntity | null>;
  delete(id: string): Promise<boolean>;
}

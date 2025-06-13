import {
  ScheduleEntity,
  CreateScheduleDTO,
  UpdateScheduleDTO,
  FindAvailableTimesDTO,
} from '../';

export interface ScheduleRepository {
  findById(id: string): Promise<ScheduleEntity | null>;
  findOverlapping(startTime: Date, endTime: Date): Promise<ScheduleEntity[]>;
  findByDate(
    findAvailableTimesDto: FindAvailableTimesDTO,
  ): Promise<ScheduleEntity[]>;
  findAll(): Promise<ScheduleEntity[]>;
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

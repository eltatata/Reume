import { FindAvailableTimesDTO } from '../../dtos/schedule/find-available-times';

export interface FindAvailableTimesUseCase {
  execute: (findAvailableTimesDto: FindAvailableTimesDTO) => Promise<string[]>;
}

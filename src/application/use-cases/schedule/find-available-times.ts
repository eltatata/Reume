import { loggerAdapter } from '../../../config';
import {
  ScheduleRepository,
  FindAvailableTimesUseCase,
  ScheduleEntity,
  FindAvailableTimesDTO,
} from '../../../domain';

const logger = loggerAdapter('FindAvailableTimesUseCase');

export class FindAvailableTimes implements FindAvailableTimesUseCase {
  private readonly START_HOUR = 6;
  private readonly END_HOUR = 18;

  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(
    findAvailableTimesDto: FindAvailableTimesDTO,
  ): Promise<string[]> {
    logger.log(
      `Finding available times for date: ${findAvailableTimesDto.date}`,
    );

    const schedules = await this.scheduleRepository.findByDate(
      findAvailableTimesDto,
    );

    const availableTimes = this.generateTimeSlots();
    const filteredTimes = this.filterOccupiedSlots(availableTimes, schedules);

    logger.log(
      `Found ${filteredTimes.length} available time slots for date: ${findAvailableTimesDto.date}`,
    );
    return filteredTimes;
  }

  private generateTimeSlots(): string[] {
    const timeSlots: string[] = [];

    for (let hour = this.START_HOUR; hour < this.END_HOUR; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        timeSlots.push(timeSlot);
      }
    }

    return timeSlots;
  }

  private filterOccupiedSlots(
    timeSlots: string[],
    schedules: ScheduleEntity[],
  ): string[] {
    return timeSlots.filter((timeSlot) => {
      const [hour, minute] = timeSlot.split(':').map(Number);
      const slotDateTime = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        hour,
        minute,
      );

      return !schedules.some((schedule) => {
        const startTime = new Date(schedule.startTime);
        const endTime = new Date(schedule.endTime);
        return slotDateTime >= startTime && slotDateTime < endTime;
      });
    });
  }
}

export interface DeleteScheduleUseCase {
  execute: (userId: string, scheduleId: string) => Promise<void>;
}

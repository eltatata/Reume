export interface UpdateUserEmailUseCase {
  execute(token: string): Promise<void>;
}

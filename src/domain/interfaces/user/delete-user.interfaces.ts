import { UserRole } from '../..';

export interface DeleteUserUseCase {
  execute(id: string, userId: string, role: UserRole): Promise<void>;
}

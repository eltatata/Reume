import { UserEntity, BaseOperations } from '../';

export interface UserRepository extends BaseOperations<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
}

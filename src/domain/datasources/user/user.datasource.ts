import { UserEntity, BaseOperations } from '../../';

export interface UserDatasource extends BaseOperations<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
}

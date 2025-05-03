import { UserEntity } from '../';

export interface UserDatasource {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  create(entity: Partial<UserEntity>): Promise<UserEntity>;
  update(id: string, entity: Partial<UserEntity>): Promise<UserEntity | null>;
  delete(id: string): Promise<boolean>;
}

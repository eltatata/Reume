import { UserRole } from '../';

export class UserWithSchedulesEntity {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public role: UserRole,
    public verified: boolean,
    public createdAt: Date,
    public schedulesCount: number,
    public phone?: string,
    public password?: string,
  ) {}

  static toEntity(obj: unknown): UserWithSchedulesEntity {
    const {
      id,
      firstName,
      lastName,
      email,
      role,
      verified,
      createdAt,
      phone,
      password,
      schedulesCount,
    } = obj as UserWithSchedulesEntity;

    return new UserWithSchedulesEntity(
      id,
      firstName,
      lastName,
      email,
      role,
      verified,
      createdAt,
      schedulesCount || 0,
      phone,
      password,
    );
  }
}

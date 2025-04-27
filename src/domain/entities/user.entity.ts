import { UserRole } from '../';

export class UserEntity {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public role: UserRole,
    public verified: boolean,
    public createdAt: Date,
    public phone?: string,
  ) {}

  static toJSON(obj: unknown): UserEntity {
    const { id, firstName, lastName, email, role, verified, createdAt, phone } =
      obj as UserEntity;

    return {
      id,
      firstName,
      lastName,
      email,
      role,
      verified,
      createdAt,
      phone,
    };
  }
}

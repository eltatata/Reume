import { UserRole } from '../';

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly role: UserRole,
    public readonly verified: boolean,
    public readonly createdAt: Date,
    public readonly phone?: string,
  ) {}

  static toJSON(user: unknown): UserEntity {
    const { id, firstName, lastName, email, role, verified, createdAt, phone } =
      user as UserEntity;

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

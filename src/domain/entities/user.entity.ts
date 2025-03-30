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

  public toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      role: this.role,
      verified: this.verified,
      phone: this.phone,
      createdAt: this.createdAt,
    };
  }
}

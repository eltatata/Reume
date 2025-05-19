export class OtpEntity {
  constructor(
    public id: string,
    public userId: string,
    public otp: string,
    public expiresAt: Date,
    public used: boolean,
    public createdAt: Date,
  ) {}

  static toEntity(obj: unknown): OtpEntity {
    const { id, userId, otp, expiresAt, used, createdAt } = obj as OtpEntity;

    return new OtpEntity(id, userId, otp, expiresAt, used, createdAt);
  }
}

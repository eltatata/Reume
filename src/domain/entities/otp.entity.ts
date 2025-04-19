export class OtpEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly otp: string,
    public readonly expiresAt: Date,
    public readonly used: boolean,
    public readonly createdAt: Date,
  ) {}

  static toJSON(obj: unknown): OtpEntity {
    const { id, userId, otp, expiresAt, used, createdAt } = obj as OtpEntity;

    return {
      id,
      userId,
      otp,
      expiresAt,
      used,
      createdAt,
    };
  }
}

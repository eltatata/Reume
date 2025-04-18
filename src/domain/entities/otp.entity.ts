export class OtpEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly otp: string,
    public readonly expiresAt: Date,
    public readonly used: boolean,
  ) {}

  static toJSON(obj: unknown): OtpEntity {
    const { id, userId, otp, expiresAt, used } = obj as OtpEntity;

    return {
      id,
      userId,
      otp,
      expiresAt,
      used,
    };
  }
}

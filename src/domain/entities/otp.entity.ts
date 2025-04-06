export class OtpEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly otp: string,
  ) {}

  static toJSON(obj: unknown): OtpEntity {
    const { id, userId, otp } = obj as OtpEntity;

    return {
      id,
      userId,
      otp,
    };
  }
}

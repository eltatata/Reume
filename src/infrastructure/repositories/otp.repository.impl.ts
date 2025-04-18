import { OtpEntity, OtpRepository, OtpDatasource } from '../../domain';

export class OtpRepositoryImpl implements OtpRepository {
  constructor(private readonly otpDatasource: OtpDatasource) {}

  create(userId: string, otp: string): Promise<OtpEntity> {
    return this.otpDatasource.create(userId, otp);
  }

  findByUserId(userId: string): Promise<OtpEntity | null> {
    return this.otpDatasource.findByUserId(userId);
  }

  markAsUsed(otp: string): Promise<void> {
    return this.otpDatasource.markAsUsed(otp);
  }
}

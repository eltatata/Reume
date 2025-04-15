import { OtpRepository, OtpEntity } from '../../src/domain';
import { MockOtpDatasource } from './mock-otp.datasource';
export class MockOtpRepository implements OtpRepository {
  constructor(private readonly datasource: MockOtpDatasource) {}

  async create(userId: string, otp: string): Promise<OtpEntity> {
    return this.datasource.create(userId, otp);
  }

  async findByUserId(userId: string): Promise<OtpEntity | null> {
    return this.datasource.findByUserId(userId);
  }

  async markAsUsed(otpId: string): Promise<void> {
    return this.datasource.markAsUsed(otpId);
  }
}

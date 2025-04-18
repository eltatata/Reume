import { OtpEntity } from '../';

export interface OtpDatasource {
  create(userId: string, otp: string): Promise<OtpEntity>;
  findByUserId(userId: string): Promise<OtpEntity | null>;
  markAsUsed(otpId: string): Promise<void>;
}

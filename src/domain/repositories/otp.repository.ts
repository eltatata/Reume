import { OtpEntity } from '../';

export interface OtpRepository {
  create(userId: string, otp: string): Promise<OtpEntity>;
  findByUserId(userId: string): Promise<OtpEntity | null>;
  markAsUsed(otp: string): Promise<void>;
}

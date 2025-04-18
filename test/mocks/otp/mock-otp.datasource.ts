import { randomUUID } from 'crypto';
import { OtpDatasource, OtpEntity } from '../../../src/domain';

interface OtpMock {
  id: string;
  userId: string;
  otp: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

export class MockOtpDatasource implements OtpDatasource {
  private otpsMock: OtpMock[] = [
    {
      id: '1',
      userId: '1',
      otp: '$2a$10$iPJpdigui8k9OUowdF5wXuXBj6uASSWPazTL9/7M7qy7wNjFY/Eqq',
      expiresAt: new Date(Date.now() + 1000 * 60 * 5),
      used: false,
      createdAt: new Date(),
    },
  ];

  async create(userId: string, otp: string): Promise<OtpEntity> {
    const newOtp = {
      id: randomUUID(),
      userId,
      otp,
      expiresAt: new Date(Date.now() + 1000 * 60 * 5),
      used: false,
      createdAt: new Date(),
    };

    this.otpsMock.push(newOtp);
    return OtpEntity.toJSON(newOtp);
  }

  async findByUserId(userId: string): Promise<OtpEntity | null> {
    const otp = this.otpsMock.find((otp) => otp.userId === userId);
    return otp ? OtpEntity.toJSON(otp) : null;
  }

  async markAsUsed(otpId: string): Promise<void> {
    const otpIndex = this.otpsMock.findIndex((otp) => otp.id === otpId);
    if (otpIndex !== -1) {
      this.otpsMock[otpIndex].used = true;
    }
  }
}

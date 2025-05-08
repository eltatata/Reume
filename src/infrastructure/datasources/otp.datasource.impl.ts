import { prisma } from '../../data/prisma.connection';
import { OtpEntity, OtpDatasource } from '../../domain';

export class OtpDatasourceImpl implements OtpDatasource {
  async create(userId: string, otp: string): Promise<OtpEntity> {
    const newOtp = await prisma.otpVerification.create({
      data: {
        userId,
        otp,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
    return OtpEntity.toEntity(newOtp);
  }

  async findByUserId(userId: string): Promise<OtpEntity | null> {
    const otp = await prisma.otpVerification.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });
    return otp ? OtpEntity.toEntity(otp) : null;
  }

  async markAsUsed(otpId: string): Promise<void> {
    await prisma.otpVerification.updateMany({
      where: { id: otpId },
      data: { used: true },
    });
  }
}

import { prisma } from '../../data/prisma.connection';
import { envs } from '../../config/adapters/envs.adapter';
import { OtpEntity, OtpDatasource } from '../../domain';

export class OtpDatasourceImpl implements OtpDatasource {
  async create(userId: string, otp: string): Promise<OtpEntity> {
    const newOtp = await prisma.otpVerification.create({
      data: {
        userId,
        otp,
        expiresAt: new Date(Date.now() + envs.OTP_EXPIRATION_DATE_TIME),
      },
    });
    return OtpEntity.toJSON(newOtp);
  }

  async findByUserId(userId: string): Promise<OtpEntity | null> {
    const otp = await prisma.otpVerification.findFirst({
      where: {
        userId,
      },
    });
    return otp ? OtpEntity.toJSON(otp) : null;
  }

  async markAsUsed(otp: string): Promise<void> {
    await prisma.otpVerification
      .findFirst({
        where: { otp },
      })
      .then(async (record) => {
        if (record) {
          await prisma.otpVerification.update({
            where: { id: record.id },
            data: { used: true },
          });
        }
      });
  }
}

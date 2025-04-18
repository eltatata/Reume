import { ResendOtpDto, VerifyOtpDto } from '../../';

export interface VerifyOtpUseCase {
  execute(verifyOtpDto: VerifyOtpDto): Promise<void>;
}

export interface ResendOtpUseCase {
  execute(resendOtpDto: ResendOtpDto): Promise<void>;
}

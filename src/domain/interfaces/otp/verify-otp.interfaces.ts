import { VerifyOtpDto } from '../../';

export interface VerifyOtpUseCase {
  execute(verifyOtpDto: VerifyOtpDto): Promise<void>;
}

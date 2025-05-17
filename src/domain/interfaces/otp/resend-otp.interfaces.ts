import { ResendOtpDto } from '../../';

export interface ResendOtpUseCase {
  execute(resendOtpDto: ResendOtpDto): Promise<void>;
}

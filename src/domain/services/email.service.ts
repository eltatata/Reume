export interface EmailService {
  sendVerificationEmail(to: string, name: string, otp: string): Promise<void>;
}

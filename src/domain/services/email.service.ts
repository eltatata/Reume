export interface EmailService {
  sendVerificationEmail(to: string, name: string, otp: string): Promise<void>;
  sendEmailVerificationLink(
    to: string,
    verificationLink: string,
  ): Promise<void>;
}

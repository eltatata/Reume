import { get } from 'env-var';

export const envs = {
  NODE_ENV: get('NODE_ENV').default('development').asString(),
  PORT: get('PORT').required().asPortNumber(),
  DATABASE_URL: get('DATABASE_URL').required().asString(),
  POSTGRES_USER: get('POSTGRES_USER').required().asString(),
  POSTGRES_PASSWORD: get('POSTGRES_PASSWORD').required().asString(),
  POSTGRES_DB: get('POSTGRES_DB').required().asString(),
  RESEND_API_KEY: get('RESEND_API_KEY').required().asString(),
  OTP_EXPIRATION_DATE_TIME: get('OTP_EXPIRATION_DATE_TIME').required().asInt(),
};

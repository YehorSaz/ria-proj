import dotenv from 'dotenv';

dotenv.config();

export const configs = {
  PORT: process.env.PORT || 3003,
  DB_URI: process.env.DB_URI,
  FRONT_URL: process.env.FRONT_URL,

  SECRET_PASS: process.env.SECRET_PASS,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACTIVATE_SECRET: process.env.JWT_ACTIVATE_SECRET,
  JWT_FORGOT_SECRET: process.env.JWT_FORGOT_SECRET,

  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,

  AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
  AWS_S3_SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  AWS_S3_REGION: process.env.AWS_S3_REGION,
  AWS_S3_URL: process.env.AWS_S3_URL,
};

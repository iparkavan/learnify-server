import { getEnv } from "../utils/get-env";

const appConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "5000"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  // MONGO_URI: getEnv("MONGO_URI", ""),

  JWT_SECRET: getEnv("JWT_SECRET", ""),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", ""),

  SMTP_HOST: getEnv("SMTP_HOST", ""),
  SMTP_PORT: getEnv("SMTP_PORT", ""),
  SMTP_USER: getEnv("SMTP_USER", ""),
  SMTP_PASS: getEnv("SMTP_PASS", ""),
  FROM_EMAIL: getEnv("FROM_EMAIL", ""),
  OTP_TTL_MINUTES: getEnv("OTP_TTL_MINUTES", ""),

  SENDGRID_API_KEY: getEnv("SENDGRID_API_KEY", ""),

  RAZORPAY_KEY_ID: getEnv("RAZORPAY_KEY_ID"),
  RAZORPAY_KEY_SECRET: getEnv("RAZORPAY_KEY_SECRET"),

  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
  GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL"),

  CLOUDINARY_CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET"),

  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "https://maxskill-ai.vercel.app"),
  LOCAL_FRONTEND_ORIGIN: getEnv(
    "LOCAL_FRONTEND_ORIGIN",
    "http://localhost:3000",
  ),
});

export const config = appConfig();

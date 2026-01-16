// services/otpService.ts
import { PrismaClient } from "@prisma/client";
import { sendOtpEmail } from "../utils/mailer";
import { compareValue, hashValue } from "../utils/bcrypt";

const prisma = new PrismaClient();

// Generate and send OTP
export const generateOtp = async (email: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const otpHash = await hashValue(otp, 10);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await prisma.emailOtp.create({
    data: { email, otpHash, expiresAt },
  });

  await sendOtpEmail(email, otp);
};

// Verify OTP
export const verifyOtp = async (email: string, otp: string) => {
  const record = await prisma.emailOtp.findFirst({
    where: { email, used: false },
    orderBy: { createdAt: "desc" },
  });

  if (!record) return false;
  if (record.expiresAt < new Date()) return false;

  const valid = await compareValue(otp, record.otpHash);
  if (!valid) return false;

  await prisma.emailOtp.update({
    where: { id: record.id },
    data: { used: true },
  }); // mark as used
  return true;
};

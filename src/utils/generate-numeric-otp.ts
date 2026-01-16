const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES || 10);
const OTP_LENGTH = 6;
const BCRYPT_SALT_ROUNDS = 10;

export const generateNumericOtp = (len = OTP_LENGTH) => {
  let otp = "";
  for (let i = 0; i < len; i++) otp += Math.floor(Math.random() * 10);
  return otp;
};

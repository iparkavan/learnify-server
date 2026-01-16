// controllers/studentOtp.ts
import { Request, Response } from "express";
import { generateOtp, verifyOtp } from "../services/otp.service";
import {
  loginSchema,
  studentSignUpSchema,
  verifyUserSchema,
} from "../validations/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { prisma } from "../config/prisma.config";
import { studentOrInstructorSignInWithOtp } from "../services/auth.service";

export const loginSendOtpController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException("Email not found, Create an account");
    }

    await generateOtp(email);

    res.json({
      message: "OTP sent to email",
      email,
      name: user.name, // Use name from DB
    });
  }
);

export const signupSendOtpController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = studentSignUpSchema.parse(req.body);
    const { email, name } = body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException("Email already registered. Please log in.");
    }

    // Send OTP since email is new
    await generateOtp(email);

    res.status(HTTPSTATUS.OK).json({
      message: "OTP sent to email",
      email,
      name,
    });
  }
);

export const verifyOtpController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = verifyUserSchema.parse(req.body);

    const { name, email, otp, type } = body;

    const isValid = await verifyOtp(email, otp);

    if (!isValid)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const { message, user, token } = await studentOrInstructorSignInWithOtp(
      email,
      name,
      type
    );

    // Set token in header
    res.setHeader("Authorization", `Bearer ${token}`);

    res.status(HTTPSTATUS.OK).json({
      message,
      user,
      token, // optional in body
    });
  }
);

export const googleAuthCallbackController = (req: Request, res: Response) => {
  const { user, token } = req.user as any;

  if (!token || !user) {
    return res
      .status(HTTPSTATUS.BAD_REQUEST)
      .json({ message: "Google authentication failed" });
  }
  const encodedUser = encodeURIComponent(JSON.stringify(user));

  const redirectOrigin =
    config.NODE_ENV === "development"
      ? config.LOCAL_FRONTEND_ORIGIN
      : config.FRONTEND_ORIGIN;

  // Option 1: Redirect to frontend with token
  return res.redirect(
    `${redirectOrigin}/auth/success?token=${token}&user=${encodedUser}`
  );
};

export const getProfileController = (req: Request, res: Response) => {
  res.json({ user: req.user });
};

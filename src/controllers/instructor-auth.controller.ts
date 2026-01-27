import { Request, Response } from "express";
import {
  createInstructorUserService,
  loginInstructorUserService,
} from "../services/instructor-auth.service";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";

export const signupInstructorController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const user = await createInstructorUserService({
      name,
      email,
      password,
    });
    res.status(HTTPSTATUS.OK).json({ success: true, user });
  },
);

export const loginInstructorController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await loginInstructorUserService({ email, password });
    res.status(HTTPSTATUS.OK).json({ success: true, ...result });
  },
);

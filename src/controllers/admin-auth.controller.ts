import { Request, Response } from "express";
import {
  createAdminUserService,
  loginAdminUserService,
} from "../services/admin-auth.service";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";

export const signupAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const user = await createAdminUserService({
      name,
      email,
      password,
    });
    res.status(HTTPSTATUS.OK).json({ success: true, user });
  }
);

export const loginAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await loginAdminUserService({ email, password });
    res.status(HTTPSTATUS.OK).json({ success: true, ...result });
  }
);

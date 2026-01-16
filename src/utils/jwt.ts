import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/app.config";

export interface CustomJwtPayload {
  id: string;
  name: string;
  email?: string;
  role?: string;
}

export function signJwt(payload: CustomJwtPayload) {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN as any,
  });
}

export function verifyJwt<T = CustomJwtPayload>(token: string): T {
  return jwt.verify(token, config.JWT_SECRET) as T;
}

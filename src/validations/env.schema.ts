import { z } from "zod";
import "dotenv/config";

export const env = z
  .object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    SENDGRID_API_KEY: z.string().optional(),
  })
  .parse(process.env);

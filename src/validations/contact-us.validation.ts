import z from "zod";
import { eamilSchema } from "./auth.validation";

export const contactUsSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name is too long"),
  email: eamilSchema,
  message: z
    .string()
    .min(10, "Message must be at least 10 characters long")
    .max(1000, "Message is too long"),
});

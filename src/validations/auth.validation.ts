import z from "zod";

export const eamilSchema = z
  .string()
  .email("Invalid email address")
  .min(1)
  .max(225);

export const passwordSchema = z.string().trim().min(4);

// export const phoneSchema = z
//   .string()
//   .min(6, "Phone number too short")
//   .max(20, "Phone number too long")
//   .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, "Invalid phone number format");

export const studentSignUpSchema = z.object({
  name: z.string().min(1).max(225).optional(),
  email: eamilSchema,
  // password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().email(),
});

export const verifyUserSchema = z.object({
  email: eamilSchema,
  name: z.string().min(1).max(225).optional(),
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must contain only numbers" }),

  type: z.enum(["STUDENT", "INSTRUCTOR"], {
    required_error: "User type is required",
    invalid_type_error: "Type must be STUDENT or INSTRUCTOR",
  }),
});

export type studentSignUpSchemaType = z.infer<typeof studentSignUpSchema>;

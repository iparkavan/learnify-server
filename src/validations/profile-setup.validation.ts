import z from "zod";

export const StudentProfileSetupValidation = z.object({
  degreeProgram: z.string().min(1, "Please select your degree program"),
  studyYear: z.string().min(1, "Please select your study year"),
  specialization: z
    .string()
    .min(1, "Please enter your specialization")
    .max(100, "Specialization must be less than 100 characters"),
  collegeName: z
    .string()
    .min(1, "Please enter your college name")
    .max(150, "College name must be less than 150 characters"),
  graduationYear: z.string().min(4, "Please enter your graduation year"),
  // .union([z.coerce.number().min(2000).max(2035), z.literal("")])
  // .optional(),
  country: z
    .string()
    .min(1, "Please enter your country")
    .max(100, "Country must be less than 100 characters"),
  referralSource: z.string().min(1, "Please select how you heard about us"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be less than 20 characters"),
});

export type StudentProfileSetupValidationType = z.infer<
  typeof StudentProfileSetupValidation
>;

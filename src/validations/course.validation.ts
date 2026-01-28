import { z } from "zod";
import { SectionSchema } from "./section.validation";

export const CourseLevelEnum = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]);

const baseCourseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters"),
  slug: z
    .string()
    .min(3, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be URL-friendly (lowercase, hyphens only)",
    ),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description is too long"),
  category: z.string().min(1, "Category is required").max(100).optional(),
  thumbnail: z.string().url("Thumbnail must be a valid URL").optional(),
  level: CourseLevelEnum.optional(),
  totalDuration: z
    .number()
    .int("Duration must be an integer")
    .positive("Duration must be positive")
    .optional(),
  price: z.number().min(0, "Price must be a positive number"),
  published: z.boolean().optional(),
});

// ✅ Create course (all required except optional ones)
export const createCourseSchema = baseCourseSchema;

// ✅ Update course (all optional)
export const updateCourseSchema = baseCourseSchema.partial();

export const CourseSchema = z.object({
  courseData: z.object({
    course: z.object({
      title: z.string().min(3),
      subtitle: z.string().optional(),
      description: z.string().min(100),
      category: z.string().min(2),
      subcategory: z.string().optional(),
      level: z.string(),
      language: z.string(),

      // FIX: coerce number
      price: z.coerce.number().min(0),

      thumbnail: z.string().url().optional(),

      // FIX: accept promoVideo OR promo_video_url
      promoVideo: z
        .string()
        .url()
        .optional()
        .or(z.literal(""))
        .transform((v) => (v === "" ? undefined : v)),
    }),

    sections: z.array(SectionSchema).default([]),
  }),
});

export type FullCourseData = z.infer<typeof CourseSchema>;

export type CreateCourseType = z.infer<typeof createCourseSchema>;
export type UpdateCourseType = z.infer<typeof updateCourseSchema>;

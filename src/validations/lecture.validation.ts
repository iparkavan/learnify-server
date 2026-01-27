// src/modules/course/course.schema.ts
import { z } from "zod";

// src/modules/course/course.enums.ts
export const LectureTypeEnum = [
  "VIDEO",
  "QUIZ",
  "ASSIGNMENT",
  "CODING",
] as const;
export const CourseStatusEnum = ["DRAFT", "PUBLISHED"] as const;

export const LectureSchema = z.object({
  title: z.string().min(1).optional(),
  type: z.enum(LectureTypeEnum),
  duration: z.number().int().positive().optional(),
  content_url: z.string().url().optional(),
  has_content: z.boolean(),
});

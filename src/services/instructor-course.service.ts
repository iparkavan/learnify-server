import slugify from "slugify";
import { prisma } from "../lib/schema";
import { NotFoundException, UnauthorizedException } from "../utils/app-error";
import { UpdateCourseType } from "../validations/course.validation";

export const createCourseService = async (title: string, userId: string) => {
  const instructorProfile = await prisma.instructorProfile.findUnique({
    where: { userId: userId },
  });

  if (!instructorProfile) {
    throw new Error("Instructor profile not found");
  }

  const course = await prisma.course.create({
    data: {
      title: title || "Untitled Course",
      slug: `course-${Date.now()}`,
      description: "",
      price: 0,
      level: "BEGINNER",
      categoryId: "cmmr9w71j0000vouif9rejt28", // handle properly
      instructorId: instructorProfile?.id,
      status: "DRAFT",
      published: false,
    },
  });

  return {
    course,
  };
};

export const updateCourseService = async (
  courseId: string,
  userId: string,
  data: UpdateCourseType,
) => {
  const instructorProfile = await prisma.instructorProfile.findUnique({
    where: { userId: userId },
  });

  const existingCourse = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!existingCourse) throw new NotFoundException("Course not found");

  if (existingCourse.instructorId !== instructorProfile?.id) {
    throw new UnauthorizedException("Unauthorized");
  }

  if (!data.title) {
    throw new Error("Course title is required");
  }

  let categoryId: string | undefined;

  if (data.category) {
    const category = await prisma.category.findUnique({
      where: { id: data.category },
    });

    if (!category) {
      throw new Error("Invalid category ID");
    }

    categoryId = category.id;
  }

  let baseSlug = slugify(data.title, { lower: true });

  let slug = baseSlug;

  const course = await prisma.course.update({
    where: { id: courseId },
    data: {
      title: data.title,
      description: data.description,
      subtitle: data.subtitle,
      instructorId: instructorProfile.id,
      slug,
      welcomeMessage:
        data.welcomeMessage ||
        "Welcome to the course! We're excited to have you on board. Get ready to embark on a learning journey that will expand your knowledge and skills. Let's dive in and start learning together!",
      congratsMessage:
        data.congratsMessage ||
        "Congratulations! You've completed the course. We hope you've gained valuable knowledge and skills.",
      price: Number(data.price),
      ...(data.level && { level: data.level }),
      categoryId: categoryId,
      thumbnail: data.thumbnail,
      promoVideo: data.promoVideo,
      learningObjectives: data.learningObjectives,
      prerequisites: data.prerequisites,
      targetAudience: data.targetAudience,
      status: "DRAFT",
    },
  });
  return { course };
};

export const getCourseByIdService = async (courseId: string) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          lectures: {
            orderBy: { order: "asc" },
            include: {
              video: true,
              quiz: true,
              resources: true,
            },
          },
        },
      },
    },
  });

  return { course };
};

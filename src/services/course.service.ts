// import { prisma } from "../config/prisma.config";
import slugify from "slugify";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { FullCourseData } from "../validations/course.validation";
import { NotFoundException } from "../utils/app-error";
import { prisma } from "../lib/schema";
import { CourseLevel, LectureType } from "../generated/prisma/enums";

export const getAllCoursesService = async () => {
  return prisma.course.findMany({
    include: {
      category: true,
      instructor: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
      _count: {
        select: {
          reviews: true,
          enrollments: true,
        },
      },
    },
  });
};

export const saveCompleteCourseService = async (
  data: FullCourseData,
  instructorId: string,
) => {
  return prisma.$transaction(async (tx) => {
    // const { courseData } = data;
    const courseData = data.courseData;
    const courseInput = courseData.course;

    // Validate instructor
    const user = await tx.user.findUnique({ where: { id: instructorId } });
    if (!user) throw new NotFoundException("User not found");

    const instructor = await tx.instructorProfile.findUnique({
      where: { userId: user.id },
    });
    if (!instructor) throw new NotFoundException("Instructor not found");

    // Generate unique slug
    let baseSlug = slugify(courseInput.title, { lower: true });
    let slug = baseSlug;
    let count = 1;

    while (await tx.course.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    // Create course
    const course = await tx.course.create({
      data: {
        title: courseInput.title,
        description: courseInput.description,
        instructorId: instructor.id,
        slug,
        price: courseInput.price,
        level: courseInput.level as CourseLevel,
        categoryId: courseInput.category,
        thumbnail: courseInput.thumbnail,
        promoVideo: courseInput.promoVideo,
        status: "DRAFT",
      },
    });

    // Sections + Lectures
    for (let secIndex = 0; secIndex < courseData.sections.length; secIndex++) {
      const section = courseData.sections[secIndex];

      const savedSection = await tx.section.create({
        data: {
          courseId: course.id,
          title: section.title || `Section ${secIndex + 1}`,
          order: secIndex,
        },
      });

      if (section.lectures?.length) {
        for (let lecIndex = 0; lecIndex < section.lectures.length; lecIndex++) {
          const lecture = section.lectures[lecIndex];
          await tx.lecture.create({
            data: {
              title: lecture.title!,
              order: lecIndex,
              type: lecture.type,
              sectionId: savedSection.id,

              ...(lecture.type === "VIDEO" && {
                video: {
                  create: {
                    originalUrl: lecture.content_url ?? "",
                    duration: lecture.duration,
                  },
                },
              }),
            },
          });
        }
      }
    }

    return course;
  });
};

export const createCourse = (data: any, instructorId: string) => {
  return prisma.course.create({
    data: {
      title: data.title,
      description: data.description,
      price: Number(data.price),
      level: data.level,
      categoryId: data.categoryId,
      instructorId,
      slug: slugify(data.title),
      published: false, // draft
      status: "draft",
    },
  });
};

export const getCourse = async (slug: string) => {
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
      sections: {
        include: {
          lectures: true,
          _count: {
            select: {
              lectures: true,
            },
          },
        },
      },

      category: true,
      _count: { select: { reviews: true, enrollments: true, sections: true } },
    },
  });

  return course;
};

// export const updateCourse = (id: string, data: any) => {
//   return prisma.course.update({
//     where: { id },
//     data,
//   });
// };

// export const publishCourse = (id: string) => {
//   return prisma.course.update({
//     where: { id },
//     data: { published: true },
//   });
// };

// export const deleteCourse = (id: string) => {
//   return prisma.course.delete({ where: { id } });
// };

export const validateBeforePublish = async (courseId: string) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { sections: { include: { lectures: true } } },
  });

  if (!course?.title || !course.description || course.description.length < 200)
    throw new Error("Course info incomplete");

  if (!course.thumbnail) throw new Error("Thumbnail required");

  if (course.sections.length === 0) throw new Error("Add at least one section");

  const lectures = course.sections.flatMap((s) => s.lectures);
  if (lectures.length === 0) throw new Error("Add lectures");

  const hasVideo = lectures.some((l) => l.type === "VIDEO");
  if (!hasVideo) throw new Error("At least one video required");
};

// INSTRUCTOR COURSE SERVICE

export const getInstructorOnlyCourses = async (instructorId: string) => {
  const courses = await prisma.course.findMany({
    where: {
      instructorId,
    },
  });

  return courses;
};

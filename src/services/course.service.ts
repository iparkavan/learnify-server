// import { prisma } from "../config/prisma.config";
import slugify from "slugify";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { FullCourseData } from "../validations/course.validation";
import { NotFoundException } from "../utils/app-error";
import { prisma } from "../lib/schema";
import { CourseLevel, LectureType } from "../generated/prisma/enums";

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
        //   await tx.lecture.createMany({
        //     data: section.lectures.map((lecture, lIndex) => ({
        //       sectionId: savedSection.id,
        //       title: lecture.title || `Lecture ${lIndex + 1}`,
        //       type: lecture.type as LectureType,
        //       duration: lecture.duration,
        //       contentUrl: lecture.content_url,
        //       hasContent: lecture.has_content,
        //       order: lIndex,
        //     })),
        //   });
        // }

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

export const getCourse = (id: string) => {
  return prisma.course.findUnique({
    where: { id },
    include: { sections: true },
  });
};

export const updateCourse = (id: string, data: any) => {
  return prisma.course.update({
    where: { id },
    data,
  });
};

export const publishCourse = (id: string) => {
  return prisma.course.update({
    where: { id },
    data: { published: true },
  });
};

export const deleteCourse = (id: string) => {
  return prisma.course.delete({ where: { id } });
};

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

// import { CourseLevel, PrismaClient } from "@prisma/client";
// import {
//   BadRequestException,
//   InternalServerException,
//   NotFoundException,
// } from "../utils/app-error";
// import {
//   CreateCourseType,
//   UpdateCourseType,
// } from "../validations/course.validation";
// import slugify from "slugify";

// const prisma = new PrismaClient();

// export const createCourseService = async (
//   data: CreateCourseType,
//   instructorId: string
// ) => {
//   return await prisma.$transaction(async (tx) => {
//     const user = await tx.user.findUnique({
//       where: { id: instructorId }, // ✅ correct key
//     });

//     if (!user) throw new NotFoundException("User not found");

//     // 2️⃣ Validate InstructorProfile if user is instructor
//     let instructorProfileId: string | undefined = undefined;
//     // if (user.role === "INSTRUCTOR") {
//     const instructorProfile = await tx.instructorProfile.findUnique({
//       where: { userId: instructorId }, // ✅ correct key
//     });

//     console.log("instructorProfile", instructorProfile);

//     if (!instructorProfile) {
//       throw new NotFoundException("Instructor profile not found");
//     }

//     // instructorProfileId = instructorProfile.id;
//     // }

//     // 3️⃣ Check duplicate course title for this instructor/admin
//     const existingCourse = await tx.course.findFirst({
//       where: {
//         title: data.title,
//         instructorId: instructorProfileId || undefined, // undefined if admin
//       },
//     });

//     if (existingCourse) {
//       throw new BadRequestException(
//         "You already have a course with this title"
//       );
//     }

//     // 4️⃣ Validate category
//     const category = await tx.category.findFirst({
//       where: {
//         OR: [{ id: data.category }, { name: data.category }],
//       },
//     });

//     if (!category) {
//       throw new NotFoundException("Category not found");
//     }

//     // 5️⃣ Generate slug
//     const slug =
//       data.slug || slugify(data.title, { lower: true, strict: true });

//     // 6️⃣ Create course
//     const courseData: any = {
//       title: data.title,
//       slug,
//       description: data.description,
//       thumbnail: data.thumbnail,
//       level: data.level as CourseLevel,
//       totalDuration: data.totalDuration,
//       price: data.price ?? 0,
//       instructor: { connect: { id: instructorProfile.id } },
//       category: { connect: { id: category.id } },
//     };

//     const newCourse = await tx.course.create({
//       data: courseData,
//       include: {
//         category: true,
//         instructor: true, // will include profile if exists
//       },
//     });

//     return newCourse;
//   });
// };

// export const updateCourseService = async (
//   courseId: string,
//   userId: string, // could be instructor or admin
//   data: UpdateCourseType
// ) => {
//   return await prisma.$transaction(async (tx) => {
//     // 1️⃣ Find the user
//     const user = await tx.user.findUnique({ where: { id: userId } });
//     if (!user) throw new NotFoundException("User not found");

//     // 2️⃣ Get instructor profile if user is INSTRUCTOR
//     const instructorProfile = await tx.instructorProfile.findUnique({
//       where: { userId },
//     });

//     console.log("instructorProfile", instructorProfile);

//     if (!instructorProfile) {
//       throw new NotFoundException("Instructor profile not found");
//     }

//     // 3️⃣ Check if course exists
//     const existingCourse = await tx.course.findUnique({
//       where: { id: courseId },
//       include: { instructor: true },
//     });
//     if (!existingCourse) throw new NotFoundException("Course not found");

//     // 4️⃣ Optional: Validate category if provided
//     let categoryConnect = undefined;
//     if (data.category) {
//       const category = await tx.category.findFirst({
//         where: { OR: [{ id: data.category }, { name: data.category }] },
//       });
//       if (!category) throw new NotFoundException("Category not found");
//       categoryConnect = { connect: { id: category.id } };
//     }

//     // 5️⃣ Optional: Regenerate slug
//     const slug =
//       data.slug ??
//       (data.title
//         ? slugify(data.title, { lower: true, strict: true })
//         : existingCourse.slug);

//     // 6️⃣ Update the course
//     const courseData: any = {
//       title: data.title ?? existingCourse.title,
//       slug,
//       description: data.description ?? existingCourse.description,
//       thumbnail: data.thumbnail ?? existingCourse.thumbnail,
//       level: (data.level as CourseLevel) ?? existingCourse.level,
//       totalDuration: data.totalDuration ?? existingCourse.totalDuration,
//       price: data.price ?? existingCourse.price,
//       instructor: { connect: { id: instructorProfile.id } }, // ✅ same logic as create
//       ...(categoryConnect && { category: categoryConnect }),
//     };

//     const updatedCourse = await tx.course.update({
//       where: { id: courseId },
//       data: courseData,
//       include: {
//         category: true,
//         instructor: true,
//       },
//     });

//     return updatedCourse;
//   });
// };

// // export const updateCourseService = async (
// //   courseId: string,
// //   instructorId: string,
// //   data: UpdateCourseType
// // ) => {
// //   return await prisma.$transaction(async (tx) => {
// //     // 1️⃣ Check if course exists and belongs to this instructor
// //     const existingCourse = await tx.course.findFirst({
// //       where: { id: courseId, instructorId },
// //     });

// //     if (!existingCourse) {
// //       throw new NotFoundException("Course not found or not owned by you");
// //     }

// //     // 2️⃣ Optional: Validate category (if user is updating it)
// //     let categoryConnect = undefined;
// //     if (data.category) {
// //       const category = await tx.category.findFirst({
// //         where: {
// //           OR: [{ id: data.category }, { name: data.category }],
// //         },
// //       });

// //       if (!category) {
// //         throw new NotFoundException("Category not found");
// //       }

// //       categoryConnect = { connect: { id: category.id } };
// //     }

// //     // 3️⃣ Optional: Regenerate slug if title changes (or use provided slug)
// //     let slug = existingCourse.slug;
// //     if (data.slug) {
// //       slug = data.slug;
// //     } else if (data.title) {
// //       slug = slugify(data.title, { lower: true, strict: true });
// //     }

// //     // 4️⃣ Perform update
// //     const updatedCourse = await tx.course.update({
// //       where: { id: courseId },
// //       data: {
// //         title: data.title ?? existingCourse.title,
// //         slug,
// //         description: data.description ?? existingCourse.description,
// //         thumbnail: data.thumbnail ?? existingCourse.thumbnail,
// //         level: (data.level as CourseLevel) ?? existingCourse.level,
// //         totalDuration: data.totalDuration ?? existingCourse.totalDuration,
// //         price: data.price ?? existingCourse.price,
// //         ...(categoryConnect && { category: categoryConnect }),
// //       },
// //       include: {
// //         category: true,
// //         instructor: true,
// //       },
// //     });

// //     return updatedCourse;
// //   });
// // };

// export const getAllCoursesService = async () => {
//   return prisma.course.findMany({
//     include: {
//       category: true,
//       instructor: {
//         include: {
//           user: { select: { id: true, name: true, email: true } },
//         },
//       },
//       _count: {
//         select: {
//           reviews: true,
//           enrollments: true,
//         },
//       },
//     },
//   });
// };

// // export const getAllCoursesService = async () => {
// //   const coursesRaw = await prisma.course.findMany({
// //     include: {
// //       category: true,
// //       instructor: {
// //         include: {
// //           user: { select: { id: true, name: true, email: true } },
// //         },
// //       },
// //     },
// //   });

// //   return { courses: coursesRaw };

// export const getCourseByIdService = async (slug: string) => {
//   const course = await prisma.course.findUnique({
//     where: { slug },
//     include: {
//       instructor: {
//         include: {
//           user: { select: { id: true, name: true, email: true } },
//         },
//       },
//       category: true,
//       _count: { select: { reviews: true, enrollments: true, sections: true } },
//     },
//   });

//   if (!course) throw new NotFoundException("Course not found");
//   return course;
// };

// export const deleteCourseService = async (
//   courseId: string,
//   instructorId: string
// ) => {
//   try {
//     return await prisma.$transaction(async (tx) => {
//       const course = await tx.course.findUnique({ where: { id: courseId } });

//       if (!course) throw new NotFoundException("Course not found");
//       if (course.instructorId !== instructorId)
//         throw new BadRequestException(
//           "You are not allowed to delete this course"
//         );

//       await tx.course.delete({ where: { id: courseId } });

//       return { message: "Course deleted successfully" };
//     });
//   } catch (error) {
//     console.error("Delete course transaction failed:", error);
//     throw new InternalServerException("Error deleting course");
//   }
// };

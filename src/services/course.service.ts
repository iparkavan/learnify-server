import { CourseLevel, PrismaClient } from "@prisma/client";
import {
  BadRequestException,
  InternalServerException,
  NotFoundException,
} from "../utils/app-error";
import {
  CreateCourseType,
  UpdateCourseType,
} from "../validations/course.validation";
import slugify from "slugify";

const prisma = new PrismaClient();

export const createCourseService = async (
  data: CreateCourseType,
  instructorId: string
) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: instructorId }, // ✅ correct key
    });

    if (!user) throw new NotFoundException("User not found");

    // 2️⃣ Validate InstructorProfile if user is instructor
    let instructorProfileId: string | undefined = undefined;
    // if (user.role === "INSTRUCTOR") {
    const instructorProfile = await tx.instructorProfile.findUnique({
      where: { userId: instructorId }, // ✅ correct key
    });

    console.log("instructorProfile", instructorProfile);

    if (!instructorProfile) {
      throw new NotFoundException("Instructor profile not found");
    }

    // instructorProfileId = instructorProfile.id;
    // }

    // 3️⃣ Check duplicate course title for this instructor/admin
    const existingCourse = await tx.course.findFirst({
      where: {
        title: data.title,
        instructorId: instructorProfileId || undefined, // undefined if admin
      },
    });

    if (existingCourse) {
      throw new BadRequestException(
        "You already have a course with this title"
      );
    }

    // 4️⃣ Validate category
    const category = await tx.category.findFirst({
      where: {
        OR: [{ id: data.category }, { name: data.category }],
      },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    // 5️⃣ Generate slug
    const slug =
      data.slug || slugify(data.title, { lower: true, strict: true });

    // 6️⃣ Create course
    const courseData: any = {
      title: data.title,
      slug,
      description: data.description,
      thumbnail: data.thumbnail,
      level: data.level as CourseLevel,
      totalDuration: data.totalDuration,
      price: data.price ?? 0,
      instructor: { connect: { id: instructorProfile.id } },
      category: { connect: { id: category.id } },
    };

    const newCourse = await tx.course.create({
      data: courseData,
      include: {
        category: true,
        instructor: true, // will include profile if exists
      },
    });

    return newCourse;
  });
};

export const updateCourseService = async (
  courseId: string,
  userId: string, // could be instructor or admin
  data: UpdateCourseType
) => {
  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Find the user
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    // 2️⃣ Get instructor profile if user is INSTRUCTOR
    const instructorProfile = await tx.instructorProfile.findUnique({
      where: { userId },
    });

    console.log("instructorProfile", instructorProfile);

    if (!instructorProfile) {
      throw new NotFoundException("Instructor profile not found");
    }

    // 3️⃣ Check if course exists
    const existingCourse = await tx.course.findUnique({
      where: { id: courseId },
      include: { instructor: true },
    });
    if (!existingCourse) throw new NotFoundException("Course not found");

    // 4️⃣ Optional: Validate category if provided
    let categoryConnect = undefined;
    if (data.category) {
      const category = await tx.category.findFirst({
        where: { OR: [{ id: data.category }, { name: data.category }] },
      });
      if (!category) throw new NotFoundException("Category not found");
      categoryConnect = { connect: { id: category.id } };
    }

    // 5️⃣ Optional: Regenerate slug
    const slug =
      data.slug ??
      (data.title
        ? slugify(data.title, { lower: true, strict: true })
        : existingCourse.slug);

    // 6️⃣ Update the course
    const courseData: any = {
      title: data.title ?? existingCourse.title,
      slug,
      description: data.description ?? existingCourse.description,
      thumbnail: data.thumbnail ?? existingCourse.thumbnail,
      level: (data.level as CourseLevel) ?? existingCourse.level,
      totalDuration: data.totalDuration ?? existingCourse.totalDuration,
      price: data.price ?? existingCourse.price,
      instructor: { connect: { id: instructorProfile.id } }, // ✅ same logic as create
      ...(categoryConnect && { category: categoryConnect }),
    };

    const updatedCourse = await tx.course.update({
      where: { id: courseId },
      data: courseData,
      include: {
        category: true,
        instructor: true,
      },
    });

    return updatedCourse;
  });
};

// export const updateCourseService = async (
//   courseId: string,
//   instructorId: string,
//   data: UpdateCourseType
// ) => {
//   return await prisma.$transaction(async (tx) => {
//     // 1️⃣ Check if course exists and belongs to this instructor
//     const existingCourse = await tx.course.findFirst({
//       where: { id: courseId, instructorId },
//     });

//     if (!existingCourse) {
//       throw new NotFoundException("Course not found or not owned by you");
//     }

//     // 2️⃣ Optional: Validate category (if user is updating it)
//     let categoryConnect = undefined;
//     if (data.category) {
//       const category = await tx.category.findFirst({
//         where: {
//           OR: [{ id: data.category }, { name: data.category }],
//         },
//       });

//       if (!category) {
//         throw new NotFoundException("Category not found");
//       }

//       categoryConnect = { connect: { id: category.id } };
//     }

//     // 3️⃣ Optional: Regenerate slug if title changes (or use provided slug)
//     let slug = existingCourse.slug;
//     if (data.slug) {
//       slug = data.slug;
//     } else if (data.title) {
//       slug = slugify(data.title, { lower: true, strict: true });
//     }

//     // 4️⃣ Perform update
//     const updatedCourse = await tx.course.update({
//       where: { id: courseId },
//       data: {
//         title: data.title ?? existingCourse.title,
//         slug,
//         description: data.description ?? existingCourse.description,
//         thumbnail: data.thumbnail ?? existingCourse.thumbnail,
//         level: (data.level as CourseLevel) ?? existingCourse.level,
//         totalDuration: data.totalDuration ?? existingCourse.totalDuration,
//         price: data.price ?? existingCourse.price,
//         ...(categoryConnect && { category: categoryConnect }),
//       },
//       include: {
//         category: true,
//         instructor: true,
//       },
//     });

//     return updatedCourse;
//   });
// };

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

// export const getAllCoursesService = async () => {
//   const coursesRaw = await prisma.course.findMany({
//     include: {
//       category: true,
//       instructor: {
//         include: {
//           user: { select: { id: true, name: true, email: true } },
//         },
//       },
//     },
//   });

//   return { courses: coursesRaw };

export const getCourseByIdService = async (slug: string) => {
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
      category: true,
      _count: { select: { reviews: true, enrollments: true, sections: true } },
    },
  });

  if (!course) throw new NotFoundException("Course not found");
  return course;
};

export const deleteCourseService = async (
  courseId: string,
  instructorId: string
) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const course = await tx.course.findUnique({ where: { id: courseId } });

      if (!course) throw new NotFoundException("Course not found");
      if (course.instructorId !== instructorId)
        throw new BadRequestException(
          "You are not allowed to delete this course"
        );

      await tx.course.delete({ where: { id: courseId } });

      return { message: "Course deleted successfully" };
    });
  } catch (error) {
    console.error("Delete course transaction failed:", error);
    throw new InternalServerException("Error deleting course");
  }
};

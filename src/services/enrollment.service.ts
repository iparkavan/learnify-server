import { prisma } from "../config/prisma.config";

export const getEnrollmentStatusService = async (
  userId: string,
  courseId: string
) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  return { enrollment };
};

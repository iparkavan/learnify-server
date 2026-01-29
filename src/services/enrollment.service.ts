// import { prisma } from "../config/prisma.config";

import { prisma } from "../lib/schema";

export const getEnrollmentStatusService = async (
  userId: string,
  courseId: string,
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

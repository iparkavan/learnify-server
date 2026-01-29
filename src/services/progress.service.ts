// import { prisma } from "../config/prisma.config";

import { prisma } from "../lib/schema";

export const markLectureComplete = async (
  userId: string,
  lectureId: string,
) => {
  return prisma.courseProgress.upsert({
    where: { lectureId: { userId, lectureId } },
    update: { completed: true, watchedAt: new Date() },
    create: { userId, lectureId, completed: true },
  });
};

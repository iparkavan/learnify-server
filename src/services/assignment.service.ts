import { prisma } from "../config/prisma.config";

export const createAssignment = (lectureId: string, data: any) => {
  return prisma.assignment.create({
    data: {
      lectureId,
      instructions: data.instructions,
      estimatedTime: Number(data.estimatedTime),
    },
  });
};

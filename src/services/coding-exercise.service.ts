import { prisma } from "../config/prisma.config";

export const createCodingExercise = async (lectureId: string, data: any) => {
  return prisma.codingExercise.create({
    data: {
      lectureId,
      problem: data.problem,
      starterCode: data.starterCode,
      solutionCode: data.solutionCode,
      testCases: data.testCases,
    },
  });
};

import { prisma } from "../lib/schema";

export const instructorCreateSectionService = async (courseId: string) => {
  const lastSection = await prisma.section.findFirst({
    where: {
      courseId,
    },
    orderBy: {
      order: "desc",
    },
  });

  const nextOrder = lastSection ? lastSection.order + 1 : 1;

  return await prisma.section.create({
    data: {
      title: `Untitled Section ${nextOrder}`,
      courseId,
      order: nextOrder,
    },
  });
};

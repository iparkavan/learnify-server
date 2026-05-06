import { Section } from "../generated/prisma/browser";
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

export const instructorDeleteSectionService = async (sectionId: string) => {
  return await prisma.section.delete({
    where: {
      id: sectionId,
    },
  });
};

export const instructorUpdateSectionService = async (
  sectionId: string,
  sectionData: Partial<Section>,
) => {
  return await prisma.section.update({
    where: {
      id: sectionId,
    },
    data: sectionData,
  });
};

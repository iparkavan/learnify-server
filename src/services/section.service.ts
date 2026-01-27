// src/modules/section/section.service.ts

import { Section } from "@prisma/client";
import { prisma } from "../config/prisma.config";

export const createSection = (courseId: string, data: any) => {
  return prisma.section.create({
    data: {
      title: data.title,
      courseId,
      order: data.order ?? 1,
    },
  });
};

export const updateSection = (id: string, data: any) => {
  return prisma.section.update({
    where: { id },
    data,
  });
};

export const deleteSection = (id: string) => {
  return prisma.section.delete({ where: { id } });
};

export const reorderSections = async (sections: { id: any; order: any }[]) => {
  return prisma.$transaction(
    sections.map((s: { id: any; order: any }) =>
      prisma.section.update({
        where: { id: s.id },
        data: { order: s.order },
      }),
    ),
  );
};

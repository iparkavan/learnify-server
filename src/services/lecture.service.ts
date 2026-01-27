// src/modules/lecture/lecture.service.ts

import { prisma } from "../config/prisma.config";

// export const createLecture = (sectionId: string, data: any) => {
//   return prisma.lecture.create({
//     data: {
//       title: data.title,
//       type: data.type,
//       // videoUrl: data.videoUrl,
//       duration: data.duration,
//       order: data.order ?? 1,
//       sectionId,
//     },
//   });
// };

export const updateLecture = (id: string, data: any) => {
  return prisma.lecture.update({
    where: { id },
    data,
  });
};

export const deleteLecture = (id: string) => {
  return prisma.lecture.delete({ where: { id } });
};

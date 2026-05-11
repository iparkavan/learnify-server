import { Lecture } from "../generated/prisma/client";
import { LectureType } from "../generated/prisma/enums";
import { prisma } from "../lib/schema";

export const instructorCreateLectureService = async ({
  sectionId,
  body,
}: {
  sectionId: string;
  body: { type: LectureType };
}) => {
  const { type } = body;

  const lastLecture = await prisma.lecture.findFirst({
    where: {
      sectionId,
    },
    orderBy: {
      order: "desc",
    },
  });

  const nextOrder = lastLecture ? lastLecture.order + 1 : 1;

  return await prisma.lecture.create({
    data: {
      title: `Untitled Lecture ${nextOrder}`,
      sectionId,
      order: nextOrder,
      type,
    },
  });
};

export const instructorUpdateLectureService = async ({
  lectureId,
  body,
}: {
  lectureId: string;
  body: any;
}) => {
  const data: any = {};

  // lecture fields
  if (body.title !== undefined) {
    data.title = body.title;
  }

  if (body.type !== undefined) {
    data.type = body.type;
  }

  if (body.order !== undefined) {
    data.order = body.order;
  }

  // video update
  if (body.content?.video) {
    data.video = {
      upsert: {
        create: {
          originalUrl: body.content.video.url,
          duration: body.content.video.duration || 0,
        },
        update: {
          originalUrl: body.content.video.url,
          duration: body.content.video.duration || 0,
        },
      },
    };
  }

  return await prisma.lecture.update({
    where: {
      id: lectureId,
    },
    data,
    include: {
      video: true,
      quiz: true,
      resources: true,
    },
  });
};

export const instructorDeleteLectureService = async ({
  lectureId,
}: {
  lectureId: string;
}) => {
  return await prisma.lecture.delete({
    where: {
      id: lectureId,
    },
  });
};

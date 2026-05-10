import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  instructorCreateLectureService,
  instructorUpdateLectureService,
} from "../services/instructor-lecture.service";

export const instructorCreateLectureController = asyncHandler(
  async (req, res, next) => {
    const { sectionId } = req.params;

    const body = req.body;

    if (Array.isArray(sectionId)) {
      throw new Error("Invalid sectionId");
    }

    const lecture = await instructorCreateLectureService({ sectionId, body });

    res
      .status(HTTPSTATUS.CREATED)
      .json({ message: "Lecture created successfully", lecture });
  },
);

export const instructorUpdateLectureController = asyncHandler(
  async (req, res, next) => {
    const { lectureId } = req.params;
    const body = req.body;

    if (Array.isArray(lectureId)) {
      throw new Error("Invalid lectureId");
    }

    const lecture = await instructorUpdateLectureService({ lectureId, body });

    res
      .status(HTTPSTATUS.OK)
      .json({ message: "Lecture updated successfully", lecture });
  },
);

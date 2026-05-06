import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  instructorCreateSectionService,
  instructorDeleteSectionService,
  instructorUpdateSectionService,
} from "../services/instructor-section.service";

export const instructorCreateSectionController = asyncHandler(
  async (req, res, next) => {
    const { courseId } = req.params;

    if (Array.isArray(courseId)) {
      throw new Error("Invalid courseId");
    }

    const section = await instructorCreateSectionService(courseId);

    res
      .status(HTTPSTATUS.CREATED)
      .json({ message: "Section created successfully", section });
  },
);

export const instructorDeleteSectionController = asyncHandler(
  async (req, res, next) => {
    const { sectionId } = req.params;

    if (Array.isArray(sectionId)) {
      throw new Error("Invalid sectionId");
    }

    const section = await instructorDeleteSectionService(sectionId);

    res
      .status(HTTPSTATUS.CREATED)
      .json({ message: "Section deleted successfully", section });
  },
);

export const instructorUpdateSectionController = asyncHandler(
  async (req, res, next) => {
    const { sectionId } = req.params;
    const sectionData = req.body;

    if (Array.isArray(sectionId)) {
      throw new Error("Invalid sectionId");
    }

    const section = await instructorUpdateSectionService(
      sectionId,
      sectionData,
    );

    res
      .status(HTTPSTATUS.CREATED)
      .json({ message: "Section updated successfully", section });
  },
);

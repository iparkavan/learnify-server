import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { instructorCreateSectionService } from "../services/instructor-section.service";

export const instructorCreateSectionController = asyncHandler(
  async (req, res, next) => {
    const { courseId } = req.params;
    const { title } = req.body;
    console.log("section routes", courseId, title);
    if (Array.isArray(courseId)) {
      throw new Error("Invalid courseId");
    }

    await instructorCreateSectionService(courseId, title);
  },
);

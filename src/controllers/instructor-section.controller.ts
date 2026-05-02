import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { instructorCreateSectionService } from "../services/instructor-section.service";

export const instructorCreateSectionController = asyncHandler(
  async (req, res, next) => {
    const { courseId } = req.params;
    // const { title } = req.body

    console.log("section routes", courseId);

    if (Array.isArray(courseId)) {
      throw new Error("Invalid courseId");
    }

    const section = await instructorCreateSectionService(courseId);

    res
      .status(HTTPSTATUS.CREATED)
      .json({ message: "Section created successfully", section });
  },
);

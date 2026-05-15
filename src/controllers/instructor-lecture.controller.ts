import cloudinary from "../config/cloudinary.config";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  instructorCreateLectureService,
  instructorDeleteLectureService,
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

export const instructorDeleteLectureController = asyncHandler(
  async (req, res, next) => {
    const { lectureId } = req.params;

    if (Array.isArray(lectureId)) {
      throw new Error("Invalid lectureId");
    }

    await instructorDeleteLectureService({ lectureId });

    res
      .status(HTTPSTATUS.CREATED)
      .json({ message: "Lecture deleted successfully" });
  },
);

export const deleteVideoFromCloudinaryController = asyncHandler(
  async (req, res) => {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        success: false,
        message: "publicId is required",
      });
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });

    console.log("Cloudinary delete result:", result);

    // Cloudinary can return:
    // "ok"
    // "not found"

    if (result.result !== "ok" && result.result !== "not found") {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        success: false,
        message: "Failed to delete video",
        result,
      });
    }

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Video deleted successfully",
    });
  },
);

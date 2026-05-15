import cloudinary from "../config/cloudinary.config";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  createCourseService,
  deleteCourseByIdService,
  getCourseByIdService,
  updateCourseService,
} from "../services/instructor-course.service";
import { NotFoundException } from "../utils/app-error";
import { UpdateCourseType } from "../validations/course.validation";

// INSTRUCTOR CONTROLLERS
export const createCourseController = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const userId = req.user?.id;
  const { course } = await createCourseService(title, userId!);

  res
    .status(HTTPSTATUS.CREATED)
    .json({ message: "Course created successfully", course });
});

export const updateCourseController = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const userId = req.user?.id;
  const body = req.body as UpdateCourseType;

  const courseIdValue = Array.isArray(courseId) ? courseId[0] : courseId;

  if (!courseIdValue) {
    throw new NotFoundException("Course Id not found");
  }

  const { course } = await updateCourseService(courseIdValue, userId!, body);

  return res
    .status(HTTPSTATUS.OK)
    .json({ message: "Course updated successfully", course });
});

export const getCourseByIdController = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;

  const courseIdValue = Array.isArray(courseId) ? courseId[0] : courseId;

  if (!courseIdValue) {
    throw new NotFoundException("Course Id not found");
  }

  const { course } = await getCourseByIdService(courseIdValue);

  return res
    .status(HTTPSTATUS.OK)
    .json({ message: "Course fetched successfully", course });
});

export const deleteCourseByIdController = asyncHandler(
  async (req, res, next) => {
    const { courseId } = req.params;

    const courseIdValue = Array.isArray(courseId) ? courseId[0] : courseId;

    if (!courseIdValue) {
      throw new NotFoundException("Course Id not found");
    }

    await deleteCourseByIdService(courseIdValue);

    return res
      .status(HTTPSTATUS.OK)
      .json({ success: true, message: "Course deleted successfully" });
  },
);

export const deleteCloudinaryImageController = asyncHandler(
  async (req, res) => {
    const { publicId } = req.body;

    if (!publicId) {
      throw new Error("Public ID required");
    }

    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({
      success: true,
    });
  },
);

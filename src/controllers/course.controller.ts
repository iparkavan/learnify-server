import { Request, Response } from "express";
import {
  createCourseService,
  getAllCoursesService,
  getCourseByIdService,
  deleteCourseService,
  updateCourseService,
} from "../services/course.service";
import {
  createCourseSchema,
  updateCourseSchema,
} from "../validations/course.validation";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";

// 🧩 Create Course
export const createCourseController = asyncHandler(async (req, res) => {
  const instructorId = req.user?.id;

  // Validate request body
  const data = createCourseSchema.parse(req.body);

  const newCourse = await createCourseService(data, instructorId!);

  res.status(201).json({
    message: "Course created successfully",
    course: newCourse,
  });
});

export const updateCourseController = asyncHandler(async (req, res) => {
  const instructorId = req.user?.id;
  const { id } = req.params;
  const data = updateCourseSchema.parse(req.body);

  const updatedCourse = await updateCourseService(id, instructorId!, data);

  res.json({
    message: "Course updated successfully",
    course: updatedCourse,
  });
});

// 📚 Get All Courses
export const getAllCoursesController = asyncHandler(async (req, res) => {
  const courses = await getAllCoursesService();
  res.status(HTTPSTATUS.OK).json(courses);
});

// 🔍 Get Course by ID
export const getCourseByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;
    const course = await getCourseByIdService(slug);
    res.json(course);
  }
);

// 🗑️ Delete Course
export const deleteCourseController = asyncHandler(
  async (req: Request, res: Response) => {
    const instructorId = req.user?.id;
    const { id } = req.params;
    const result = await deleteCourseService(id, instructorId!);
    res.json(result);
  }
);

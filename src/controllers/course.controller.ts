// src/modules/course/course.controller.ts
import { Request, Response } from "express";
import * as service from "../services/course.service";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { FullCourseData } from "../validations/course.validation";

// 📚 Get All Courses
export const getAllCoursesController = asyncHandler(async (req, res) => {
  // const query = req.params

  const courses = await service.getAllCoursesService();
  res.status(HTTPSTATUS.OK).json(courses);
});

export const saveCourseController = asyncHandler(async (req, res) => {
  const instructorId = req.user?.id; // from auth middleware
  const courseData = req.body.courseData;

  console.log("instructorId", instructorId);
  console.log("courseData", courseData);
  // const courseImageUrl = req.body.courseImageUrl;
  // const promoVideoUrl = req.body.promoVideoUrl;
  const data = req.body as FullCourseData;

  const courseId = await service.saveCompleteCourseService(data, instructorId!);

  res.status(HTTPSTATUS.CREATED).json({ success: true, courseId });
});

export const createCourseController = async (req: Request, res: Response) => {
  const instructorId = req.user?.id;
  const course = await service.createCourse(req.body, instructorId!);
  res.json(course);
};

export const getCourseController = async (req: Request, res: Response) => {
  const { slug } = req.params;

  console.log(slug);

  const slugValue = Array.isArray(slug) ? slug[0] : slug;

  const course = await service.getCourse(slugValue);
  res.json(course);
};

// export const updateCourse = async (req: Request, res: Response) => {
//   const course = await service.updateCourse(req.params.id, req.body);
//   res.json(course);
// };

// export const publishCourse = async (req: Request, res: Response) => {
//   const course = await service.publishCourse(req.params.id);
//   res.json(course);
// };

// export const deleteCourse = async (req: Request, res: Response) => {
//   await service.deleteCourse(req.params.id);
//   res.json({ message: "Course deleted" });
// };

export const getInstructorOnlyCoursesController = asyncHandler(
  async (req, res, next) => {
    const instructorId = req.user?.id;

    const instructorCourse = await service.getInstructorOnlyCourses(
      instructorId!,
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Instructor courses fetched successfully",
      instructorCourse,
    });
  },
);

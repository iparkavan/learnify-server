// src/modules/course/course.controller.ts
import { Request, Response } from "express";
import * as service from "../services/course.service";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { FullCourseData } from "../validations/course.validation";

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

export const createCourse = async (req: Request, res: Response) => {
  const instructorId = req.user?.id;
  const course = await service.createCourse(req.body, instructorId!);
  res.json(course);
};

export const getCourse = async (req: Request, res: Response) => {
  const course = await service.getCourse(req.params.id);
  res.json(course);
};

export const updateCourse = async (req: Request, res: Response) => {
  const course = await service.updateCourse(req.params.id, req.body);
  res.json(course);
};

export const publishCourse = async (req: Request, res: Response) => {
  const course = await service.publishCourse(req.params.id);
  res.json(course);
};

export const deleteCourse = async (req: Request, res: Response) => {
  await service.deleteCourse(req.params.id);
  res.json({ message: "Course deleted" });
};

// import { Request, Response } from "express";
// import {
//   createCourseService,
//   getAllCoursesService,
//   getCourseByIdService,
//   deleteCourseService,
//   updateCourseService,
// } from "../services/course.service";
// import {
//   createCourseSchema,
//   updateCourseSchema,
// } from "../validations/course.validation";
// import { asyncHandler } from "../middlewares/asyncHandler.middleware";
// import { HTTPSTATUS } from "../config/http.config";

// // 🧩 Create Course
// export const createCourseController = asyncHandler(async (req, res) => {
//   const instructorId = req.user?.id;

//   // Validate request body
//   const data = createCourseSchema.parse(req.body);

//   const newCourse = await createCourseService(data, instructorId!);

//   res.status(201).json({
//     message: "Course created successfully",
//     course: newCourse,
//   });
// });

// export const updateCourseController = asyncHandler(async (req, res) => {
//   const instructorId = req.user?.id;
//   const { id } = req.params;
//   const data = updateCourseSchema.parse(req.body);

//   const updatedCourse = await updateCourseService(id, instructorId!, data);

//   res.json({
//     message: "Course updated successfully",
//     course: updatedCourse,
//   });
// });

// // 📚 Get All Courses
// export const getAllCoursesController = asyncHandler(async (req, res) => {
//   const courses = await getAllCoursesService();
//   res.status(HTTPSTATUS.OK).json(courses);
// });

// // 🔍 Get Course by ID
// export const getCourseByIdController = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { slug } = req.params;
//     const course = await getCourseByIdService(slug);
//     res.json(course);
//   }
// );

// // 🗑️ Delete Course
// export const deleteCourseController = asyncHandler(
//   async (req: Request, res: Response) => {
//     const instructorId = req.user?.id;
//     const { id } = req.params;
//     const result = await deleteCourseService(id, instructorId!);
//     res.json(result);
//   }
// );

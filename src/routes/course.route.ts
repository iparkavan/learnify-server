import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import { requirePermission } from "../middlewares/requirePermission.middleware";
import { validateSchema } from "../utils/validateSchema";
import { CourseSchema } from "../validations/course.validation";
import { PermissionType } from "../generated/prisma/enums";
import {
  getAllCoursesController,
  getCourseController,
  getInstructorOnlyCoursesController,
  saveCourseController,
} from "../controllers/course.controller";

const courseRoutes = Router();

courseRoutes.post(
  "/save-full-course",
  isAuthenticated,
  requirePermission(PermissionType.CREATE_COURSE),
  validateSchema(CourseSchema),
  saveCourseController,
);

courseRoutes.get(
  "/",
  // isAuthenticated,
  // controller.createCourse,
  getAllCoursesController,
);

courseRoutes.get("/get-instructor-courses", getInstructorOnlyCoursesController);

courseRoutes.get("/:slug", getCourseController);

// courseRoutes.get(
//   "/:courseId",
//   isAuthenticated,
//   requirePermission(PermissionType.UPDATE_COURSE),
//   getCourseByIdController,
// );

// courseRoutes.put(
//   "/:id",
//   isAuthenticated,
//   requirePermission(PermissionType.UPDATE_COURSE),
//   controller.updateCourse,
// );
// courseRoutes.patch(
//   "/:id/publish",
//   isAuthenticated,
//   requirePermission(PermissionType.UPDATE_COURSE),
//   controller.publishCourse,
// );
// courseRoutes.delete(
//   "/:id",
//   isAuthenticated,
//   requirePermission(PermissionType.DELETE_COURSE),
//   controller.deleteCourse,
// );

// INSTRUCTOR COURSE ROUTES

export default courseRoutes;

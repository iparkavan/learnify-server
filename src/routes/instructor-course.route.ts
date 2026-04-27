import { Router } from "express";
import { requirePermission } from "../middlewares/requirePermission.middleware";
import { PermissionType } from "../generated/prisma/enums";
import {
  createCourseController,
  getCourseByIdController,
  updateCourseController,
} from "../controllers/instructor-course.controller";

const instructorCourseRoutes = Router();

instructorCourseRoutes.post(
  "/courses/create-course",
  requirePermission(PermissionType.CREATE_COURSE),
  createCourseController,
);

instructorCourseRoutes.put(
  `/courses/update-course/:courseId`,
  requirePermission(PermissionType.UPDATE_COURSE),
  updateCourseController,
);

instructorCourseRoutes.get(
  "/courses/:courseId",
  requirePermission(PermissionType.UPDATE_COURSE),
  getCourseByIdController,
);

export default instructorCourseRoutes;

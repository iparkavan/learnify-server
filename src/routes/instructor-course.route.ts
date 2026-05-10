import { Router } from "express";
import { requirePermission } from "../middlewares/requirePermission.middleware";
import { PermissionType } from "../generated/prisma/enums";
import {
  createCourseController,
  getCourseByIdController,
  updateCourseController,
} from "../controllers/instructor-course.controller";
import {
  instructorCreateSectionController,
  instructorDeleteSectionController,
  instructorUpdateSectionController,
} from "../controllers/instructor-section.controller";
import {
  instructorCreateLectureController,
  instructorUpdateLectureController,
} from "../controllers/instructor-lecture.controller";

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

// INSTRUCTOR SECTION ROUTES

instructorCourseRoutes.post(
  `/sections/:courseId/create-section`,
  requirePermission(PermissionType.CREATE_COURSE),
  instructorCreateSectionController,
);

instructorCourseRoutes.delete(
  `/sections/:sectionId`,
  requirePermission(PermissionType.DELETE_COURSE),
  instructorDeleteSectionController,
);

instructorCourseRoutes.patch(
  `/sections/:sectionId`,
  requirePermission(PermissionType.UPDATE_COURSE),
  instructorUpdateSectionController,
);

// INSTRUCTOR LECTURE ROUTES
instructorCourseRoutes.post(
  `/lectures/:sectionId/create-lecture`,
  requirePermission(PermissionType.CREATE_COURSE),
  instructorCreateLectureController,
);

instructorCourseRoutes.patch(
  `/lectures/:lectureId`,
  requirePermission(PermissionType.UPDATE_COURSE),
  instructorUpdateLectureController,
);

export default instructorCourseRoutes;

import { Router } from "express";
import { requirePermission } from "../middlewares/requirePermission.middleware";
import { PermissionType } from "../generated/prisma/enums";
import {
  createCourseController,
  deleteCloudinaryImageController,
  deleteCourseByIdController,
  getCourseByIdController,
  updateCourseController,
} from "../controllers/instructor-course.controller";
import {
  instructorCreateSectionController,
  instructorDeleteSectionController,
  instructorUpdateSectionController,
} from "../controllers/instructor-section.controller";
import {
  deleteVideoFromCloudinaryController,
  instructorCreateLectureController,
  instructorDeleteLectureController,
  instructorUpdateLectureController,
} from "../controllers/instructor-lecture.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";

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

instructorCourseRoutes.delete(
  `/courses/:courseId`,
  requirePermission(PermissionType.DELETE_COURSE),
  deleteCourseByIdController,
);

instructorCourseRoutes.delete(
  `/cloudinary/thumbnail/delete-image`,
  deleteCloudinaryImageController,
);

// INSTRUCTOR SECTION ROUTES

instructorCourseRoutes.post(
  `/sections/:courseId/create-section`,
  requirePermission(PermissionType.CREATE_COURSE),
  instructorCreateSectionController,
);

instructorCourseRoutes.patch(
  `/sections/:sectionId`,
  requirePermission(PermissionType.UPDATE_COURSE),
  instructorUpdateSectionController,
);

instructorCourseRoutes.delete(
  `/sections/:sectionId`,
  requirePermission(PermissionType.DELETE_COURSE),
  instructorDeleteSectionController,
);

// INSTRUCTOR LECTURE ROUTES

instructorCourseRoutes.delete(
  "/lectures/delete-video",
  deleteVideoFromCloudinaryController,
);

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

instructorCourseRoutes.delete(
  `/lectures/:lectureId`,
  requirePermission(PermissionType.DELETE_COURSE),
  instructorDeleteLectureController,
);

export default instructorCourseRoutes;

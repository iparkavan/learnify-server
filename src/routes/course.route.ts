import { Router } from "express";
import * as controller from "../controllers/course.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import { requirePermission } from "../middlewares/requirePermission.middleware";
import { PermissionType } from "@prisma/client";

const courseRoutes = Router();

courseRoutes.post(
  "/save-full-course",
  isAuthenticated,
  requirePermission(PermissionType.CREATE_COURSE),
  controller.saveCourseController,
);

courseRoutes.post(
  "/create-course",
  isAuthenticated,
  requirePermission(PermissionType.CREATE_COURSE),
  controller.createCourse,
);
courseRoutes.get("/:id", controller.getCourse);
courseRoutes.put(
  "/:id",
  isAuthenticated,
  requirePermission(PermissionType.UPDATE_COURSE),
  controller.updateCourse,
);
courseRoutes.patch(
  "/:id/publish",
  isAuthenticated,
  requirePermission(PermissionType.UPDATE_COURSE),
  controller.publishCourse,
);
courseRoutes.delete(
  "/:id",
  isAuthenticated,
  requirePermission(PermissionType.DELETE_COURSE),
  controller.deleteCourse,
);

export default courseRoutes;

// import { Router } from "express";
// import {
//   createCourseController,
//   getAllCoursesController,
//   getCourseByIdController,
//   deleteCourseController,
//   updateCourseController,
// } from "../controllers/course.controller";
// import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
// import { requirePermission } from "../middlewares/requirePermission.middleware";
// import { PermissionType } from "@prisma/client";

// const courseRoutes = Router();

// courseRoutes.post(
//   "/create",
//   isAuthenticated,
//   requirePermission(PermissionType.CREATE_COURSE),
//   createCourseController
// );

// courseRoutes.put(
//   "/:id",
//   isAuthenticated,
//   //   validateSchema(updateCourseSchema),
//   requirePermission(PermissionType.UPDATE_COURSE),
//   updateCourseController
// );

// courseRoutes.get("/", getAllCoursesController);
// courseRoutes.get("/:slug", getCourseByIdController);
// courseRoutes.delete("/:id", isAuthenticated, deleteCourseController);

// export default courseRoutes;

// src/modules/course/course.routes.ts

import { Router } from "express";
import {
  createCourseController,
  getAllCoursesController,
  getCourseByIdController,
  deleteCourseController,
  updateCourseController,
} from "../controllers/course.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import { requirePermission } from "../middlewares/requirePermission.middleware";
import { PermissionType } from "@prisma/client";

const courseRoutes = Router();

courseRoutes.post(
  "/create",
  isAuthenticated,
  requirePermission(PermissionType.CREATE_COURSE),
  createCourseController
);

courseRoutes.put(
  "/:id",
  isAuthenticated,
  //   validateSchema(updateCourseSchema),
  requirePermission(PermissionType.UPDATE_COURSE),
  updateCourseController
);

courseRoutes.get("/", getAllCoursesController);
courseRoutes.get("/:slug", getCourseByIdController);
courseRoutes.delete("/:id", isAuthenticated, deleteCourseController);

export default courseRoutes;

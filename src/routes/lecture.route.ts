// src/modules/lecture/lecture.routes.ts
import { Router } from "express";
import * as controller from "../controllers/lecture.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import { deleteVideoFromCloudinary } from "../config/cloudinary.config";
import { deleteVideoFromCloudinaryController } from "../controllers/lecture.controller";

const lectureRoutes = Router();

// lectureRoutes.post("/:sectionId", isAuthenticated, controller.createLecture);
// lectureRoutes.put("/:id", isAuthenticated, controller.updateLecture);
// lectureRoutes.delete("/:id", isAuthenticated, controller.deleteLecture);

// Lecture Video Delete Route
lectureRoutes.delete(
  "/delete-video",
  isAuthenticated,
  deleteVideoFromCloudinaryController,
);

export default lectureRoutes;

// src/modules/lecture/lecture.routes.ts
import { Router } from "express";
import * as controller from "../controllers/lecture.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";

const lectureRoutes = Router();

lectureRoutes.post("/:sectionId", isAuthenticated, controller.createLecture);
lectureRoutes.put("/:id", isAuthenticated, controller.updateLecture);
lectureRoutes.delete("/:id", isAuthenticated, controller.deleteLecture);

export default lectureRoutes;

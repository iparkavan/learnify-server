// src/modules/section/section.routes.ts
import { Router } from "express";
import * as controller from "../controllers/section.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";

const sectionRoutes = Router();

sectionRoutes.post("/:courseId", isAuthenticated, controller.createSection);
sectionRoutes.put("/:id", isAuthenticated, controller.updateSection);
sectionRoutes.delete("/:id", isAuthenticated, controller.deleteSection);

export default sectionRoutes;

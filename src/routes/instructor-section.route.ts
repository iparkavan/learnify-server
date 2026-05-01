import { Router } from "express";
import { instructorCreateSectionController } from "../controllers/instructor-section.controller";
import { requirePermission } from "../middlewares/requirePermission.middleware";
import { PermissionType } from "../generated/prisma/enums";

const instructorSectionRoutes = Router();

instructorSectionRoutes.post(
  `/courses/:courseId/create-section`,
  requirePermission(PermissionType.CREATE_COURSE),
  instructorCreateSectionController,
);

export default instructorSectionRoutes;

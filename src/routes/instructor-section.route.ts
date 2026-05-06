import { Router } from "express";
import {
  instructorCreateSectionController,
  instructorDeleteSectionController,
  instructorUpdateSectionController,
} from "../controllers/instructor-section.controller";
import { requirePermission } from "../middlewares/requirePermission.middleware";
import { PermissionType } from "../generated/prisma/enums";

const instructorSectionRoutes = Router();

instructorSectionRoutes.post(
  `/sections/:courseId/create-section`,
  requirePermission(PermissionType.CREATE_COURSE),
  instructorCreateSectionController,
);

instructorSectionRoutes.delete(
  `/sections/:sectionId`,
  requirePermission(PermissionType.DELETE_COURSE),
  instructorDeleteSectionController,
);

instructorSectionRoutes.patch(
  `/sections/:sectionId`,
  requirePermission(PermissionType.UPDATE_COURSE),
  instructorUpdateSectionController,
);

export default instructorSectionRoutes;

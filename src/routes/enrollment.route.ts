import { Router } from "express";
import { getEnrollmentStatusController } from "../controllers/enrollment.controller";

const enrollmentRoutes = Router();

enrollmentRoutes.get(
  "/:courseId/enrollment-status",
  getEnrollmentStatusController
);

export default enrollmentRoutes;

import { Router } from "express";
import { studentProfileSetupController } from "../controllers/profile-setup.controller";

const profileSetupRoutes = Router();

profileSetupRoutes.post("/student", studentProfileSetupController);

export default profileSetupRoutes;

import express from "express";
import { getCloudinarySignature } from "../controllers/cloudinary.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";

const cloudinaryRoutes = express.Router();

// Protect this route if needed
cloudinaryRoutes.get("/signature", isAuthenticated, getCloudinarySignature);

export default cloudinaryRoutes;

import { Router } from "express";
import { contactUsController } from "../controllers/contact-us.controller";

const contactUsRoute = Router();

contactUsRoute.post("/", contactUsController);

export default contactUsRoute;

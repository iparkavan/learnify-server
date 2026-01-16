import express from "express";
import {
  createOrderController,
  razorpayWebhookController,
  verifyPaymentController,
} from "../controllers/order.controller";

const orderRoutes = express.Router();

orderRoutes.post("/create", createOrderController);
orderRoutes.post("/verify", verifyPaymentController);
orderRoutes.post(
  "/webhook",
  express.json({ type: "application/json" }),
  razorpayWebhookController
);

export default orderRoutes;

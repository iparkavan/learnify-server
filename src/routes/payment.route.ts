import express, { Router } from "express";
import {
  createRazorpayOrderController,
  razorpayWebhookController,
  verifyRazorpayPaymentController,
} from "../controllers/payment.controller";

const paymentRoutes = Router();

paymentRoutes.post("/initiate", createRazorpayOrderController);
paymentRoutes.post("/verify", verifyRazorpayPaymentController);
paymentRoutes.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhookController
);
// paymentRoutes.post("/refund", handleRefundController);

// // ADMIN PAYMENTS CONTROLLERS
// paymentRoutes.get("/admin/all", handleGetAllPaymentsController);

export default paymentRoutes;

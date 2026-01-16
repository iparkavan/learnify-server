import { Request, Response } from "express";

import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";

import {
  createPaymentService,
  handleRazorpayWebhookService,
  verifyRazorpayPaymentService,
} from "../services/payment.service";

// 1️⃣ Create Order
export const createRazorpayOrderController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { courseId, gateway } = req.body;

    const data = await createPaymentService(userId!, courseId, gateway);

    res.status(HTTPSTATUS.CREATED).json(data);
  }
);

// 2️⃣ Verify Payment
export const verifyRazorpayPaymentController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await verifyRazorpayPaymentService(req.body);
    res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Payment verified and enrollment completed",
      data,
    });
  }
);

export const razorpayWebhookController = asyncHandler(
  async (req: Request, res: Response) => {
    const signature = req.headers["x-razorpay-signature"] as string;
    const rawBody = req.body; // express.raw() required

    await handleRazorpayWebhookService(rawBody, signature);
    res.status(200).send("Webhook handled");
  }
);

// 3️⃣ Handle Razorpay Webhooks
// export const handleWebhookController = asyncHandler(
//   async (req: Request, res: Response) => {
//     const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
//     const signature = req.headers["x-razorpay-signature"] as string;

//     const body = req.body; // raw body buffer (express.raw)

//     const expectedSignature = crypto
//       .createHmac("sha256", webhookSecret)
//       .update(body)
//       .digest("hex");

//     // Validate signature
//     if (expectedSignature !== signature) {
//       return res.status(400).json({ message: "Invalid webhook signature" });
//     }

//     const event = JSON.parse(body.toString());

//     await handleWebhookEventService(event);

//     res.json({ status: "ok" });
//   }
// );

// export const handleRefundController = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { paymentId } = req.body;

//     const refund = await processRefundService(paymentId);

//     res.json({
//       success: true,
//       message: "Refund processed successfully",
//       refund,
//     });
//   }
// );

// ADMIN PAYMENTS CONTROLLERS

// export const handleGetAllPaymentsController = asyncHandler(
//   async (_req: Request, res: Response) => {
//     const payments = await listAllPaymentsAdminService();

//     res.json({
//       success: true,
//       payments,
//     });
//   }
// );

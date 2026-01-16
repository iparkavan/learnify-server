import { Request, Response } from "express";
import {
  createOrderService,
  verifyPaymentService,
  razorpayWebhookService,
} from "../services/order.service";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.body;
    const data = await createOrderService(userId, courseId);
    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const verifyPaymentController = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const order = await verifyPaymentService(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );
    res.json({ success: true, order });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ success: false, error: error.message });
  }
};

export const razorpayWebhookController = async (
  req: Request,
  res: Response
) => {
  try {
    const signature = req.headers["x-razorpay-signature"] as string;
    const result = await razorpayWebhookService(req.body, signature);
    res.json(result);
  } catch (error: any) {
    console.error(error);
    res.status(400).send("Invalid signature");
  }
};

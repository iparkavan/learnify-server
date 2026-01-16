import Razorpay from "razorpay";
import crypto from "crypto";
import { prisma } from "../config/prisma.config";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Create Razorpay order + save in DB
export const createOrderService = async (userId: string, courseId: string) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new Error("Course not found");

  const amountInPaise = Math.floor(course.price * 100);

  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  const order = await prisma.order.create({
    data: {
      userId,
      courseId,
      amount: course.price,
      currency: "INR",
      status: "PENDING",
      razorpayOrderId: razorpayOrder.id,
    },
  });

  return {
    orderId: razorpayOrder.id,
    amount: amountInPaise,
    currency: "INR",
  };
};

// Verify Razorpay payment + enroll user
export const verifyPaymentService = async (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
) => {
  // Validate signature
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature !== razorpay_signature) {
    throw new Error("Invalid signature");
  }

  // Update Order to SUCCESS
  const order = await prisma.order.update({
    where: { razorpayOrderId: razorpay_order_id },
    data: {
      status: "SUCCESS",
      paymentId: razorpay_payment_id,
    },
  });

  // Enroll user in course
  const enrollmentExists = await prisma.enrollment.findFirst({
    where: { userId: order.userId, courseId: order.courseId },
  });

  if (!enrollmentExists) {
    await prisma.enrollment.create({
      data: { userId: order.userId, courseId: order.courseId },
    });
  }

  return order;
};

// Handle Razorpay Webhook
export const razorpayWebhookService = async (
  payload: any,
  signature: string
) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");

  if (signature !== expectedSignature) {
    throw new Error("Invalid webhook signature");
  }

  // Log webhook
  await prisma.webhookLog.create({
    data: {
      eventId: payload.event_id,
      payload,
    },
  });

  // Handle payment.captured
  if (payload.event === "payment.captured") {
    const razorpayOrderId = payload.payload.payment.entity.order_id;
    const paymentId = payload.payload.payment.entity.id;

    const order = await prisma.order.update({
      where: { razorpayOrderId },
      data: { status: "SUCCESS", paymentId },
    });

    // Enroll user if not already enrolled
    const enrollmentExists = await prisma.enrollment.findFirst({
      where: { userId: order.userId, courseId: order.courseId },
    });

    if (!enrollmentExists) {
      await prisma.enrollment.create({
        data: { userId: order.userId, courseId: order.courseId },
      });
    }
  }

  return { status: "ok" };
};

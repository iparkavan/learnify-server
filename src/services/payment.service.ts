// import { prisma } from "../config/prisma.config";
import { razorpayConfig } from "../config/razorpay.config";
import crypto from "crypto";
import { prisma } from "../lib/schema";

// Create a payment for an order
export const createPaymentService = async (
  userId: string,
  courseId: string,
  gateway: "RAZORPAY",
) => {
  // 1️⃣ Fetch course
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new Error("Course not found");

  // 2️⃣ Create order
  const order = await prisma.order.create({
    data: {
      userId,
      courseId,
      amount: course.price,
      currency: "INR",
      status: "PENDING",
    },
  });

  // 3️⃣ Gateway-specific payment creation
  let paymentGatewayData: {
    id: string;
    amount: number;
    currency: string;
  } | null = null;

  if (gateway === "RAZORPAY") {
    const options = {
      amount: course.price * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `order_rcpt_${order.id}`,
    };

    const razorpayOrder = await razorpayConfig.orders.create(options); // ✅ now defined

    const payment = await prisma.payment.create({
      data: {
        userId: userId,
        courseId: course.id,
        orderId: order.id,
        amount: course.price,
        currency: "INR",
        paymentStatus: "PENDING",
        transactionId: "txn_" + order.id,
        gateway: "RAZORPAY",
        gatewayOrderId: razorpayOrder.id,
      },
    });

    paymentGatewayData = {
      id: razorpayOrder.id,
      amount: course.price,
      currency: "INR",
    };
  }

  return { order, paymentGatewayData };
};

// Verify Razorpay payment
export const verifyRazorpayPaymentService = async (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

  // 1️⃣ Validate signature correctly
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new Error("Invalid payment signature");
  }

  // 2️⃣ Find the payment using gatewayOrderId
  const payRecord = await prisma.payment.findFirst({
    where: { gatewayOrderId: razorpay_order_id },
  });

  if (!payRecord) {
    throw new Error("Payment not found");
  }

  // 3️⃣ Update Payment → SUCCESS
  await prisma.payment.update({
    where: { id: payRecord.id },
    data: {
      paymentStatus: "SUCCESS",
      gatewayPaymentId: razorpay_payment_id,
    },
  });

  // 4️⃣ Update Order → SUCCESS
  const order = await prisma.order.update({
    where: { id: payRecord.orderId! },
    data: { status: "SUCCESS" },
  });

  // 5️⃣ Create or Upsert Enrollment
  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: order.userId,
        courseId: order.courseId,
      },
    },
    create: { userId: order.userId, courseId: order.courseId },
    update: {},
  });

  return { success: true };
};

export const handleRazorpayWebhookService = async (
  rawBody: Buffer,
  signature: string,
) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    throw new Error("Invalid webhook signature");
  }

  const event = JSON.parse(rawBody.toString());

  // Log webhook
  await prisma.webhookLog.create({
    data: { eventId: event.id, payload: event },
  });

  switch (event.event) {
    case "payment.captured": {
      const paymentId = event.payload.payment.entity.id;
      const orderId = event.payload.payment.entity.order_id;

      // Update payment
      const payment = await prisma.payment.updateMany({
        where: { gatewayOrderId: orderId },
        data: { paymentStatus: "SUCCESS", gatewayPaymentId: paymentId },
      });

      // Update order
      await prisma.order.updateMany({
        where: { razorpayOrderId: orderId },
        data: { status: "SUCCESS" },
      });

      // Create enrollment
      const order = await prisma.order.findUnique({
        where: { razorpayOrderId: orderId },
      });
      if (order) {
        await prisma.enrollment.upsert({
          where: {
            userId_courseId: { userId: order.userId, courseId: order.courseId },
          },
          create: { userId: order.userId, courseId: order.courseId },
          update: {},
        });
      }
      break;
    }

    case "payment.failed": {
      const failedOrderId = event.payload.payment.entity.order_id;
      await prisma.order.updateMany({
        where: { razorpayOrderId: failedOrderId },
        data: { status: "FAILED" },
      });
      await prisma.payment.updateMany({
        where: { gatewayOrderId: failedOrderId },
        data: { paymentStatus: "FAILED" },
      });
      break;
    }

    case "refund.processed": {
      const refund = event.payload.refund.entity;

      // Fetch the payment to get orderId
      const payment = await prisma.payment.findFirst({
        where: { gatewayPaymentId: refund.payment_id },
      });

      await prisma.payment.updateMany({
        where: { gatewayPaymentId: refund.payment_id },
        data: { paymentStatus: "REFUNDED", refundId: refund.id },
      });

      if (payment?.orderId) {
        const refundedOrder = await prisma.order.update({
          where: { id: payment.orderId },
          data: { status: "REFUNDED", refundId: refund.id },
        });

        await prisma.enrollment.deleteMany({
          where: {
            userId: refundedOrder.userId,
            courseId: refundedOrder.courseId,
          },
        });
      }
      break;
    }

    default:
      console.log("Unhandled webhook event:", event.event);
  }

  return { success: true };
};

export const refundPayment = async (paymentId: string) => {
  // 1️⃣ Fetch payment
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) throw new Error("Payment not found");
  if (payment.paymentStatus !== "SUCCESS")
    throw new Error("Payment not successful");

  if (!payment.gatewayPaymentId) throw new Error("No gateway payment ID found");

  // 2️⃣ Call Razorpay refund API
  const refund = await razorpayConfig.payments.refund(
    payment.gatewayPaymentId,
    {
      amount: payment.amount * 100, // in paise
    },
  );

  // 3️⃣ Update Payment and Order
  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      paymentStatus: "REFUNDED",
      refundId: refund.id,
    },
  });

  if (payment.orderId) {
    await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        status: "REFUNDED",
        refundId: refund.id,
      },
    });
  }

  // 4️⃣ Optionally delete enrollment
  await prisma.enrollment.deleteMany({
    where: {
      userId: payment.userId,
      courseId: payment.courseId,
    },
  });

  return updatedPayment;
};

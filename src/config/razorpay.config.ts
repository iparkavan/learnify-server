import Razorpay from "razorpay";
import { config } from "./app.config";

export const razorpayConfig = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID!,
  key_secret: config.RAZORPAY_KEY_SECRET!,
});

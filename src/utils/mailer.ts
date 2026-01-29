import sgMail from "@sendgrid/mail";

// Configure SendGrid
const sendGridApiKey = process.env.SENDGRID_API_KEY!;
if (!sendGridApiKey) {
  throw new Error("SENDGRID_API_KEY environment variable is not defined");
}
sgMail.setApiKey(sendGridApiKey);

const verifiedSender = process.env.SENDGRID_VERIFIED_SENDER;
if (!verifiedSender) {
  throw new Error(
    "SENDGRID_VERIFIED_SENDER environment variable is not defined",
  );
}

// In-memory map to track last OTP send times (per email)
// In production, you can use Redis for better scaling
const otpCooldownMap: Record<string, number> = {};
const COOLDOWN_MS = 30 * 1000; // 30 seconds cooldown

export async function sendOtpEmail(to: string, otp: string | number) {
  const now = Date.now();

  // Check cooldown
  if (otpCooldownMap[to] && now - otpCooldownMap[to] < COOLDOWN_MS) {
    throw new Error(
      `OTP was sent recently. Please wait ${Math.ceil(
        (COOLDOWN_MS - (now - otpCooldownMap[to])) / 1000,
      )} seconds before requesting again.`,
    );
  }

  const msg = {
    to,
    from: { name: "Fikron Solutions", email: verifiedSender as string },
    subject: "Your OTP Code",
    text: `Hello,\n\nYour OTP code is ${otp}. It will expire in 5 minutes.\n\nThanks,\nFikron Solutions`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color:#333">Your OTP Code</h2>
        <p>Use the code below to complete your login:</p>
        <h1 style="color:#0070f3">${otp}</h1>
        <p>This OTP will expire in <strong>5 minutes</strong>.</p>
        <p>Thanks,<br/>Fikron Solutions Team</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    otpCooldownMap[to] = now; // update cooldown
    console.log(`✅ OTP sent successfully to ${to}`);
  } catch (error: any) {
    console.error(
      "❌ SendGrid Error:",
      error.response?.body || error.message || error,
    );
    throw new Error("Failed to send OTP email. Please try again later.");
  }
}

export const sendEmailToAdmin = async ({
  firstName,
  lastName,
  email,
  message,
}: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}) => {
  await sgMail.send({
    to: verifiedSender,
    from: verifiedSender,
    replyTo: email, // ✅ user email
    subject: "New Contact Us Message",
    html: `
      <h3>New Contact Message</h3>
      <p><b>Name:</b> ${firstName} ${lastName}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Message:</b> ${message}</p>
    `,
  });
};

export const sendAutoReply = async ({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName: string;
  lastName: string;
}) => {
  await sgMail.send({
    to: email,
    from: verifiedSender, // ✅ verified sender only
    subject: "We received your message!",
    html: `
      <p>Hi ${firstName} ${lastName},</p>
      <p>Thanks for contacting us. Our team will get back to you shortly.</p>
    `,
  });
};

import "dotenv/config";
import express from "express";
import cors from "cors";
import { config } from "./config/app.config";
import authRoutes from "./routes/auth.route";
import passport from "passport";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import "./config/passport.config";
import courseRoutes from "./routes/course.route";
import { isAuthenticated } from "./middlewares/isAuthenticated.middleware";
import userRoutes from "./routes/user.routes";
import paymentRoutes from "./routes/payment.route";
import enrollmentRoutes from "./routes/enrollment.route";
import contactUsRoute from "./routes/contact-us.route";
import profileSetupRoutes from "./routes/profile-setup.route";
import cloudinaryRoutes from "./routes/cloudinary-uploads.route";
import sectionRoutes from "./routes/section.route";
import lectureRoutes from "./routes/lecture.route";

const app = express();

const allowedOrigins = [config.LOCAL_FRONTEND_ORIGIN, config.FRONTEND_ORIGIN];

// app.use(
//   cors({
//     origin: (origin, cb) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         cb(null, true);
//       } else {
//         cb(new Error("CORS blocked: " + origin));
//       }
//     },
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: allowedOrigins, // 👈 your deployed frontend
    credentials: true, // 👈 critical for cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Passport initialization
app.use(passport.initialize());

app.get(`${config.BASE_PATH}/ping`, (req, res) => {
  res.status(200).json({ message: "pong" });
});

app.get(`${config.BASE_PATH}/health`, (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use(`${config.BASE_PATH}/auth`, authRoutes);

app.use(
  `${config.BASE_PATH}/profile-setup`,
  isAuthenticated,
  profileSetupRoutes,
);

app.use(`${config.BASE_PATH}/user`, isAuthenticated, userRoutes);

app.use(`${config.BASE_PATH}/course`, courseRoutes);

app.use(`${config.BASE_PATH}/section`, sectionRoutes);

app.use(`${config.BASE_PATH}/lecture`, lectureRoutes);

app.use(`${config.BASE_PATH}/payment`, isAuthenticated, paymentRoutes);

app.use(`${config.BASE_PATH}/enrollments`, isAuthenticated, enrollmentRoutes);

app.use(`${config.BASE_PATH}/contact-us`, contactUsRoute);

app.use(`${config.BASE_PATH}`, cloudinaryRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(
    `✅ Server is listening on port ${config.PORT} in ${config.NODE_ENV} http://localhost:${config.PORT}`,
  );
});

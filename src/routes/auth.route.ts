import { Router } from "express";
import {
  googleAuthCallbackController,
  loginSendOtpController,
  signupSendOtpController,
  verifyOtpController,
} from "../controllers/auth.controller";
import passport from "passport";
import { config } from "../config/app.config";
import {
  loginAdminController,
  signupAdminController,
} from "../controllers/admin-auth.controller";

const authRoutes = Router();

// ADMIN ROUTES
authRoutes.post("/admin/signup", signupAdminController);
authRoutes.post("/admin/login", loginAdminController);

// STUDENT ROUTES
authRoutes.post("/login/send-otp", loginSendOtpController);
authRoutes.post("/signup/send-otp", signupSendOtpController);
authRoutes.post("/verify-otp", verifyOtpController);
authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  googleAuthCallbackController
);

// authRoutes.get("/google/callback", (req, res, next) => {
//   passport.authenticate("google", { session: false }, (err, user, info) => {
//     if (err) {
//       console.error("Google Auth Error:", err.message);

//       return res.status(400).json({
//         success: false,
//         message: err.message || "Authentication failed",
//       });
//     }

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: info?.message || "User not found",
//       });
//     }

//     googleAuthCallbackController;
//   })(req, res, next);
// });

authRoutes.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  }
);

export default authRoutes;

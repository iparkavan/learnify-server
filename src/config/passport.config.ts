// config/passport.ts
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { PrismaClient, ProviderType, RoleType } from "@prisma/client";
import { config } from "./app.config";
import { handleGoogleAuth } from "../services/auth.service";
import { prisma } from "../lib/schema";

// const prisma = new PrismaClient();
const JWT_SECRET = config.JWT_SECRET || "your-secret";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.id },
        });
        if (user) return done(null, user);
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

/* -------------------------------------------------------------------------- */
/* 🔵 GOOGLE STRATEGY — used for Google OAuth Login                           */
/* -------------------------------------------------------------------------- */
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID!,
      clientSecret: config.GOOGLE_CLIENT_SECRET!,
      callbackURL: config.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const result = await handleGoogleAuth(
          profile,
          accessToken,
          refreshToken,
        );
        return done(null, result);
      } catch (error) {
        return done(error, undefined);
      }
    },
  ),
);

export default passport;

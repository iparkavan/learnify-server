import { Request, Response, NextFunction } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { verifyJwt } from "../utils/jwt";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token: string | undefined;

    // ✅ 1. Check Authorization header (Postman, mobile apps)
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // ✅ 2. Fallback to cookies (browser, SSR)
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res
        .status(HTTPSTATUS.UNAUTHORIZED)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = verifyJwt(token);

    if (!decoded || typeof decoded !== "object") {
      return res
        .status(HTTPSTATUS.UNAUTHORIZED)
        .json({ message: "Unauthorized: Invalid or expired token" });
    }

    const { id, name, email, role } = decoded as any;

    if (!id || !role) {
      return res
        .status(HTTPSTATUS.UNAUTHORIZED)
        .json({ message: "Unauthorized: Invalid token payload" });
    }

    // ✅ Attach user to request
    req.user = { id, name, email, role };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res
      .status(HTTPSTATUS.UNAUTHORIZED)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};

// import { Request, Response, NextFunction } from "express";
// import { HTTPSTATUS } from "../config/http.config";
// import { verifyJwt } from "../utils/jwt";

// export const isAuthenticated = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res
//         .status(HTTPSTATUS.UNAUTHORIZED)
//         .json({ message: "Unauthorized: No token provided" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = verifyJwt(token);

//     if (!decoded || typeof decoded !== "object") {
//       return res
//         .status(HTTPSTATUS.UNAUTHORIZED)
//         .json({ message: "Unauthorized: Invalid or expired token" });
//     }

//     const { id, name, email, role } = decoded as any;

//     if (!id || !role) {
//       return res
//         .status(HTTPSTATUS.UNAUTHORIZED)
//         .json({ message: "Unauthorized: Invalid token payload" });
//     }

//     // ✅ Attach user data to request
//     req.user = { id, name, email, role };

//     next();
//   } catch (error) {
//     console.error("Auth Middleware Error:", error);
//     return res
//       .status(HTTPSTATUS.UNAUTHORIZED)
//       .json({ message: "Unauthorized: Invalid or expired token" });
//   }
// };

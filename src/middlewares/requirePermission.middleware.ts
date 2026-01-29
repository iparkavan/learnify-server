import { Request, Response, NextFunction } from "express";
import { PermissionType } from "../generated/prisma/enums";
import { prisma } from "../lib/schema";
// import { PrismaClient, PermissionType } from "@prisma/client";

// const prisma = new PrismaClient();

// Middleware to check if user has required permission
export const requirePermission = (permission: PermissionType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Make sure you attach the logged-in user to req

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get user's role from DB
    const role = await prisma.role.findUnique({
      where: { name: user.role },
    });

    if (!role || !role.permissions.includes(permission)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};

// import { prisma } from "../config/prisma.config";
import { prisma } from "../lib/schema";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { NotFoundException } from "../utils/app-error";

export const getCurrentUserController = asyncHandler(async (req, res, next) => {
  if (!req.user) throw new NotFoundException("User not found");

  const currentUser = await prisma.user.findUnique({
    where: { id: req.user?.id },
    include: {
      studentProfile: true,
      instructorProfile: true,
    },
  });

  return res.json({
    message: "Current user fetched successfully",
    user: currentUser,
  });
});

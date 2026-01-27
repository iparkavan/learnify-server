import { PrismaClient, ProviderType, RoleType } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signJwt } from "../utils/jwt";
import { BadRequestException } from "../utils/app-error";

const prisma = new PrismaClient();

export const createInstructorUserService = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const { email, name, password } = data;

  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Check if user already exists
    const existingUser = await tx.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException(
        "Instructor with this email already exists",
      );
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create admin user
    const newUser = await tx.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: RoleType.INSTRUCTOR,
      },
    });

    // 4️⃣ Create account entry for ADMIN login (EMAIL)
    await tx.account.create({
      data: {
        userId: newUser.id,
        provider: ProviderType.EMAIL,
        providerAccountId: email, // email as providerAccountId
        accessToken: null,
        refreshToken: null,
      },
    });

    await tx.instructorProfile.create({
      data: {
        userId: newUser.id,
      },
    });

    // 5️⃣ Generate JWT
    const token = signJwt({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email!,
      role: newUser.role,
    });

    return {
      message: "Instructor registered successfully",
      user: newUser,
      token,
    };
  });
};

export const loginInstructorUserService = async (data: {
  email: string;
  password: string;
}) => {
  const { email, password } = data;

  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Find user
    const user = await tx.user.findUnique({ where: { email } });
    if (!user || user.role !== RoleType.INSTRUCTOR) {
      throw new Error("Invalid credentials");
    }

    // 2️⃣ Verify password
    if (!user.password) throw new Error("Password not set for this admin");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    // 3️⃣ Ensure account entry exists
    const account = await tx.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: ProviderType.EMAIL,
          providerAccountId: email,
        },
      },
    });

    if (!account) {
      await tx.account.create({
        data: {
          userId: user.id,
          provider: ProviderType.EMAIL,
          providerAccountId: email,
        },
      });
    }

    // 4️⃣ Generate JWT
    const token = signJwt({
      id: user.id,
      name: user.name,
      email: user.email!,
      role: user.role,
    });

    return {
      message: "Admin logged in successfully",
      user,
      token,
    };
  });
};

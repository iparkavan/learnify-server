import { PrismaClient, ProviderType, RoleType, User } from "@prisma/client";
import { signJwt } from "../utils/jwt";

const prisma = new PrismaClient();

export interface AuthInput {
  email: string;
  name?: string | null;
  provider: ProviderType | "EMAIL";
  providerAccountId: string;
  userType?: "STUDENT" | "INSTRUCTOR"; // NEW: dynamic role
  accessToken?: string | null;
  refreshToken?: string | null;
}

export const signInOrCreateUser = async (data: AuthInput) => {
  const {
    email,
    name,
    provider,
    providerAccountId,
    userType = "STUDENT",
    accessToken,
    refreshToken,
  } = data;

  const normalizedProvider =
    provider === "EMAIL" ? ProviderType.EMAIL : provider;

  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Check if user already exists
    let user = await tx.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        instructorProfile: true,
      },
    });

    // Helper: derive profile completion
    const deriveProfileCompletion = (user: any) => {
      if (user.role === RoleType.STUDENT) return !!user.profile;
      if (user.role === RoleType.INSTRUCTOR) return !!user.instructorProfile;
      return true; // ADMIN
    };

    // 2️⃣ If user exists
    if (user) {
      // a) Email OTP login
      if (normalizedProvider === ProviderType.EMAIL) {
        const existingEmailAccount = await tx.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: ProviderType.EMAIL,
              providerAccountId: email,
            },
          },
        });

        if (!existingEmailAccount) {
          await tx.account.create({
            data: {
              userId: user.id,
              provider: ProviderType.EMAIL,
              providerAccountId: email,
              accessToken: null,
              refreshToken: null,
            },
          });
        }

        const token = signJwt({
          id: user.id,
          name: user.name,
          email: user.email!,
          role: user.role,
        });

        return {
          message: "User logged in successfully",
          user,
          isProfileComplete: deriveProfileCompletion(user),
          token,
        };
      }

      // b) OAuth login (Google)
      const existingAccount = await tx.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: normalizedProvider,
            providerAccountId,
          },
        },
      });

      if (!existingAccount) {
        await tx.account.create({
          data: {
            userId: user.id,
            provider: normalizedProvider,
            providerAccountId,
            accessToken,
            refreshToken,
          },
        });
      }

      const token = signJwt({
        id: user.id,
        name: user.name,
        email: user.email!,
        role: user.role,
      });

      return {
        message: "User logged in successfully",
        user,
        isProfileComplete: deriveProfileCompletion(user),
        token,
      };
    }

    // 3️⃣ If user does NOT exist → create new user
    const newUser = await tx.user.create({
      data: {
        email,
        name: name || "New User",
        role:
          userType === "INSTRUCTOR" ? RoleType.INSTRUCTOR : RoleType.STUDENT,
      },
    });

    // 4️⃣ Create account for provider
    await tx.account.create({
      data: {
        userId: newUser.id,
        provider: normalizedProvider,
        providerAccountId:
          normalizedProvider === ProviderType.EMAIL ? email : providerAccountId,
        accessToken:
          normalizedProvider === ProviderType.EMAIL ? null : accessToken,
        refreshToken:
          normalizedProvider === ProviderType.EMAIL ? null : refreshToken,
      },
    });

    // 5️⃣ Create InstructorProfile if userType = INSTRUCTOR
    if (userType === "INSTRUCTOR") {
      await tx.instructorProfile.create({
        data: {
          userId: newUser.id,
        },
      });
    }

    // 6️⃣ Sign JWT token
    const token = signJwt({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email!,
      role: newUser.role,
    });

    return {
      message: "User registered successfully",
      user: newUser,
      isProfileComplete: deriveProfileCompletion(newUser),
      token,
    };
  });
};

// ----------------------------
// OPTIONAL helper for OTP flow
// ----------------------------
export const studentOrInstructorSignInWithOtp = async (
  email: string,
  name?: string,
  type: "STUDENT" | "INSTRUCTOR" = "STUDENT"
) => {
  return await signInOrCreateUser({
    email,
    name,
    provider: "EMAIL",
    providerAccountId: email,
    userType: type,
  });
};

// ----------------------------
// OPTIONAL helper for Google OAuth
// ----------------------------
export const handleGoogleAuth = async (
  profile: any,
  accessToken: string,
  refreshToken: string,
  type: "STUDENT" | "INSTRUCTOR" = "STUDENT"
) => {
  const email = profile.emails?.[0]?.value;
  const name = profile.displayName;
  const googleId = profile.id;

  if (!email) throw new Error("Google account has no email");

  return await signInOrCreateUser({
    email,
    name,
    provider: ProviderType.GOOGLE,
    providerAccountId: googleId,
    accessToken,
    refreshToken,
    userType: type,
  });
};

// import { ProviderType, RoleType } from "@prisma/client";
// import { signJwt } from "../utils/jwt";
// import { prisma } from "../config/prisma.config";

// interface AuthInput {
//   email: string;
//   name?: string | null;
//   userType?: "STUDENT" | "INSTRUCTOR";
//   provider: ProviderType | "EMAIL";
//   providerAccountId: string;
//   accessToken?: string | null;
//   refreshToken?: string | null;
// }

// export const signInOrCreateUser = async (data: AuthInput) => {
//   const {
//     email,
//     name,
//     provider,
//     providerAccountId,
//     accessToken,
//     refreshToken,
//   } = data;

//   const normalizedProvider =
//     provider === "EMAIL" ? ProviderType.EMAIL : provider;

//   return await prisma.$transaction(async (tx) => {
//     // 1️⃣ Check user by email
//     let user = await tx.user.findUnique({ where: { email } });

//     if (user) {
//       // 2️⃣ EMAIL OTP LOGIN → create account entry if missing
//       if (normalizedProvider === ProviderType.EMAIL) {
//         const existingEmailAccount = await tx.account.findUnique({
//           where: {
//             provider_providerAccountId: {
//               provider: ProviderType.EMAIL,
//               providerAccountId: email, // email as providerAccountId
//             },
//           },
//         });

//         if (!existingEmailAccount) {
//           await tx.account.create({
//             data: {
//               userId: user.id,
//               provider: ProviderType.EMAIL,
//               providerAccountId: email,
//               accessToken: null,
//               refreshToken: null,
//             },
//           });
//         }

//         const token = signJwt({
//           id: user.id,
//           name: user.name,
//           email: user.email!,
//           role: user.role,
//         });

//         return {
//           message: "User logged in successfully",
//           user,
//           token,
//         };
//       }

//       // 3️⃣ OAuth login (Google)
//       const existingAccount = await tx.account.findUnique({
//         where: {
//           provider_providerAccountId: {
//             provider: normalizedProvider,
//             providerAccountId,
//           },
//         },
//       });

//       // If account missing → create it
//       if (!existingAccount) {
//         await tx.account.create({
//           data: {
//             userId: user.id,
//             provider: normalizedProvider,
//             providerAccountId,
//             accessToken,
//             refreshToken,
//           },
//         });
//       }

//       const token = signJwt({
//         id: user.id,
//         name: user.name,
//         email: user.email!,
//         role: user.role,
//       });

//       return {
//         message: "User logged in successfully",
//         user,
//         token,
//       };
//     }

//     // 4️⃣ New user creation
//     const newUser = await tx.user.create({
//       data: {
//         email,
//         name: name || "New User",
//         role:
//           data.userType === "INSTRUCTOR"
//             ? RoleType.INSTRUCTOR
//             : RoleType.STUDENT,
//       },
//     });

//     // 5️⃣ Create account for EMAIL OTP OR OAuth
//     if (data.userType === "INSTRUCTOR") {
//       await tx.instructorProfile.create({
//         data: { userId: newUser.id },
//       });
//     }
//     await tx.account.create({
//       data: {
//         userId: newUser.id,
//         provider: normalizedProvider,
//         providerAccountId:
//           normalizedProvider === ProviderType.EMAIL
//             ? email // email as providerAccountId
//             : providerAccountId,
//         accessToken:
//           normalizedProvider === ProviderType.EMAIL ? null : accessToken,
//         refreshToken:
//           normalizedProvider === ProviderType.EMAIL ? null : refreshToken,
//       },
//     });

//     // 6️⃣ Token
//     const token = signJwt({
//       id: newUser.id,
//       name: newUser.name,
//       email: newUser.email!,
//       role: newUser.role,
//     });

//     return {
//       message: "User registered successfully",
//       user: newUser,
//       token,
//     };
//   });
// };

// export const studentSignInOrSignUpWithOtpService = async (
//   email: string,
//   name?: string,
//   type: "STUDENT" | "INSTRUCTOR" = "STUDENT"
// ) => {
//   return await signInOrCreateUser({
//     email,
//     name,
//     provider: "EMAIL",
//     providerAccountId: email,
//     userType: type,
//   });
// };

// export const handleGoogleAuth = async (
//   profile: any,
//   accessToken: string,
//   refreshToken: string
// ) => {
//   const email = profile.emails?.[0]?.value;
//   const name = profile.displayName;
//   const googleId = profile.id;

//   if (!email) throw new Error("Google account has no email");

//   return await signInOrCreateUser({
//     email,
//     name,
//     provider: ProviderType.GOOGLE,
//     providerAccountId: googleId,
//     accessToken,
//     refreshToken,
//   });
// };

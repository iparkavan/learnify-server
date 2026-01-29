// import { prisma } from "../config/prisma.config";
import { HTTPSTATUS } from "../config/http.config";
import { StudentProfileSetupValidationType } from "../validations/profile-setup.validation";
// import {
//   DegreeProgram,
//   ReferralSource,
//   StudentProfile,
//   StudyYear,
// } from "@prisma/client";
import { AppError } from "../utils/app-error";
import { prisma } from "../lib/schema";
import {
  DegreeProgram,
  ReferralSource,
  StudentProfile,
  StudyYear,
} from "../generated/prisma/client";

const studentProfileSetupService = async (
  profileData: StudentProfileSetupValidationType,
  userId: string | undefined,
): Promise<StudentProfile> => {
  if (!userId) {
    throw new AppError("Unauthorized", HTTPSTATUS.UNAUTHORIZED);
  }

  return await prisma.$transaction(async (tx) => {
    const existingProfile = await tx.studentProfile.findUnique({
      where: { userId },
    });

    // If profile exists → update and return
    if (existingProfile) {
      return await tx.studentProfile.update({
        where: { userId },
        data: {
          degreeProgram: profileData.degreeProgram as DegreeProgram,
          studyYear: profileData.studyYear as StudyYear,
          specialization: profileData.specialization,
          collegeName: profileData.collegeName,
          graduationYear: parseInt(profileData.graduationYear),
          country: profileData.country,
          referralSource: profileData.referralSource as ReferralSource,
          phoneNumber: profileData.phoneNumber,
        },
      });
    }

    // Else → create and return
    return await tx.studentProfile.create({
      data: {
        degreeProgram: profileData.degreeProgram as DegreeProgram,
        studyYear: profileData.studyYear as StudyYear,
        specialization: profileData.specialization,
        collegeName: profileData.collegeName,
        graduationYear: parseInt(profileData.graduationYear),
        country: profileData.country,
        referralSource: profileData.referralSource as ReferralSource,
        phoneNumber: profileData.phoneNumber,
        userId,
      },
    });
  });
};

export { studentProfileSetupService };

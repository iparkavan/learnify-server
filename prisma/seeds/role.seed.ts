import { PrismaClient, RoleType, PermissionType } from "@prisma/client";

const prisma = new PrismaClient();

// Merge instructor permissions into admin
const RolePermissions: Record<RoleType, PermissionType[]> = {
  ADMIN: [
    // Admin-specific permissions
    PermissionType.MANAGE_USERS,
    PermissionType.MANAGE_COURSES,
    PermissionType.MANAGE_QUIZZES,
    PermissionType.MANAGE_PAYMENTS,
    PermissionType.ACCESS_ADMIN_PANEL,
  ],

  INSTRUCTOR: [
    PermissionType.CREATE_COURSE,
    PermissionType.UPDATE_COURSE,
    PermissionType.DELETE_COURSE,
    PermissionType.VIEW_STUDENTS,
    PermissionType.CREATE_QUIZ,
  ],

  STUDENT: [
    PermissionType.ENROLL_COURSE,
    PermissionType.VIEW_COURSE,
    PermissionType.ATTEMPT_QUIZ,
    PermissionType.VIEW_RESULTS,
    PermissionType.VIEW_ONLY,
  ],
};

async function main() {
  for (const [role, permissions] of Object.entries(RolePermissions)) {
    await prisma.role.upsert({
      where: { name: role as RoleType },
      update: { permissions },
      create: { name: role as RoleType, permissions },
    });
  }
  console.log("✅ Roles seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

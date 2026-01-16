export const Roles = {
  ADMIN: "ADMIN",
  INSTRUCTOR: "INSTRUCTOR",
  STUDENT: "STUDENT",
} as const;

export type RoleType = keyof typeof Roles;

export const Permissions = {
  // 👥 User Management
  MANAGE_USERS: "MANAGE_USERS",

  // 📚 Course Management
  MANAGE_COURSES: "MANAGE_COURSES",
  CREATE_COURSE: "CREATE_COURSE",
  UPDATE_COURSE: "UPDATE_COURSE",
  DELETE_COURSE: "DELETE_COURSE",
  VIEW_STUDENTS: "VIEW_STUDENTS",

  // 🧠 Quiz Management
  MANAGE_QUIZZES: "MANAGE_QUIZZES",
  CREATE_QUIZ: "CREATE_QUIZ",

  // 💳 Payments
  MANAGE_PAYMENTS: "MANAGE_PAYMENTS",

  // 🔐 Access
  ACCESS_ADMIN_PANEL: "ACCESS_ADMIN_PANEL",

  // 🎓 Student Actions
  ENROLL_COURSE: "ENROLL_COURSE",
  VIEW_COURSE: "VIEW_COURSE",
  ATTEMPT_QUIZ: "ATTEMPT_QUIZ",
  VIEW_RESULTS: "VIEW_RESULTS",

  // 👁️ Minimal Access
  VIEW_ONLY: "VIEW_ONLY",
} as const;

export type PermissionType = keyof typeof Permissions;

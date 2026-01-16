import { execSync } from "child_process";

export default {
  schema: "./prisma/schema.prisma", // path relative to project root
  seed: async () => {
    console.log("⏳ Seeding Roles..."); // should print immediately
    execSync("ts-node prisma/seeds/role.seed.ts", { stdio: "inherit" });
  },
};

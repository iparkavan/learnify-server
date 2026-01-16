-- DropForeignKey
ALTER TABLE "InstructorProfile" DROP CONSTRAINT "InstructorProfile_userId_fkey";

-- AddForeignKey
ALTER TABLE "InstructorProfile" ADD CONSTRAINT "InstructorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

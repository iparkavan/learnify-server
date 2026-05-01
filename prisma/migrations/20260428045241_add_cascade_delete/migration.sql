-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_lectureId_fkey";

-- DropForeignKey
ALTER TABLE "CodingExercise" DROP CONSTRAINT "CodingExercise_lectureId_fkey";

-- DropForeignKey
ALTER TABLE "Lecture" DROP CONSTRAINT "Lecture_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_lectureId_fkey";

-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_lectureId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_lectureId_fkey";

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodingExercise" ADD CONSTRAINT "CodingExercise_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

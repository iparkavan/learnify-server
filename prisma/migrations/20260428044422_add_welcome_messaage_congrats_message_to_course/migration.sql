-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "congratsMessage" TEXT NOT NULL DEFAULT 'Congratulations! You''ve completed the course. We hope you''ve gained valuable knowledge and skills.',
ADD COLUMN     "welcomeMessage" TEXT NOT NULL DEFAULT 'Welcome to the course! We''re excited to have you on board. Get ready to embark on a learning journey that will expand your knowledge and skills. Let''s dive in and start learning together!';

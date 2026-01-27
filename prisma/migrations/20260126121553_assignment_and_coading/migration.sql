-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "lectureId" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "estimatedTime" INTEGER NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodingExercise" (
    "id" TEXT NOT NULL,
    "lectureId" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "starterCode" TEXT NOT NULL,
    "solutionCode" TEXT NOT NULL,
    "testCases" JSONB NOT NULL,

    CONSTRAINT "CodingExercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_lectureId_key" ON "Assignment"("lectureId");

-- CreateIndex
CREATE UNIQUE INDEX "CodingExercise_lectureId_key" ON "CodingExercise"("lectureId");

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodingExercise" ADD CONSTRAINT "CodingExercise_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

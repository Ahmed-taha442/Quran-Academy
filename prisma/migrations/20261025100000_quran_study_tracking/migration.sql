CREATE TABLE "QuranStudyActivity" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "surahNumber" INTEGER NOT NULL,
    "fromAyah" INTEGER NOT NULL,
    "toAyah" INTEGER NOT NULL,
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    "selfRating" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuranStudyActivity_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "QuranStudyActivity_studentId_createdAt_idx" ON "QuranStudyActivity"("studentId", "createdAt");
CREATE INDEX "QuranStudyActivity_studentId_activityType_createdAt_idx" ON "QuranStudyActivity"("studentId", "activityType", "createdAt");

ALTER TABLE "QuranStudyActivity" ADD CONSTRAINT "QuranStudyActivity_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

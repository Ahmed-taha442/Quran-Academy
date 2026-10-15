import type { LessonKind } from "@/types/domain";

export interface Course {
  id: string;
  slug: string;
  track: "noor-bayan" | "quran";
  titleKey: string;
  levelRequired: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  slug: string;
  kind: LessonKind;
  order: number;
  durationMinutes: number;
  titleKey: string;
}

export interface Assessment {
  id: string;
  lessonId: string;
  kind: "letter-recognition" | "reading-aloud" | "tajweed" | "memorization";
  passingScore: number;
}

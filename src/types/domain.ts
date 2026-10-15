export type LocaleCode = "en" | "ar" | "ur" | "fr" | "id" | "tr";

export type UserRole = "student" | "teacher" | "admin" | "guardian";

export type ProficiencyLevel =
  | "absolute-beginner"
  | "letter-recognition"
  | "reading-words"
  | "reading-quran"
  | "tajweed"
  | "hifz";

export type LessonKind =
  | "video"
  | "audio"
  | "interactive"
  | "live"
  | "practice"
  | "assessment";

export interface LocalizedText {
  locale: LocaleCode;
  value: string;
}

export interface AudioAsset {
  id: string;
  url: string;
  durationMs: number;
  reciter?: string;
}

export interface ProgressSnapshot {
  userId: string;
  trackId: string;
  completedLessonIds: string[];
  masteryPercent: number;
  lastActivityAt: string;
}

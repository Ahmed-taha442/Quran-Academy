export type QuranTrackStage =
  | "correct-reading"
  | "tajweed-foundations"
  | "fluency"
  | "memorization"
  | "revision";

export interface Ayah {
  surahNumber: number;
  ayahNumber: number;
  uthmaniText: string;
  simpleText: string;
  audioId: string;
}

export interface Surah {
  number: number;
  nameAr: string;
  nameTransliterated: string;
  revelationType: "makki" | "madani";
  ayahCount: number;
}

export interface TajweedRule {
  id: string;
  slug: string;
  category: "noon-meem" | "madd" | "lam" | "qalqalah" | "idgham" | "other";
  titleKey: string;
}

export interface HifzAssignment {
  id: string;
  studentId: string;
  surahNumber: number;
  fromAyah: number;
  toAyah: number;
  dueAt?: string;
}

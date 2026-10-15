/**
 * Pedagogical order for non-Arabic speakers (أعاجم):
 * Noor Al-Bayan literacy first, then Quran reading, tajweed, then hifz.
 */
export const learningTracks = {
  noorBayan: {
    id: "noor-bayan",
    slug: "noor-bayan",
    stages: [
      "isolated-letters",
      "letter-forms",
      "harakat",
      "tanween",
      "sukoon",
      "shadda",
      "madd",
      "connected-letters",
      "quranic-words",
      "short-surahs",
    ],
  },
  quran: {
    id: "quran",
    slug: "quran",
    stages: [
      "correct-reading",
      "tajweed-foundations",
      "fluency",
      "memorization",
      "revision",
    ],
  },
} as const;

export const studentRoles = ["student", "teacher", "admin", "guardian"] as const;
export type UserRole = (typeof studentRoles)[number];

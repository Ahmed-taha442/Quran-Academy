export type LetterForm = "isolated" | "initial" | "medial" | "final";

export type NoorBayanStage =
  | "isolated-letters"
  | "letter-forms"
  | "harakat"
  | "tanween"
  | "sukoon"
  | "shadda"
  | "madd"
  | "connected-letters"
  | "quranic-words"
  | "short-surahs";

export interface ArabicLetter {
  id: string;
  char: string;
  nameAr: string;
  transliteration: string;
  forms: Record<LetterForm, string>;
  audioId: string;
}

export interface NoorBayanLesson {
  id: string;
  stage: NoorBayanStage;
  order: number;
  titleKey: "noorBayan.isolatedLetters" | "noorBayan.letterForms" | "noorBayan.harakat";
  letterIds: string[];
  practiceItemIds: string[];
}

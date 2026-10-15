import type { NoorBayanLesson } from "./types";

export const noorBayanLessons: NoorBayanLesson[] = [
  {
    id: "nb-01",
    stage: "isolated-letters",
    order: 1,
    titleKey: "noorBayan.isolatedLetters",
    letterIds: ["alif", "ba", "ta", "tha"],
    practiceItemIds: ["nb-01-p1", "nb-01-p2"],
  },
  {
    id: "nb-02",
    stage: "letter-forms",
    order: 2,
    titleKey: "noorBayan.letterForms",
    letterIds: ["ba", "ta", "tha"],
    practiceItemIds: ["nb-02-p1"],
  },
  {
    id: "nb-03",
    stage: "harakat",
    order: 3,
    titleKey: "noorBayan.harakat",
    letterIds: [],
    practiceItemIds: ["nb-03-p1"],
  },
];

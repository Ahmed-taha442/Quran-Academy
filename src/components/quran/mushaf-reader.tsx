"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MushafPageView } from "./mushaf-page-view";

type Verse = {
  numberInSurah: number;
  text: string;
  translation: string;
  audio: string | null;
  pageNumber: number;
};

type Surah = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
};

type ReaderData = {
  surah: Surah;
  translationSource: string;
  ayahs: Verse[];
};

type ReviewRecord = {
  reviews: number;
  nextReviewAt: string;
  lastReviewedAt: string;
  rating: "again" | "hard" | "good" | "easy";
};

type StudyAssignment = {
  id: string;
  title: string;
  surah: number;
  fromAyah: number;
  toAyah: number;
  createdAt: string;
};

type TeacherNote = {
  id: string;
  surah: number;
  fromAyah: number;
  toAyah: number;
  accuracy: number;
  fluency: number;
  tajweed: number;
  confidence: number;
  note: string;
  createdAt: string;
};

type StoredStudy = {
  reviews: Record<string, ReviewRecord>;
  bookmarks: string[];
  assignments: StudyAssignment[];
  teacherNotes: TeacherNote[];
};

const STORAGE_KEY = "accadmy.quran-study.v1";
const EMPTY_STUDY: StoredStudy = {
  reviews: {},
  bookmarks: [],
  assignments: [],
  teacherNotes: [],
};
const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60];

const copy = {
  en: {
    title: "Quran reader & memorization",
    subtitle: "Read with a trusted translation, listen, memorize, and review with a clear plan.",
    read: "Read",
    memorize: "Memorize & review",
    teacher: "Teacher tools",
    local: "Study data is saved on this device",
    chooseSurah: "Choose surah",
    from: "From ayah",
    to: "To ayah",
    translation: "Show translation",
    hide: "Test my recall",
    reveal: "Show ayah",
    hideWords: "Hide random words",
    showAllWords: "Reveal all words",
    hidePercent: "Words to hide",
    reshuffleWords: "New word set",
    wordsHidden: "words hidden",
    showNextWord: "Reveal next word",
    previousPage: "Previous page",
    nextPage: "Next page",
    mushafPage: "Mushaf page",
    loadingMushaf: "Loading the Madinah Mushaf page…",
    mushafUnavailable: "The printed page could not load. Check your connection and retry.",
    verseTextDetails: "Verse text, translation, and study marks",
    play: "Play selected range",
    pause: "Pause recitation",
    repeat: "Repeat each ayah",
    startPlan: "Add range to my plan",
    reviewDue: "Review due ayahs",
    clearDue: "Show whole range",
    due: "Due today",
    saved: "Tracked ayahs",
    bookmarks: "Bookmarks",
    plan: "My plan",
    emptyPlan: "Your saved ranges will appear here.",
    savedRange: "Saved range",
    source: "Translation",
    provider: "Quran text and recitation provided by AlQuran.cloud",
    attribution: "Translation edition",
    unavailable: "Could not load this surah. Check your connection and try again.",
    retry: "Try again",
    loading: "Loading the surah…",
    again: "Need more practice",
    hard: "Difficult",
    good: "Remembered",
    easy: "Easy",
    recordReview: "Schedule next review",
    reviewSaved: "Review saved. The next date is now in your plan.",
    bookmark: "Save ayah",
    removeBookmark: "Remove bookmark",
    assignmentTitle: "Assignment title",
    assignmentPlaceholder: "For example: Al-Fatiha, ayahs 1–4",
    assign: "Assign this range",
    accuracy: "Accuracy",
    fluency: "Fluency",
    tajweed: "Tajweed",
    confidence: "Confidence",
    teacherNote: "Teacher feedback",
    feedbackPlaceholder: "Add a specific, encouraging note for the student…",
    saveFeedback: "Save feedback",
    noFeedback: "No teacher feedback has been saved on this device.",
    noAssignments: "No assignments yet.",
    ratingHint: "After reciting from memory, choose how well you recalled this range. Reviews are spaced over time.",
    translationHint: "A translation helps with meaning; learn pronunciation and recitation from a qualified teacher.",
    dataNote: "This browser-only prototype does not sync data between student and teacher accounts yet.",
    savedOn: "Saved locally",
    assignedRange: "Range",
    ayah: "Ayah",
    ayahs: "ayahs",
    overview: "A gentle, structured routine",
    day: "day",
    days: "days",
    noneDue: "No ayahs are due in this range today.",
    playAyah: "Play this ayah",
    reciter: "Reciter: Mishary Alafasy",
  },
  ar: {
    title: "المصحف والحفظ والمراجعة",
    subtitle: "اقرأ بترجمة موثوقة، واستمع للتلاوة، واحفظ وراجع بخطة واضحة.",
    read: "القراءة",
    memorize: "الحفظ والمراجعة",
    teacher: "أدوات المعلم",
    local: "بيانات الدراسة محفوظة على هذا الجهاز",
    chooseSurah: "اختر السورة",
    from: "من الآية",
    to: "إلى الآية",
    translation: "إظهار المعنى بالترجمة",
    hide: "اختبر حفظي",
    reveal: "إظهار الآية",
    hideWords: "إخفاء كلمات عشوائية",
    showAllWords: "إظهار كل الكلمات",
    hidePercent: "نسبة الكلمات المخفية",
    reshuffleWords: "مجموعة كلمات جديدة",
    wordsHidden: "كلمة مخفية",
    showNextWord: "أظهر الكلمة التالية",
    previousPage: "الصفحة السابقة",
    nextPage: "الصفحة التالية",
    mushafPage: "صفحة المصحف",
    loadingMushaf: "جارٍ تحميل صفحة مصحف المدينة…",
    mushafUnavailable: "تعذر تحميل صفحة المصحف. تحقق من الاتصال وحاول مجددًا.",
    verseTextDetails: "نص الآيات والترجمة وعلامات المتابعة",
    play: "استمع للنطاق المحدد",
    pause: "إيقاف التلاوة مؤقتًا",
    repeat: "تكرار كل آية",
    startPlan: "أضف النطاق إلى خطتي",
    reviewDue: "راجع الآيات المستحقة",
    clearDue: "عرض النطاق كاملًا",
    due: "مراجعة اليوم",
    saved: "آيات أتابعها",
    bookmarks: "الآيات المحفوظة",
    plan: "خطتي",
    emptyPlan: "ستظهر هنا النطاقات التي تضيفها إلى خطتك.",
    savedRange: "نطاق محفوظ",
    source: "الترجمة",
    provider: "نص القرآن والتلاوة من AlQuran.cloud",
    attribution: "مصدر الترجمة",
    unavailable: "تعذر تحميل السورة. تحقق من الاتصال وحاول مرة أخرى.",
    retry: "إعادة المحاولة",
    loading: "جارٍ تحميل السورة…",
    again: "أحتاج تدريبًا أكثر",
    hard: "كان صعبًا",
    good: "تذكرت جيدًا",
    easy: "سهل",
    recordReview: "جدولة المراجعة التالية",
    reviewSaved: "حُفظت المراجعة وأُضيف موعدها القادم إلى خطتك.",
    bookmark: "احفظ الآية",
    removeBookmark: "إزالة من المحفوظات",
    assignmentTitle: "عنوان الواجب",
    assignmentPlaceholder: "مثال: الفاتحة، الآيات ١–٤",
    assign: "تعيين هذا النطاق",
    accuracy: "صحة القراءة",
    fluency: "الطلاقة",
    tajweed: "التجويد",
    confidence: "الثقة",
    teacherNote: "ملاحظات المعلم",
    feedbackPlaceholder: "اكتب ملاحظة محددة ومشجعة للطالب…",
    saveFeedback: "حفظ الملاحظة",
    noFeedback: "لا توجد ملاحظات محفوظة على هذا الجهاز.",
    noAssignments: "لا توجد واجبات بعد.",
    ratingHint: "بعد التسميع من الذاكرة، قيّم تذكرك لهذا النطاق. ستتوزع المراجعات على أيام مختلفة.",
    translationHint: "الترجمة لتقريب المعنى؛ تعلّم النطق والتلاوة من معلم مؤهل.",
    dataNote: "هذه نسخة أولية تعمل في المتصفح، ولا تزامن البيانات بين حساب الطالب والمعلم بعد.",
    savedOn: "محفوظ محليًا",
    assignedRange: "النطاق",
    ayah: "آية",
    ayahs: "آيات",
    overview: "خطة هادئة ومنظمة للحفظ",
    day: "يوم",
    days: "أيام",
    noneDue: "لا توجد آيات مستحقة للمراجعة اليوم في هذا النطاق.",
    playAyah: "استمع لهذه الآية",
    reciter: "القارئ: مشاري العفاسي",
  },
} as const;

type LocaleCopy = (typeof copy)[keyof typeof copy];

function verseKey(surah: number, ayah: number) {
  return `${surah}:${ayah}`;
}

function readSavedStudy(): StoredStudy {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STUDY;
    const parsed = JSON.parse(raw) as Partial<StoredStudy>;
    return {
      reviews: parsed.reviews ?? {},
      bookmarks: parsed.bookmarks ?? [],
      assignments: parsed.assignments ?? [],
      teacherNotes: parsed.teacherNotes ?? [],
    };
  } catch {
    return EMPTY_STUDY;
  }
}

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function shortDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(
    new Date(date),
  );
}

export function MushafReader({ locale }: { locale: string }) {
  const t: LocaleCopy = locale === "ar" ? copy.ar : copy.en;
  const translationLocale = ["ar", "ur", "fr", "id", "tr"].includes(locale)
    ? locale
    : "en";
  const [activeTab, setActiveTab] = useState<"read" | "memorize" | "teacher">("read");
  const [surahNumber, setSurahNumber] = useState(1);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState<ReaderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [fromAyah, setFromAyah] = useState(1);
  const [toAyah, setToAyah] = useState(7);
  const [showTranslation, setShowTranslation] = useState(true);
  const [hideForRecall, setHideForRecall] = useState(false);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [hiddenWords, setHiddenWords] = useState<string[]>([]);
  const [hidePercentage, setHidePercentage] = useState(30);
  const [mushafPage, setMushafPage] = useState(1);
  const [mushafWordKeys, setMushafWordKeys] = useState<string[]>([]);
  const [reviewDueOnly, setReviewDueOnly] = useState(false);
  const [repeatCount, setRepeatCount] = useState(3);
  const [playing, setPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [study, setStudy] = useState<StoredStudy>(EMPTY_STUDY);
  const [storageReady, setStorageReady] = useState(false);
  const [clock, setClock] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [teacherComment, setTeacherComment] = useState("");
  const [rubric, setRubric] = useState({ accuracy: 3, fluency: 3, tajweed: 3, confidence: 3 });
  const audioRef = useRef<HTMLAudioElement>(null);
  const repeatsPlayed = useRef(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setStudy(readSavedStudy());
      setStorageReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const initialize = window.setTimeout(() => setClock(Date.now()), 0);
    const timer = window.setInterval(() => setClock(Date.now()), 60_000);
    return () => {
      window.clearTimeout(initialize);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(study));
    } catch {
      // Keep the live session usable if browser storage is full or disabled.
    }
  }, [study, storageReady]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/quran/surahs", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load surahs");
        return (await response.json()) as { surahs: Surah[] };
      })
      .then((result) => setSurahs(result.surahs))
      .catch(() => {
        if (!controller.signal.aborted) setSurahs([]);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/quran/surah/${surahNumber}?locale=${translationLocale}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load surah");
        return (await response.json()) as ReaderData;
      })
      .then((result) => {
        setData(result);
        setToAyah(result.surah.numberOfAyahs);
        setMushafPage(result.ayahs[0]?.pageNumber ?? 1);
        setHideForRecall(false);
        setHiddenWords([]);
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoadError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [surahNumber, translationLocale, reloadKey]);

  const dueKeys = useMemo(() => {
    return Object.entries(study.reviews)
      .filter(([, record]) => clock > 0 && new Date(record.nextReviewAt).getTime() <= clock)
      .map(([key]) => key);
  }, [study.reviews, clock]);

  const selectedAyahs = useMemo(() => {
    if (!data) return [];
    return data.ayahs.filter((ayah) => {
      if (ayah.numberInSurah < fromAyah || ayah.numberInSurah > toAyah) return false;
      return !reviewDueOnly || dueKeys.includes(verseKey(surahNumber, ayah.numberInSurah));
    });
  }, [data, fromAyah, toAyah, reviewDueOnly, dueKeys, surahNumber]);

  const availableMushafWords = useMemo(() => mushafWordKeys.filter((key) => {
    const [surah, ayah] = key.split(":").map(Number);
    return surah === surahNumber && ayah >= fromAyah && ayah <= toAyah;
  }), [mushafWordKeys, surahNumber, fromAyah, toAyah]);

  const currentAudioVerse = selectedAyahs[currentIndex];
  const trackedCount = Object.keys(study.reviews).length;
  const dueForSurah = dueKeys.filter((key) => key.startsWith(`${surahNumber}:`)).length;
  const bookmarkCount = study.bookmarks.length;

  useEffect(() => {
    if (!playing || !currentAudioVerse?.audio || !audioRef.current) return;
    const player = audioRef.current;
    player.src = currentAudioVerse.audio;
    player.load();
    void player.play().catch(() => setPlaying(false));
  }, [playing, currentAudioVerse]);

  function startPlayback(index = 0) {
    if (!selectedAyahs[index]?.audio) return;
    repeatsPlayed.current = 0;
    setCurrentIndex(index);
    setPlaying(true);
  }

  function finishCurrentAyah() {
    repeatsPlayed.current += 1;
    if (repeatsPlayed.current < repeatCount) {
      audioRef.current?.play().catch(() => setPlaying(false));
      return;
    }
    repeatsPlayed.current = 0;
    if (currentIndex < selectedAyahs.length - 1) setCurrentIndex((index) => index + 1);
    else setPlaying(false);
  }

  function toggleBookmark(ayahNumber: number) {
    const key = verseKey(surahNumber, ayahNumber);
    setStudy((current) => ({
      ...current,
      bookmarks: current.bookmarks.includes(key)
        ? current.bookmarks.filter((saved) => saved !== key)
        : [...current.bookmarks, key],
    }));
  }

  function changeSurah(number: number) {
    setLoading(true);
    setLoadError(false);
    setData(null);
    setPlaying(false);
    setReviewDueOnly(false);
    setFromAyah(1);
    setToAyah(1);
    setCurrentIndex(0);
    setRevealed([]);
    setHiddenWords([]);
    setHideForRecall(false);
    setMushafWordKeys([]);
    setSurahNumber(number);
  }

  function retryLoad() {
    setLoading(true);
    setLoadError(false);
    setReloadKey((key) => key + 1);
  }

  function createWordChallenge() {
    const words = [...availableMushafWords];
    // Fisher–Yates gives each word an equal chance of being selected.
    for (let index = words.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [words[index], words[swapIndex]] = [words[swapIndex], words[index]];
    }
    const count = Math.min(words.length, Math.max(1, Math.round((words.length * hidePercentage) / 100)));
    const hiddenSet = new Set(words.slice(0, count));
    // Keep reveal order aligned with the printed page while the selection stays random.
    setHiddenWords(availableMushafWords.filter((key) => hiddenSet.has(key)));
    setRevealed([]);
    setHideForRecall(true);
  }

  function revealWord(key: string) {
    setHiddenWords((current) => current.filter((word) => word !== key));
  }

  const handleMushafWordsLoaded = useCallback((keys: string[]) => setMushafWordKeys(keys), []);

  function changeMushafPage(page: number) {
    setMushafPage(Math.max(1, Math.min(604, page)));
    setHideForRecall(false);
    setHiddenWords([]);
    setRevealed([]);
  }

  function recordReview(rating: ReviewRecord["rating"]) {
    const now = new Date().toISOString();
    setStudy((current) => {
      const reviews = { ...current.reviews };
      for (const ayah of selectedAyahs) {
        const key = verseKey(surahNumber, ayah.numberInSurah);
        const previous = reviews[key]?.reviews ?? 0;
        const nextCount = rating === "again" ? 0 : previous + 1;
        const step = rating === "easy" ? nextCount + 1 : nextCount;
        const days = rating === "again"
          ? 1
          : rating === "hard"
            ? REVIEW_INTERVALS[Math.max(0, Math.min(nextCount - 1, REVIEW_INTERVALS.length - 1))]
            : REVIEW_INTERVALS[Math.min(step - 1, REVIEW_INTERVALS.length - 1)];
        reviews[key] = {
          reviews: nextCount,
          nextReviewAt: addDays(days),
          lastReviewedAt: now,
          rating,
        };
      }
      return { ...current, reviews };
    });
    setReviewMessage(t.reviewSaved);
    setReviewDueOnly(false);
  }

  function addAssignment() {
    if (!data) return;
    const title = assignmentTitle.trim() || `${data.surah.englishName}, ${t.from} ${fromAyah}–${toAyah}`;
    const assignment: StudyAssignment = {
      id: crypto.randomUUID(),
      title,
      surah: surahNumber,
      fromAyah,
      toAyah,
      createdAt: new Date().toISOString(),
    };
    setStudy((current) => ({ ...current, assignments: [assignment, ...current.assignments] }));
    setAssignmentTitle("");
  }

  function saveTeacherNote() {
    if (!teacherComment.trim()) return;
    const note: TeacherNote = {
      id: crypto.randomUUID(),
      surah: surahNumber,
      fromAyah,
      toAyah,
      ...rubric,
      note: teacherComment.trim(),
      createdAt: new Date().toISOString(),
    };
    setStudy((current) => ({ ...current, teacherNotes: [note, ...current.teacherNotes] }));
    setTeacherComment("");
  }

  function selectDueAyahs() {
    const dueInCurrentSurah = dueKeys
      .map((key) => Number(key.split(":")[1]))
      .filter((number) => keyIsSurah(dueKeys, number, surahNumber))
      .sort((a, b) => a - b);
    if (dueInCurrentSurah.length === 0) {
      setReviewMessage(t.noneDue);
      return;
    }
    setFromAyah(dueInCurrentSurah[0]);
    setToAyah(dueInCurrentSurah[dueInCurrentSurah.length - 1]);
    setReviewDueOnly(true);
    setReviewMessage("");
    setActiveTab("memorize");
  }

  const uiSurahName = data ? `${data.surah.englishName} · ${data.surah.name}` : "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8" dir={locale === "ar" || locale === "ur" ? "rtl" : "ltr"}>
      <div className="mb-6 overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#163d30_0%,#28634a_62%,#66815d_100%)] p-5 text-white shadow-lg shadow-emerald-950/10 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold text-emerald-100">{t.overview}</p>
            <h1 className="font-arabic text-3xl font-bold leading-tight sm:text-4xl">{t.title}</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-emerald-50/90 sm:text-base">{t.subtitle}</p>
          </div>
          <div className="grid min-w-56 grid-cols-3 gap-2 rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-sm">
            <div><strong className="block text-2xl">{dueKeys.length}</strong><span className="text-xs text-emerald-100">{t.due}</span></div>
            <div><strong className="block text-2xl">{trackedCount}</strong><span className="text-xs text-emerald-100">{t.saved}</span></div>
            <div><strong className="block text-2xl">{bookmarkCount}</strong><span className="text-xs text-emerald-100">{t.bookmarks}</span></div>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-2 text-xs text-emerald-100">
          <span aria-hidden="true" className="size-2 rounded-full bg-lime-300" />{t.local}
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2 rounded-2xl border border-[var(--border)] bg-white p-2 shadow-sm">
        {([
          ["read", t.read],
          ["memorize", t.memorize],
          ["teacher", t.teacher],
        ] as const).map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`min-h-11 flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-colors sm:flex-none ${activeTab === tab ? "bg-[var(--accent)] text-white" : "text-[var(--muted)] hover:bg-[var(--surface-soft)]"}`}
            aria-pressed={activeTab === tab}
          >{label}</button>
        ))}
      </div>

      <div className={`grid items-start gap-5 ${activeTab === "memorize" ? "lg:grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_19rem]"}`}>
        <main className="min-w-0">
          <section className="mb-4 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm sm:p-5" aria-label={t.chooseSurah}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(12rem,1.5fr)_1fr_1fr_auto] lg:items-end">
              <label className="grid gap-1.5 text-sm font-semibold text-[var(--ink)]">
                {t.chooseSurah}
            <select
                  value={surahNumber}
                  onChange={(event) => changeSurah(Number(event.target.value))}
                  className="h-12 min-w-0 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-sm font-medium"
                >
                  {(surahs.length ? surahs : Array.from({ length: 114 }, (_, index) => ({ number: index + 1, name: "", englishName: `Surah ${index + 1}`, englishNameTranslation: "", numberOfAyahs: 1, revelationType: "" }))).map((surah) => (
                    <option value={surah.number} key={surah.number}>{surah.number}. {locale === "ar" ? `${surah.name} · ${surah.englishName}` : `${surah.englishName} · ${surah.englishNameTranslation}`}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-[var(--ink)]">
                {t.from}
                <input type="number" min={1} max={data?.surah.numberOfAyahs ?? 1} value={fromAyah}
                  onChange={(event) => { const nextFromAyah = Math.max(1, Math.min(Number(event.target.value), toAyah)); setPlaying(false); setCurrentIndex(0); setFromAyah(nextFromAyah); const page = data?.ayahs.find((ayah) => ayah.numberInSurah === nextFromAyah)?.pageNumber; if (page) changeMushafPage(page); setReviewDueOnly(false); }}
                  className="h-12 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-sm" />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-[var(--ink)]">
                {t.to}
                <input type="number" min={fromAyah} max={data?.surah.numberOfAyahs ?? 1} value={toAyah}
                  onChange={(event) => { setPlaying(false); setCurrentIndex(0); setToAyah(Math.max(fromAyah, Math.min(Number(event.target.value), data?.surah.numberOfAyahs ?? 1))); setReviewDueOnly(false); }}
                  className="h-12 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-sm" />
              </label>
              <button type="button" onClick={selectDueAyahs} className="h-12 rounded-xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--accent)] hover:bg-[var(--surface-soft)]">
                {t.reviewDue}{dueForSurah > 0 ? ` · ${dueForSurah}` : ""}
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-3">
              <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm text-[var(--muted)]">
                <input type="checkbox" checked={showTranslation} onChange={(event) => setShowTranslation(event.target.checked)} className="size-4 accent-[var(--accent)]" />
                {t.translation}
              </label>
              {reviewDueOnly && <button type="button" onClick={() => setReviewDueOnly(false)} className="text-sm font-semibold text-[var(--accent)] underline">{t.clearDue}</button>}
            </div>
          </section>

          {loading && <div className="rounded-2xl border border-[var(--border)] bg-white p-8 text-center text-[var(--muted)]" role="status">{t.loading}</div>}
          {loadError && !loading && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center" role="alert">
              <p className="font-semibold text-rose-900">{t.unavailable}</p>
              <button type="button" onClick={retryLoad} className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-rose-800 shadow-sm">{t.retry}</button>
            </div>
          )}

          {data && !loading && (
            <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-[1.75rem] border-[5px] border-double border-[#c9ad71] bg-[#fffefa] shadow-[0_18px_60px_-34px_rgba(72,48,18,0.45)]" aria-label={uiSurahName}>
              <div className="border-b border-[var(--border)] bg-[var(--surface-soft)]/70 px-5 py-5 text-center sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">Surah {data.surah.number} · {data.surah.revelationType}</p>
                <h2 className="mt-1 font-arabic text-3xl font-bold text-[var(--accent)] sm:text-4xl" lang="ar" dir="rtl" translate="no">{data.surah.name}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{data.surah.englishName} · {data.surah.englishNameTranslation} · {data.surah.numberOfAyahs} {t.ayahs}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dfd1ae] bg-[#fffdf5] px-3 py-3 sm:px-6">
                <button type="button" onClick={() => changeMushafPage(mushafPage - 1)} disabled={mushafPage <= 1} aria-label={t.previousPage} className="min-h-11 rounded-xl border border-[#dfd1ae] px-3 text-sm font-semibold text-[var(--accent)] disabled:opacity-40">{locale === "ar" ? "→" : "←"} {t.previousPage}</button>
                <label className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">{t.mushafPage}
                  <input type="number" min={1} max={604} value={mushafPage} onChange={(event) => changeMushafPage(Number(event.target.value))} className="h-11 w-20 rounded-xl border border-[#dfd1ae] bg-white px-2 text-center text-sm text-[var(--ink)]" /> <span>/ 604</span>
                </label>
                <button type="button" onClick={() => changeMushafPage(mushafPage + 1)} disabled={mushafPage >= 604} aria-label={t.nextPage} className="min-h-11 rounded-xl border border-[#dfd1ae] px-3 text-sm font-semibold text-[var(--accent)] disabled:opacity-40">{t.nextPage} {locale === "ar" ? "←" : "→"}</button>
              </div>
              <div className="p-2 sm:p-5">
                <MushafPageView page={mushafPage} hiddenWords={hiddenWords} allowedWordKeys={availableMushafWords} challengeActive={hideForRecall} onWordsLoaded={handleMushafWordsLoaded} loadingLabel={t.loadingMushaf} errorLabel={t.mushafUnavailable} locale={locale} />
                {hideForRecall && <p className="mx-auto mt-3 max-w-3xl text-center text-xs leading-5 text-[var(--muted)]">{locale === "ar" ? "اضغط على مواضع الكلمات المخفية للكشف عنها؛ مواضع السطور لا تتغير." : "Tap a hidden word to reveal it. The printed line layout stays in place."}</p>}
              </div>
              <details className="border-t border-[var(--border)] px-4 py-3 sm:px-7">
                <summary className="min-h-10 cursor-pointer py-2 text-sm font-semibold text-[var(--accent)]">{t.verseTextDetails}</summary>
              <div className="divide-y divide-[var(--border)]">
                {selectedAyahs.map((ayah, index) => {
                  const key = verseKey(surahNumber, ayah.numberInSurah);
                  const bookmarked = study.bookmarks.includes(key);
                  const review = study.reviews[key];
                  const isRevealed = revealed.includes(ayah.numberInSurah);
                  const textHidden = hideForRecall && !isRevealed;
                  const verseWords = ayah.text.trim().split(/\s+/);

                  return (
                    <article key={ayah.numberInSurah} className={`py-5 sm:py-6 ${currentAudioVerse?.numberInSurah === ayah.numberInSurah && playing ? "bg-emerald-50/70" : ""}`}>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-white text-xs font-semibold text-[var(--accent)]" aria-label={`${t.ayah} ${ayah.numberInSurah}`}>{ayah.numberInSurah}</span>
                        <div className="flex items-center gap-1.5">
                          <button type="button" aria-label={t.playAyah} disabled={!ayah.audio} onClick={() => startPlayback(index)} className="inline-flex size-10 items-center justify-center rounded-full text-[var(--accent)] hover:bg-[var(--surface-soft)] disabled:opacity-40">
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor"><path d="M8 5.7c0-.8.9-1.3 1.6-.9l9.1 5.3a1.1 1.1 0 0 1 0 1.8l-9.1 5.3c-.7.4-1.6-.1-1.6-.9V5.7Z" /></svg>
                          </button>
                          <button type="button" aria-label={bookmarked ? t.removeBookmark : t.bookmark} aria-pressed={bookmarked} onClick={() => toggleBookmark(ayah.numberInSurah)} className={`inline-flex size-10 items-center justify-center rounded-full hover:bg-[var(--surface-soft)] ${bookmarked ? "text-amber-600" : "text-[var(--muted)]"}`}>
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M6.8 4.8h10.4c.6 0 1 .4 1 1v14l-6.2-3.8-6.2 3.8v-14c0-.6.4-1 1-1Z" /></svg>
                          </button>
                        </div>
                      </div>

                      <p className="font-arabic rounded-xl border border-[#dfd1ae] bg-[#fffdf5] px-4 py-5 text-[clamp(1.8rem,5vw,3rem)] leading-[2.15] text-[var(--ink)] shadow-inner sm:px-8 sm:py-7 sm:leading-[2.2] lg:px-12" dir="rtl" lang="ar" translate="no">
                        {textHidden ? verseWords.map((word, wordIndex) => {
                          const wordKey = `${surahNumber}:${ayah.numberInSurah}:${wordIndex + 1}`;
                          const concealed = hiddenWords.includes(wordKey);
                          return <span key={wordKey} className="inline whitespace-pre-wrap">{wordIndex > 0 ? " " : ""}{concealed ? <button type="button" aria-label={locale === "ar" ? "إظهار الكلمة" : "Reveal word"} onClick={() => revealWord(wordKey)} className="rounded-sm bg-amber-100/90 text-transparent underline decoration-amber-400 decoration-dotted underline-offset-4 focus-visible:outline-2 focus-visible:outline-amber-700">{word}</button> : word}</span>;
                        }) : ayah.text}
                      </p>
                      {textHidden && <button type="button" onClick={() => setRevealed((current) => [...current, ayah.numberInSurah])} className="mt-2 min-h-10 rounded-lg px-2 text-sm font-semibold text-[var(--accent)] underline">{t.reveal}</button>}
                      {showTranslation && !textHidden && <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">{ayah.translation}</p>}
                      {review && <p className="mt-2 text-xs text-[var(--accent)]">{t.savedOn}: {shortDate(review.nextReviewAt, locale)}</p>}
                    </article>
                  );
                })}
                {reviewDueOnly && selectedAyahs.length === 0 && <p className="py-10 text-center text-sm text-[var(--muted)]">{t.noneDue}</p>}
              </div>
              <p className="border-t border-[var(--border)] bg-white px-4 py-3 text-xs leading-6 text-[var(--muted)] sm:px-7">{t.translationHint}<br /><a href="https://alquran.cloud/api" target="_blank" rel="noreferrer" className="font-medium text-[var(--accent)] underline">{t.provider}</a> · {t.attribution}: {data.translationSource}. {locale === "ar" ? "صفحة مصحف المدينة وعناصر الكلمات من Quran.ws، برسم مجمع الملك فهد." : "Madinah Mushaf page and word assets from Quran.ws; artwork by King Fahd Complex."}</p>
              </details>
            </section>
          )}
        </main>

        <aside className="grid gap-4 lg:sticky lg:top-24">
          {(activeTab === "read" || activeTab === "memorize") && (
            <>
              <section className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm sm:p-5">
                <h2 className="font-semibold text-[var(--ink)]">{activeTab === "read" ? t.read : t.memorize}</h2>
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{t.reciter}</p>
                <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                  <button type="button" onClick={() => playing ? setPlaying(false) : startPlayback(0)} disabled={!selectedAyahs.some((ayah) => ayah.audio)} className="min-h-11 rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] disabled:opacity-50">
                    {playing ? t.pause : t.play}
                  </button>
                  <label className="grid gap-0.5 text-[10px] font-semibold text-[var(--muted)]">
                    {t.repeat}
                    <select value={repeatCount} onChange={(event) => setRepeatCount(Number(event.target.value))} className="h-11 rounded-xl border border-[var(--border)] bg-white px-2 text-sm text-[var(--ink)]">
                      <option value={1}>×1</option><option value={3}>×3</option><option value={5}>×5</option>
                    </select>
                  </label>
                </div>
                <audio ref={audioRef} hidden preload="none" onEnded={finishCurrentAyah} onError={() => setPlaying(false)} />
                {activeTab === "memorize" && <>
                  <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                    <label className="grid gap-1 text-xs font-semibold text-[var(--muted)]">{t.hidePercent}
                      <select value={hidePercentage} onChange={(event) => setHidePercentage(Number(event.target.value))} className="h-11 rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-[var(--ink)]"><option value={20}>20%</option><option value={30}>30%</option><option value={50}>50%</option><option value={70}>70%</option><option value={80}>80%</option><option value={90}>90%</option><option value={100}>100%</option></select>
                    </label>
                    <button type="button" onClick={createWordChallenge} disabled={!availableMushafWords.length} className="mt-5 min-h-11 rounded-xl bg-amber-100 px-3 text-xs font-semibold text-amber-950 hover:bg-amber-200 disabled:opacity-50">{hideForRecall ? t.reshuffleWords : t.hideWords}</button>
                  </div>
                  {hideForRecall && <div className="mt-2 grid gap-2">
                    <button type="button" onClick={() => setHiddenWords((current) => { const next = current.find((key) => availableMushafWords.includes(key)); return next ? current.filter((key) => key !== next) : current; })} disabled={!hiddenWords.some((key) => availableMushafWords.includes(key))} className="min-h-12 w-full rounded-xl bg-emerald-800 px-4 text-sm font-bold text-white shadow-sm hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50">{t.showNextWord}</button>
                    <div className="flex items-center justify-between gap-2 text-xs text-[var(--muted)]"><span>{hiddenWords.filter((key) => availableMushafWords.includes(key)).length} {t.wordsHidden}</span><button type="button" onClick={() => { setHiddenWords([]); setRevealed(selectedAyahs.map((ayah) => ayah.numberInSurah)); }} className="min-h-10 font-semibold text-[var(--accent)] underline">{t.showAllWords}</button></div>
                  </div>}
                  <p className="mt-3 text-xs leading-5 text-[var(--muted)]">{t.ratingHint}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {([["again", t.again], ["hard", t.hard], ["good", t.good], ["easy", t.easy]] as const).map(([rating, label]) => (
                      <button key={rating} type="button" onClick={() => recordReview(rating)} disabled={!selectedAyahs.length} className="min-h-10 rounded-xl border border-[var(--border)] bg-white px-2 text-xs font-semibold text-[var(--ink)] hover:border-[var(--accent)] hover:bg-[var(--surface-soft)] disabled:opacity-40">{label}</button>
                    ))}
                  </div>
                  {reviewMessage && <p role="status" className="mt-3 text-xs leading-5 text-[var(--accent)]">{reviewMessage}</p>}
                </>}
              </section>

              {activeTab === "memorize" && (
                <section className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm sm:p-5">
                  <h2 className="font-semibold text-[var(--ink)]">{t.plan}</h2>
                  <div className="mt-3 flex gap-2">
                    <input value={assignmentTitle} onChange={(event) => setAssignmentTitle(event.target.value)} placeholder={t.assignmentPlaceholder} aria-label={t.assignmentTitle} className="h-11 min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-xs" />
                    <button type="button" onClick={addAssignment} disabled={!data} className="rounded-xl bg-[var(--accent)] px-3 text-xs font-semibold text-white disabled:opacity-50">{t.startPlan}</button>
                  </div>
                  {study.assignments.length === 0 ? <p className="mt-3 text-xs text-[var(--muted)]">{t.emptyPlan}</p> :
                    <ul className="mt-3 grid gap-2">{study.assignments.slice(0, 5).map((assignment) => (
                      <li key={assignment.id} className="rounded-xl bg-[var(--surface-soft)] px-3 py-2 text-xs">
                        <strong className="block text-[var(--ink)]">{assignment.title}</strong>
                        <span className="text-[var(--muted)]">{t.assignedRange}: {assignment.surah}:{assignment.fromAyah}–{assignment.toAyah}</span>
                      </li>
                    ))}</ul>}
                </section>
              )}
            </>
          )}

          {activeTab === "teacher" && (
            <>
              <section className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm sm:p-5">
                <h2 className="font-semibold text-[var(--ink)]">{t.teacher}</h2>
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{t.dataNote}</p>
                <label className="mt-4 grid gap-1.5 text-xs font-semibold text-[var(--ink)]">{t.assignmentTitle}
                  <input value={assignmentTitle} onChange={(event) => setAssignmentTitle(event.target.value)} placeholder={t.assignmentPlaceholder} className="h-11 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-sm font-normal" />
                </label>
                <button type="button" onClick={addAssignment} disabled={!data} className="mt-2 min-h-11 w-full rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold text-white disabled:opacity-50">{t.assign}</button>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {([["accuracy", t.accuracy], ["fluency", t.fluency], ["tajweed", t.tajweed], ["confidence", t.confidence]] as const).map(([key, label]) => (
                    <label key={key} className="grid gap-1 text-xs font-semibold text-[var(--muted)]">{label}
                      <select value={rubric[key]} onChange={(event) => setRubric((current) => ({ ...current, [key]: Number(event.target.value) }))} className="h-10 rounded-lg border border-[var(--border)] bg-white px-2 text-sm text-[var(--ink)]">
                        <option value={1}>1 / 4</option><option value={2}>2 / 4</option><option value={3}>3 / 4</option><option value={4}>4 / 4</option>
                      </select>
                    </label>
                  ))}
                </div>
                <label className="mt-4 grid gap-1.5 text-xs font-semibold text-[var(--ink)]">{t.teacherNote}
                  <textarea value={teacherComment} onChange={(event) => setTeacherComment(event.target.value)} rows={4} placeholder={t.feedbackPlaceholder} className="resize-y rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm font-normal leading-6" />
                </label>
                <button type="button" onClick={saveTeacherNote} disabled={!teacherComment.trim()} className="mt-2 min-h-11 w-full rounded-xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--accent)] hover:bg-[var(--surface-soft)] disabled:opacity-50">{t.saveFeedback}</button>
              </section>

              <section className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm sm:p-5">
                <h2 className="font-semibold text-[var(--ink)]">{t.teacherNote}</h2>
                {study.teacherNotes.length === 0 ? <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{t.noFeedback}</p> :
                  <ul className="mt-3 grid gap-3">{study.teacherNotes.slice(0, 5).map((note) => (
                    <li key={note.id} className="rounded-xl bg-[var(--surface-soft)] p-3 text-xs">
                      <p className="font-semibold text-[var(--accent)]">{note.surah}:{note.fromAyah}–{note.toAyah} · {shortDate(note.createdAt, locale)}</p>
                      <p className="mt-1 leading-5 text-[var(--ink)]">{note.note}</p>
                      <p className="mt-2 text-[var(--muted)]">{t.accuracy} {note.accuracy}/4 · {t.fluency} {note.fluency}/4 · {t.tajweed} {note.tajweed}/4 · {t.confidence} {note.confidence}/4</p>
                    </li>
                  ))}</ul>}
                <h3 className="mt-5 font-semibold text-[var(--ink)]">{t.plan}</h3>
                {study.assignments.length === 0 ? <p className="mt-2 text-xs text-[var(--muted)]">{t.noAssignments}</p> :
                  <ul className="mt-2 grid gap-2">{study.assignments.slice(0, 6).map((assignment) => (
                    <li key={assignment.id} className="rounded-lg border border-[var(--border)] p-2 text-xs"><strong>{assignment.title}</strong><span className="block text-[var(--muted)]">{t.assignedRange}: {assignment.surah}:{assignment.fromAyah}–{assignment.toAyah}</span></li>
                  ))}</ul>}
              </section>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

function keyIsSurah(keys: string[], ayahNumber: number, surahNumber: number) {
  return keys.includes(verseKey(surahNumber, ayahNumber));
}

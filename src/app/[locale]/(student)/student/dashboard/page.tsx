import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authorization";

type Props = {
  params: Promise<{ locale: string }>;
};

const words = {
  ar: {
    eyebrow: "مساحة التعلّم الخاصة بك",
    welcome: "أهلًا بك،",
    subtitle: "خطوة صغيرة كل يوم تصنع فرقًا كبيرًا في رحلتك مع القرآن واللغة العربية.",
    openMushaf: "افتح المصحف",
    continueLearning: "تابع التعلّم",
    continueHint: "اختر مسارك وابدأ من المكان الذي يناسبك اليوم.",
    quran: "حفظ القرآن",
    quranText: "احفظ وردك وراجع ما أتقنته خطوة بخطوة.",
    arabic: "التأسيس العربي",
    arabicText: "تعلّم الحروف والحركات والقراءة بالتدرّج.",
    tajweed: "أحكام التجويد",
    tajweedText: "تعرّف على أحكام التلاوة وتدرّب عليها.",
    mushaf: "المصحف التفاعلي",
    mushafText: "اقرأ من المصحف وتدرّب على استرجاع الكلمات.",
    progress: "تقدم الدروس",
    completed: "دروس مكتملة",
    assignments: "واجبات الحفظ",
    nextClass: "الحصة القادمة",
    totalLessons: "من أصل {count} درسًا مسجلًا",
    noLessons: "ابدأ مسارك التعليمي لتظهر إنجازاتك هنا.",
    upcoming: "خطتك القادمة",
    upcomingHint: "واجبات الحفظ والحصص القادمة من معلمك.",
    noAssignments: "لا توجد واجبات حفظ مسجلة حاليًا.",
    surah: "السورة {number} · الآيات {from}–{to}",
    due: "موعد التسميع",
    session: "درس مباشر",
    noSession: "لا توجد حصة قادمة مجدولة.",
    progressLink: "عرض سجل التقدم",
    percent: "مكتمل",
  },
  en: {
    eyebrow: "YOUR LEARNING SPACE",
    welcome: "Welcome,",
    subtitle: "A small step every day makes a lasting difference in your Quran and Arabic journey.",
    openMushaf: "Open the Mushaf",
    continueLearning: "Continue learning",
    continueHint: "Choose a path and start with what feels right for today.",
    quran: "Quran memorization",
    quranText: "Memorize your portion and review what you have learned.",
    arabic: "Arabic foundation",
    arabicText: "Build reading skills through letters, vowels, and practice.",
    tajweed: "Tajweed",
    tajweedText: "Learn recitation rules and practise them step by step.",
    mushaf: "Interactive Mushaf",
    mushafText: "Read from the Mushaf and practise recalling hidden words.",
    progress: "Lesson progress",
    completed: "Lessons completed",
    assignments: "Hifz assignments",
    nextClass: "Next class",
    totalLessons: "of {count} enrolled lessons",
    noLessons: "Start a learning path to see your achievements here.",
    upcoming: "Coming up",
    upcomingHint: "Memorization assignments and classes from your teacher.",
    noAssignments: "No memorization assignments yet.",
    surah: "Surah {number} · verses {from}–{to}",
    due: "Recitation due",
    session: "Live lesson",
    noSession: "No upcoming class is scheduled.",
    progressLink: "View progress history",
    percent: "complete",
  },
} as const;

function BookIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.5c-2.1-1.7-5-2-8-1.2v13c3-.8 5.9-.5 8 1.2m0-13c2.1-1.7 5-2 8-1.2v13c-3-.8-5.9-.5-8 1.2m0-13v13" />
    </svg>
  );
}

function StatCard({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: string }) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
        <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-lg text-[var(--accent)]">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">{value}</p>
      <p className="mt-1 text-xs text-[var(--muted)]">{detail}</p>
    </article>
  );
}

export default async function StudentDashboardPage({ params }: Props) {
  const { locale } = await params;
  const session = await requireRole(locale, ["STUDENT"]);
  setRequestLocale(locale);
  const t = words[locale as keyof typeof words] ?? words.en;

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  const [enrollments, progressRows, assignmentCount, assignments, upcomingSessions] = profile
    ? await Promise.all([
        prisma.enrollment.findMany({
          where: { studentId: profile.id },
          select: { course: { select: { lessons: { select: { id: true } } } } },
        }),
        prisma.lessonProgress.findMany({
          where: { studentId: profile.id },
          select: { lessonId: true, status: true },
        }),
        prisma.hifzAssignment.count({ where: { studentId: profile.id } }),
        prisma.hifzAssignment.findMany({
          where: { studentId: profile.id },
          orderBy: [{ dueAt: "asc" }],
          take: 3,
          select: { id: true, surahNumber: true, fromAyah: true, toAyah: true, dueAt: true },
        }),
        prisma.liveSessionStudent.findMany({
          where: { studentId: profile.id, session: { startsAt: { gte: new Date() } } },
          orderBy: { session: { startsAt: "asc" } },
          take: 1,
          select: { session: { select: { id: true, topic: true, startsAt: true, durationMinutes: true } } },
        }),
      ])
    : [[], [], 0, [], []] as const;

  const enrolledLessonIds = new Set(enrollments.flatMap((enrollment) => enrollment.course.lessons.map((lesson) => lesson.id)));
  const totalLessonCount = enrolledLessonIds.size;
  const completedLessonCount = progressRows.filter(
    (progress) => enrolledLessonIds.has(progress.lessonId) && progress.status === "COMPLETED",
  ).length;
  const progressPercent = totalLessonCount ? Math.round((completedLessonCount / totalLessonCount) * 100) : 0;
  const nextSession = upcomingSessions[0]?.session;
  const dateLocale = locale === "ar" ? "ar-EG" : locale;
  const nextSessionTime = nextSession
    ? new Intl.DateTimeFormat(dateLocale, { dateStyle: "medium", timeStyle: "short" }).format(nextSession.startsAt)
    : null;

  const cards = [
    { href: "/learn/quran/hifz", title: t.quran, description: t.quranText, icon: "۞", className: "bg-[#eaf2eb]" },
    { href: "/learn/noor-bayan", title: t.arabic, description: t.arabicText, icon: "ا", className: "bg-[#f4efe3]" },
    { href: "/learn/quran/tajweed", title: t.tajweed, description: t.tajweedText, icon: "◌", className: "bg-[#eef0f8]" },
    { href: "/learn/quran/mushaf", title: t.mushaf, description: t.mushafText, icon: "▤", className: "bg-[#f5edf0]" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0d5545] via-[#0c5949] to-[#143b35] px-5 py-7 text-white shadow-xl shadow-emerald-950/10 sm:px-8 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -end-16 -top-20 -z-10 size-64 rounded-full border-[28px] border-white/[0.06] sm:size-80" />
        <p className="text-xs font-semibold tracking-[0.18em] text-emerald-100/80">{t.eyebrow}</p>
        <div className="mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.welcome} {session.user.name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/85 sm:text-base">{t.subtitle}</p>
          </div>
          <Link href="/learn/quran/mushaf" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#174d3e] shadow-sm transition hover:bg-emerald-50">
            <BookIcon className="size-5" />
            {t.openMushaf}
          </Link>
        </div>
      </section>

      <section aria-label={t.progress} className="mt-5 grid gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard label={t.progress} value={`${progressPercent}%`} detail={totalLessonCount ? t.totalLessons.replace("{count}", String(totalLessonCount)) : t.noLessons} icon="◔" />
        <StatCard label={t.completed} value={String(completedLessonCount)} detail={t.continueHint} icon="✓" />
        <StatCard label={t.assignments} value={String(assignmentCount)} detail={assignmentCount ? t.upcomingHint : t.noAssignments} icon="⌖" />
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{t.continueLearning}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{t.continueHint}</p>
          </div>
          <Link href="/student/progress" className="text-sm font-semibold text-[var(--accent)] underline underline-offset-4">{t.progressLink}</Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className="group flex min-h-48 flex-col rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <span aria-hidden="true" className={`flex size-12 items-center justify-center rounded-2xl text-2xl font-semibold text-[var(--accent)] ${card.className}`}>{card.icon}</span>
              <h3 className="mt-4 font-semibold text-[var(--ink)] group-hover:text-[var(--accent)]">{card.title}</h3>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{card.description}</p>
              <span className="mt-auto pt-4 text-xs font-semibold text-[var(--accent)]">{t.continueLearning} <span aria-hidden="true">↗</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">{t.upcoming}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{t.upcomingHint}</p>
            </div>
            <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-[var(--accent)]">◷</span>
          </div>
          <div className="mt-5 space-y-3">
            {assignments.length ? assignments.map((assignment) => (
              <div key={assignment.id} className="flex flex-col gap-2 rounded-xl bg-[var(--surface-soft)]/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-medium">{t.surah.replace("{number}", String(assignment.surahNumber)).replace("{from}", String(assignment.fromAyah)).replace("{to}", String(assignment.toAyah))}</p>
                <p className="text-sm text-[var(--muted)]">{assignment.dueAt ? `${t.due}: ${new Intl.DateTimeFormat(dateLocale, { dateStyle: "medium" }).format(assignment.dueAt)}` : t.due}</p>
              </div>
            )) : <p className="rounded-xl bg-[var(--surface-soft)]/70 px-4 py-5 text-sm text-[var(--muted)]">{t.noAssignments}</p>}
          </div>
        </article>

        <article className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">{t.nextClass}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{t.upcomingHint}</p>
            </div>
            <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-[var(--accent)]">◷</span>
          </div>
          {nextSession && nextSessionTime ? (
            <div className="mt-5 rounded-xl bg-[var(--surface-soft)]/70 p-4">
              <p className="font-semibold">{nextSession.topic}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{nextSessionTime}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{nextSession.durationMinutes} min · {t.session}</p>
            </div>
          ) : <p className="mt-5 rounded-xl bg-[var(--surface-soft)]/70 px-4 py-5 text-sm text-[var(--muted)]">{t.noSession}</p>}
        </article>
      </section>
    </main>
  );
}

import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireRole } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { summarizeQuranProgress } from "@/lib/quran-progress-summary";

type Props = { params: Promise<{ locale: string }> };

export default async function TeacherDashboardPage({ params }: Props) {
  const { locale } = await params;
  const session = await requireRole(locale, ["TEACHER"]);
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");
  const students = await prisma.studentProfile.findMany({
    where: { teacherId: session.user.id },
    select: {
      id: true,
      user: { select: { displayName: true } },
      quranActivities: {
        orderBy: { createdAt: "desc" }, take: 100,
        select: { activityType: true, surahNumber: true, fromAyah: true, toAyah: true, durationSeconds: true, selfRating: true, createdAt: true },
      },
    },
    orderBy: { user: { displayName: "asc" } },
  });
  const isArabic = locale === "ar";

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6" dir={isArabic ? "rtl" : "ltr"}>
      <p className="text-sm font-semibold text-emerald-800">{isArabic ? "متابعة طلابك" : "Your students"}</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900">{t("teacher")}</h1>
      <p className="mt-2 text-sm text-stone-600">{isArabic ? "نشاط القراءة والمراجعة المسجل في المصحف للطلاب المرتبطين بك." : "Mushaf reading and review activity for students assigned to you."}</p>
      {students.length ? <div className="mt-6 grid gap-4">
        {students.map((student) => <article key={student.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-stone-900">{student.user.displayName}</h2>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">{student.quranActivities.length} {isArabic ? "أنشطة حديثة" : "recent activities"}</span>
          </div>
          {(() => {
            const summary = summarizeQuranProgress(student.quranActivities);
            return <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <p className="rounded-xl bg-stone-50 p-3 text-xs text-stone-600">{isArabic ? "جلسات القراءة" : "Reading sessions"}<strong className="ms-2 text-base text-emerald-900">{summary.readingSessions}</strong></p>
              <p className="rounded-xl bg-stone-50 p-3 text-xs text-stone-600">{isArabic ? "آيات تمت متابعتها" : "Ayahs covered"}<strong className="ms-2 text-base text-emerald-900">{summary.uniqueAyahs}</strong></p>
              <p className="rounded-xl bg-stone-50 p-3 text-xs text-stone-600">{isArabic ? "التقييم الذاتي للمراجعة" : "Self-rated review"}<strong className="ms-2 text-base text-emerald-900">{summary.selfRatingPercent === null ? "—" : `${summary.selfRatingPercent}%`}</strong></p>
            </div>;
          })()}
          {student.quranActivities.length ? <ul className="mt-4 grid gap-2">
            {student.quranActivities.map((activity, index) => <li key={`${activity.createdAt.toISOString()}-${index}`} className="flex flex-wrap justify-between gap-2 rounded-xl bg-stone-50 p-3 text-sm">
              <span className="text-stone-800">{activity.activityType === "READING" ? (isArabic ? "قراءة" : "Reading") : activity.activityType === "MEMORIZATION" ? (isArabic ? "تسميع" : "Memorization") : (isArabic ? "مراجعة" : "Review")} · {isArabic ? "السورة" : "Surah"} {activity.surahNumber}, {isArabic ? "الآيات" : "ayahs"} {activity.fromAyah}–{activity.toAyah}{activity.selfRating ? ` · ${isArabic ? "تقييم الطالب" : "Student self-rating"}: ${activity.selfRating}` : ""}</span>
              <time className="text-xs text-stone-500">{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(activity.createdAt)}</time>
            </li>)}
          </ul> : <p className="mt-3 text-sm text-stone-500">{isArabic ? "لا يوجد نشاط مسجل بعد." : "No activity recorded yet."}</p>}
        </article>)}
      </div> : <p className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-600">{isArabic ? "لا يوجد طلاب مرتبطون بحسابك حتى الآن." : "No students are assigned to your account yet."}</p>}
      <p className="mt-5 text-xs leading-5 text-stone-500">{isArabic ? "التقييمات الظاهرة هي تقييم الطالب لنفسه، وليست تحليلًا آليًا لجودة التلاوة." : "Ratings shown are student self-assessments, not automated recitation-quality analysis."}</p>
    </section>
  );
}

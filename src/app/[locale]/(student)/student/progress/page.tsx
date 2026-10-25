import { setRequestLocale } from "next-intl/server";
import { requireRole } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { summarizeQuranProgress } from "@/lib/quran-progress-summary";

type Props = { params: Promise<{ locale: string }> };

const ratingLabel: Record<string, string> = {
  again: "يحتاج مراجعة إضافية", hard: "كان صعبًا", good: "تذكّر جيدًا", easy: "سهل",
};

export default async function ProgressPage({ params }: Props) {
  const { locale } = await params;
  const session = await requireRole(locale, ["STUDENT"]);
  setRequestLocale(locale);
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    select: {
      quranActivities: {
        orderBy: { createdAt: "desc" }, take: 100,
        select: { activityType: true, surahNumber: true, fromAyah: true, toAyah: true, durationSeconds: true, selfRating: true, createdAt: true },
      },
    },
  });
  const activities = profile?.quranActivities ?? [];
  const summary = summarizeQuranProgress(activities);
  const isArabic = locale === "ar";

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6" dir={isArabic ? "rtl" : "ltr"}>
      <p className="text-sm font-semibold text-emerald-800">{isArabic ? "رحلتك مع القرآن" : "Your Quran journey"}</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900">{isArabic ? "تقدّم القراءة والحفظ" : "Reading & memorization progress"}</h1>
      <p className="mt-2 text-sm leading-6 text-stone-600">{isArabic ? "يتحدّث هذا السجل عند إتمام التلاوة أو تسجيل القراءة أو تقييم المراجعة." : "This record updates when you finish a recitation, log reading, or rate a review."}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[[isArabic ? "جلسات القراءة" : "Reading sessions", summary.readingSessions], [isArabic ? "مراجعات الحفظ" : "Memorization reviews", summary.reviewSessions], [isArabic ? "آيات تمت قراءتها أو مراجعتها" : "Ayahs read or reviewed", summary.uniqueAyahs], [isArabic ? "متوسط التقييم الذاتي" : "Average self-rating", summary.selfRatingPercent === null ? "—" : `${summary.selfRatingPercent}%`], [isArabic ? "دقائق الاستماع" : "Listening minutes", summary.listeningMinutes]].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"><p className="text-sm text-stone-600">{label}</p><p className="mt-2 text-3xl font-bold text-emerald-900">{value}</p></div>
        ))}
      </div>
      <h2 className="mt-9 text-xl font-bold text-stone-900">{isArabic ? "النشاط الأخير" : "Recent activity"}</h2>
      {activities.length ? <ul className="mt-3 grid gap-2">
        {activities.map((activity, index) => <li key={`${activity.createdAt.toISOString()}-${index}`} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-stone-200 bg-white p-4 text-sm">
          <div><strong className="text-stone-900">{activity.activityType === "READING" ? (isArabic ? "قراءة" : "Reading") : activity.activityType === "MEMORIZATION" ? (isArabic ? "تسميع" : "Memorization") : (isArabic ? "مراجعة" : "Review")}</strong><span className="ms-2 text-stone-600">{isArabic ? "السورة" : "Surah"} {activity.surahNumber} · {isArabic ? "الآيات" : "Ayahs"} {activity.fromAyah}–{activity.toAyah}</span>
            {activity.selfRating && <span className="ms-2 text-emerald-800">· {isArabic ? ratingLabel[activity.selfRating] ?? "تقييم ذاتي" : `Self-rating: ${activity.selfRating}`}</span>}</div>
          <time className="text-xs text-stone-500">{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(activity.createdAt)}</time>
        </li>)}
      </ul> : <p className="mt-3 rounded-xl bg-stone-50 p-5 text-sm text-stone-600">{isArabic ? "ابدأ القراءة من المصحف، وسيظهر تقدمك هنا." : "Start reading in the Mushaf and your progress will appear here."}</p>}
      <p className="mt-5 text-xs leading-5 text-stone-500">{isArabic ? "عدد الآيات يمثل نطاقات سجلت قراءتها أو مراجعتها وقد يتداخل التكرار. متوسط التقييم ذاتي ولا يقيس دقة النطق تلقائيًا. يستطيع معلمك المرتبط بحسابك الاطلاع على نشاطك." : "Ayah count reflects logged reading or review ranges and may include overlapping sessions. Ratings are self-reported and do not automatically measure pronunciation. Your assigned teacher can view your activity."}</p>
    </section>
  );
}

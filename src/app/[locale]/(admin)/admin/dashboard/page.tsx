import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { requireRole } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ locale: string }> };
const zone = "Africa/Cairo";

function cairoDayKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

function cairoDayStart(dayOffset: number, now: Date) {
  const current = new Intl.DateTimeFormat("en-US", { timeZone: zone, year: "numeric", month: "numeric", day: "numeric" }).formatToParts(now);
  const part = (type: string) => Number(current.find((item) => item.type === type)?.value);
  const day = new Date(Date.UTC(part("year"), part("month") - 1, part("day") + dayOffset));
  const year = day.getUTCFullYear();
  const month = day.getUTCMonth();
  const date = day.getUTCDate();
  const offsetLabel = new Intl.DateTimeFormat("en", { timeZone: zone, timeZoneName: "shortOffset" })
    .formatToParts(new Date(Date.UTC(year, month, date, 12)))
    .find((item) => item.type === "timeZoneName")?.value ?? "GMT+0";
  const match = offsetLabel.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
  const offsetMinutes = match ? (match[1] === "-" ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3] ?? 0)) : 0;
  return new Date(Date.UTC(year, month, date) - offsetMinutes * 60_000);
}

const ratingValue: Record<string, number> = { again: 25, hard: 50, good: 75, easy: 100 };

export default async function AdminDashboardPage({ params }: Props) {
  const { locale } = await params;
  const session = await requireRole(locale, ["ADMIN"]);
  const t = await getTranslations("dashboard");
  const isArabic = locale === "ar";
  const now = new Date();
  const todayStart = cairoDayStart(0, now);
  const tomorrowStart = cairoDayStart(1, now);
  const weekStart = cairoDayStart(-6, now);
  const hourAhead = new Date(now.getTime() + 60 * 60_000);

  const [studentCount, teacherCount, adminCount, unassignedCount, enrollments, sessionsToday, sessionsNextHour, sessionCandidates, upcomingSessions, weeklyActivities, recentActivities, recentUsers] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.studentProfile.count({ where: { teacherId: null } }),
    prisma.enrollment.findMany({ select: { studentId: true, course: { select: { track: true } } } }),
    prisma.liveSession.count({ where: { startsAt: { gte: todayStart, lt: tomorrowStart } } }),
    prisma.liveSession.count({ where: { startsAt: { gte: now, lt: hourAhead } } }),
    prisma.liveSession.findMany({ where: { startsAt: { gte: todayStart, lt: now } }, select: { startsAt: true, durationMinutes: true } }),
    prisma.liveSession.findMany({
      where: { startsAt: { gte: now, lt: tomorrowStart } },
      orderBy: { startsAt: "asc" }, take: 6,
      select: { id: true, startsAt: true, durationMinutes: true, topic: true, teacher: { select: { displayName: true } }, students: { select: { student: { select: { user: { select: { displayName: true } } } } } } },
    }),
    prisma.quranStudyActivity.findMany({ where: { createdAt: { gte: weekStart } }, select: { activityType: true, createdAt: true, durationSeconds: true, selfRating: true, surahNumber: true, fromAyah: true, toAyah: true }, take: 10_000 }),
    prisma.quranStudyActivity.findMany({ orderBy: { createdAt: "desc" }, take: 8, select: { id: true, activityType: true, createdAt: true, surahNumber: true, fromAyah: true, toAyah: true, selfRating: true, student: { select: { user: { select: { displayName: true } } } } } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, displayName: true, role: true, createdAt: true } }),
  ]);

  const quranStudents = new Set<string>();
  const foundationStudents = new Set<string>();
  for (const enrollment of enrollments) {
    if (enrollment.course.track === "QURAN") quranStudents.add(enrollment.studentId);
    if (enrollment.course.track === "NOOR_BAYAN") foundationStudents.add(enrollment.studentId);
  }
  const liveSessions = sessionCandidates.filter((item) => item.startsAt.getTime() + item.durationMinutes * 60_000 > now.getTime()).length;
  const reviewRatings = weeklyActivities.filter((item) => item.activityType === "REVIEW" && item.selfRating && ratingValue[item.selfRating]).map((item) => ratingValue[item.selfRating as string]);
  const selfRatingAverage = reviewRatings.length ? Math.round(reviewRatings.reduce((sum, item) => sum + item, 0) / reviewRatings.length) : null;
  const readingTypes = new Set(["READING"]);
  const reviewTypes = new Set(["REVIEW", "MEMORIZATION"]);
  const dayBuckets = Array.from({ length: 7 }, (_, index) => {
    const dayStart = cairoDayStart(index - 6, now);
    const nextDay = cairoDayStart(index - 5, now);
    return {
      key: cairoDayKey(dayStart),
      label: new Intl.DateTimeFormat(locale, { timeZone: zone, weekday: "short" }).format(dayStart),
      reading: 0,
      reviews: 0,
      minutes: 0,
      start: dayStart,
      end: nextDay,
    };
  });
  const bucketsByKey = new Map(dayBuckets.map((item) => [item.key, item]));
  for (const activity of weeklyActivities) {
    const bucket = bucketsByKey.get(cairoDayKey(activity.createdAt));
    if (!bucket) continue;
    if (readingTypes.has(activity.activityType)) bucket.reading += 1;
    if (reviewTypes.has(activity.activityType)) bucket.reviews += 1;
    bucket.minutes += activity.durationSeconds / 60;
  }
  const activityTotal = weeklyActivities.length;
  const maxChartValue = Math.max(1, ...dayBuckets.map((item) => item.reading + item.reviews));
  const lastActivityTime = (date: Date) => new Intl.DateTimeFormat(locale, { timeZone: zone, dateStyle: "medium", timeStyle: "short" }).format(date);
  const todayLabel = new Intl.DateTimeFormat(locale, { timeZone: zone, dateStyle: "full" }).format(now);
  const upcomingFeed = [
    ...recentActivities.map((activity) => ({
      key: `quran-${activity.id}`,
      date: activity.createdAt,
      title: activity.activityType === "READING"
        ? (isArabic ? `${activity.student.user.displayName} سجّل جلسة قراءة` : `${activity.student.user.displayName} logged a reading session`)
        : (isArabic ? `${activity.student.user.displayName} سجّل مراجعة حفظ` : `${activity.student.user.displayName} logged a memorization review`),
      detail: `${isArabic ? "سورة" : "Surah"} ${activity.surahNumber} · ${isArabic ? "الآيات" : "Ayahs"} ${activity.fromAyah}–${activity.toAyah}${activity.selfRating ? ` · ${isArabic ? "تقييم ذاتي" : "Self-rating"}: ${activity.selfRating}` : ""}`,
      icon: "◉",
    })),
    ...recentUsers.map((user) => ({
      key: `user-${user.id}`,
      date: user.createdAt,
      title: isArabic ? `تم إنشاء حساب ${user.displayName}` : `Account created for ${user.displayName}`,
      detail: isArabic ? `الدور: ${user.role === "STUDENT" ? "طالب" : user.role === "TEACHER" ? "معلم" : user.role === "ADMIN" ? "مدير" : "ولي أمر"}` : `Role: ${user.role.toLowerCase()}`,
      icon: user.role === "TEACHER" ? "✦" : "♙",
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 6);

  const copy = isArabic ? {
    eyebrow: "لوحة الإشراف الأكاديمي المباشر", welcome: "مرحبًا بعودتك", intro: "ملخص حيّ لأعداد الطلاب والمعلمين، الجلسات، ونشاط القراءة والمراجعة المسجل في أكاديمية نون.",
    students: "إجمالي الطلاب", enrolledQuran: "مسار القرآن", enrolledArabic: "مسار التأسيس", teachers: "المعلمون", activeNow: "جلسات جارية الآن", sessions: "جلسات اليوم", nextHour: "خلال الساعة القادمة", needsAttention: "طلاب بلا معلم", quickStudents: "عرض الطلاب", quickTeachers: "عرض المعلمين", quickSessions: "جدول الجلسات",
    weekly: "نشاط المصحف خلال آخر 7 أيام", reading: "جلسات القراءة", reviews: "مراجعات الحفظ", minutes: "دقائق الاستماع", tracks: "توزيع التسجيلات حسب المسار", noEnrollments: "لا توجد تسجيلات في المسارات بعد.", selfRating: "متوسط التقييم الذاتي للمراجعة", selfRatingNote: "مؤشر من تقييمات الطلاب (أحتاج تدريبًا أكثر 25% إلى سهل 100%)، وليس تقييمًا آليًا للتلاوة.", upcoming: "الجلسات القادمة اليوم", noSessions: "لا توجد جلسات مجدولة لبقية اليوم.", student: "الطالب", teacher: "المعلم", topic: "الموضوع", time: "الموعد", latest: "أحدث الأنشطة والتحديثات", noActivity: "لا توجد أنشطة حديثة مسجلة.", noTeacher: "غير مسند", review: "مراجعة", recentAccount: "حساب جديد", countSuffix: "طالب", totalActivities: "نشاطًا مسجلًا هذا الأسبوع",
  } : {
    eyebrow: "Live academic overview", welcome: "Welcome back", intro: "A live summary of students, teachers, sessions, and recorded Quran reading and review activity at NOON Academy.",
    students: "Total students", enrolledQuran: "Quran track", enrolledArabic: "Arabic foundations", teachers: "Teachers", activeNow: "Sessions live now", sessions: "Today's sessions", nextHour: "Within the next hour", needsAttention: "Students without a teacher", quickStudents: "View students", quickTeachers: "View teachers", quickSessions: "Session schedule",
    weekly: "Mushaf activity · last 7 days", reading: "Reading sessions", reviews: "Memorization reviews", minutes: "Listening minutes", tracks: "Enrollments by track", noEnrollments: "No track enrollments yet.", selfRating: "Average self-rating", selfRatingNote: "Based on student ratings (need more practice 25% to easy 100%); not automated recitation scoring.", upcoming: "Upcoming sessions today", noSessions: "No sessions are scheduled for the rest of today.", student: "Student", teacher: "Teacher", topic: "Topic", time: "Time", latest: "Recent activity", noActivity: "No recent activity has been recorded.", noTeacher: "Unassigned", review: "Review", recentAccount: "New account", countSuffix: "students", totalActivities: "activities recorded this week",
  };
  const activityCountLabel = (n: number) => new Intl.NumberFormat(locale).format(n);

  return (
    <div className="space-y-6 pb-10 text-[#1e1b1a]">
      <section className="relative overflow-hidden rounded-3xl border border-[#e9e1df] bg-white p-5 shadow-sm sm:p-7">
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-24 size-64 rounded-full bg-emerald-900/[0.04] blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -right-12 size-64 rounded-full bg-amber-400/[0.08] blur-3xl" />
        <div className="relative flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-950"><span className="size-2 rounded-full bg-emerald-600" />{copy.eyebrow}</span>
              <time className="text-xs text-stone-500">{todayLabel}</time>
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">{copy.welcome}، {session.user.name} <span aria-hidden="true">👋</span></h1>
            <p className="mt-2 text-sm leading-7 text-stone-600">{copy.intro}</p>
          </div>
          <div className="grid w-full gap-2 sm:grid-cols-3 xl:w-auto xl:min-w-[32rem]">
            <Link href="/admin/students" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#003426] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#0f4c3a]">♙ <span>{copy.quickStudents}</span></Link>
            <Link href="/admin/teachers" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#f5ecea] px-4 py-2.5 text-center text-sm font-semibold text-emerald-950 transition hover:bg-[#efe6e4]">✦ <span>{copy.quickTeachers}</span></Link>
            <Link href="/admin/sessions" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#805600] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90">◷ <span>{copy.quickSessions}</span></Link>
          </div>
        </div>
      </section>

      <section aria-label={copy.students} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title={copy.students} value={studentCount} icon="♙" hint={`${copy.enrolledQuran}: ${quranStudents.size} · ${copy.enrolledArabic}: ${foundationStudents.size}`} />
        <MetricCard title={copy.teachers} value={teacherCount} icon="✦" hint={`${liveSessions} ${copy.activeNow}`} />
        <MetricCard title={copy.sessions} value={sessionsToday} icon="◷" hint={`${sessionsNextHour} ${copy.nextHour}`} />
        <MetricCard title={copy.needsAttention} value={unassignedCount} icon="!" hint={`${activityCountLabel(activityTotal)} ${copy.totalActivities}`} alert={unassignedCount > 0} />
      </section>

      <div className="grid items-start gap-4 xl:grid-cols-12">
        <section className="rounded-2xl border border-[#e9e1df] bg-white p-4 shadow-sm sm:p-5 xl:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-lg font-bold text-emerald-950">{copy.weekly}</h2><p className="mt-1 text-xs text-stone-500">{activityCountLabel(activityTotal)} {copy.totalActivities}</p></div>
            <div className="flex flex-wrap gap-3 text-xs text-stone-600"><span className="inline-flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-[#003426]" />{copy.reading}</span><span className="inline-flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-[#805600]" />{copy.reviews}</span></div>
          </div>
          <div className="mt-6 grid h-52 grid-cols-7 items-end gap-2 border-b border-stone-200 px-1 sm:gap-4">
            {dayBuckets.map((day) => {
              const total = day.reading + day.reviews;
              const totalHeight = total ? Math.max(6, (total / maxChartValue) * 100) : 2;
              const readingHeight = total ? (day.reading / total) * totalHeight : 0;
              const reviewHeight = total ? (day.reviews / total) * totalHeight : 0;
              return <div key={day.key} className="flex h-full flex-col items-center justify-end gap-2">
                <span className="min-h-4 text-[10px] font-semibold text-stone-500">{total || ""}</span>
                <div className="flex w-full max-w-12 flex-col justify-end overflow-hidden rounded-t-lg bg-stone-100" style={{ height: `${totalHeight}%` }} title={`${copy.reading}: ${day.reading}, ${copy.reviews}: ${day.reviews}`}>
                  <div className="w-full bg-[#805600]" style={{ height: `${reviewHeight}%` }} />
                  <div className="w-full bg-[#003426]" style={{ height: `${readingHeight}%` }} />
                </div>
                <span className="pb-2 text-[10px] text-stone-500">{day.label}</span>
              </div>;
            })}
          </div>
          <div className="mt-4 flex flex-wrap justify-between gap-3 text-xs text-stone-600"><span>{copy.minutes}: <strong className="text-emerald-950">{Math.round(weeklyActivities.reduce((sum, item) => sum + item.durationSeconds, 0) / 60)}</strong></span><span>{copy.selfRating}: <strong className="text-emerald-950">{selfRatingAverage === null ? "—" : `${selfRatingAverage}%`}</strong></span></div>
          <p className="mt-2 text-[11px] leading-5 text-stone-500">{copy.selfRatingNote}</p>
        </section>

        <section className="rounded-2xl border border-[#e9e1df] bg-white p-4 shadow-sm sm:p-5 xl:col-span-4">
          <h2 className="text-lg font-bold text-emerald-950">{copy.tracks}</h2>
          {enrollments.length === 0 ? <p className="mt-5 rounded-xl bg-stone-50 p-4 text-sm text-stone-600">{copy.noEnrollments}</p> : <div className="mt-5 space-y-5">
            <TrackMeter label={copy.enrolledQuran} count={quranStudents.size} total={studentCount} color="bg-[#003426]" />
            <TrackMeter label={copy.enrolledArabic} count={foundationStudents.size} total={studentCount} color="bg-[#805600]" />
            <p className="text-[11px] leading-5 text-stone-500">{isArabic ? "قد يكون الطالب مسجلًا في أكثر من مسار." : "A student may be enrolled in more than one track."}</p>
          </div>}
          <div className="mt-6 rounded-xl bg-[#fbf2f0] p-4"><p className="text-sm font-semibold text-emerald-950">{copy.activeNow}</p><p className="mt-1 text-3xl font-bold text-emerald-950">{liveSessions}</p><p className="mt-1 text-xs text-stone-600">{adminCount} {isArabic ? "مديرًا لديهم صلاحية الإدارة" : "administrator accounts"}</p></div>
        </section>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-12">
        <section className="overflow-hidden rounded-2xl border border-[#e9e1df] bg-white shadow-sm xl:col-span-8">
          <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-4 py-4 sm:px-5"><div><h2 className="text-lg font-bold text-emerald-950">{copy.upcoming}</h2><p className="mt-1 text-xs text-stone-500">{sessionsToday} {copy.sessions}</p></div><Link href="/admin/sessions" className="text-xs font-semibold text-emerald-900 underline underline-offset-4">{copy.quickSessions}</Link></div>
          {upcomingSessions.length ? <div className="divide-y divide-stone-100">
            {upcomingSessions.map((item) => {
              const isLive = item.startsAt <= now && item.startsAt.getTime() + item.durationMinutes * 60_000 > now.getTime();
              return <div key={item.id} className="grid gap-2 px-4 py-4 text-sm sm:grid-cols-[minmax(0,1.4fr)_minmax(8rem,1fr)_minmax(8rem,1fr)_auto] sm:items-center sm:px-5">
                <div><p className="font-semibold text-stone-900">{item.topic}</p><p className="mt-1 text-xs text-stone-500">{item.students.map((record) => record.student.user.displayName).join("، ") || (isArabic ? "لا يوجد طلاب مسجلون" : "No students assigned")}</p></div>
                <p className="text-stone-700">{item.teacher.displayName}</p>
                <time className="text-xs text-stone-600">{lastActivityTime(item.startsAt)}</time>
                <span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${isLive ? "bg-emerald-50 text-emerald-900" : "bg-stone-100 text-stone-600"}`}>{isLive ? (isArabic ? "جارية" : "Live") : (isArabic ? "مجدولة" : "Scheduled")}</span>
              </div>;
            })}
          </div> : <p className="px-5 py-10 text-center text-sm text-stone-500">{copy.noSessions}</p>}
        </section>

        <section className="rounded-2xl border border-[#e9e1df] bg-white p-4 shadow-sm sm:p-5 xl:col-span-4">
          <div className="flex items-center justify-between gap-2"><h2 className="text-lg font-bold text-emerald-950">{copy.latest}</h2><span className="size-2 rounded-full bg-amber-500" /></div>
          {upcomingFeed.length ? <ul className="mt-4 space-y-4">
            {upcomingFeed.map((item) => <li key={item.key} className="flex gap-3"><span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f5ecea] text-emerald-950">{item.icon}</span><div className="min-w-0"><p className="text-sm leading-6 text-stone-800">{item.title}</p><p className="text-xs leading-5 text-stone-500">{item.detail}</p><time className="mt-1 block text-[10px] text-stone-400">{lastActivityTime(item.date)}</time></div></li>)}
          </ul> : <p className="mt-4 rounded-xl bg-stone-50 p-4 text-sm text-stone-600">{copy.noActivity}</p>}
        </section>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, hint, alert = false }: { title: string; value: number; icon: string; hint: string; alert?: boolean }) {
  return <article className="relative overflow-hidden rounded-2xl border border-[#e9e1df] bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
    <div className="flex items-start justify-between gap-3"><span aria-hidden="true" className={`flex size-11 items-center justify-center rounded-xl text-xl ${alert ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-950"}`}>{icon}</span><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${alert ? "bg-amber-50 text-amber-800" : "bg-stone-100 text-stone-600"}`}>{alert ? "!" : "↗"}</span></div>
    <p className="mt-4 text-sm text-stone-600">{title}</p><strong className="mt-1 block text-3xl font-bold text-emerald-950">{new Intl.NumberFormat().format(value)}</strong><p className="mt-3 rounded-xl bg-stone-50 px-3 py-2 text-xs leading-5 text-stone-600">{hint}</p>
  </article>;
}

function TrackMeter({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const percent = total ? Math.min(100, Math.round((count / total) * 100)) : 0;
  return <div><div className="flex items-center justify-between gap-3 text-sm"><span className="font-medium text-stone-700">{label}</span><strong className="text-emerald-950">{count} <span className="text-xs font-normal text-stone-500">({percent}%)</span></strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100"><div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} /></div></div>;
}

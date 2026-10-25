import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

const modules = [
  { href: "/admin/users", icon: "♙", ar: "المستخدمون والصلاحيات", en: "Users & roles", detailAr: "إدارة الحسابات وأنواعها وحالة الوصول.", detailEn: "Manage accounts, role types, and access status." },
  { href: "/admin/students", icon: "◉", ar: "الطلاب", en: "Students", detailAr: "ملفات الطلاب وتقدمهم وربطهم بالمعلمين.", detailEn: "Student profiles, progress, and teacher assignments." },
  { href: "/admin/teachers", icon: "✦", ar: "المعلمون", en: "Teachers", detailAr: "ملفات المعلمين والطلاب المسندين إليهم.", detailEn: "Teacher profiles and their assigned students." },
  { href: "/admin/curriculum", icon: "▤", ar: "المناهج والبرامج", en: "Curriculum & programs", detailAr: "مسارات القرآن والتأسيس ومحتواها.", detailEn: "Quran and Arabic foundations tracks and content." },
  { href: "/admin/sessions", icon: "◷", ar: "الجلسات", en: "Sessions", detailAr: "الجلسات المباشرة والجدولة والحضور.", detailEn: "Live sessions, scheduling, and attendance." },
  { href: "/admin/reports", icon: "▥", ar: "التقارير", en: "Reports", detailAr: "مؤشرات التسجيل والتقدم والنشاط.", detailEn: "Enrollment, progress, and activity summaries." },
  { href: "/admin/settings", icon: "⚙", ar: "الإعدادات", en: "Settings", detailAr: "تفضيلات الأكاديمية وإعداداتها العامة.", detailEn: "Academy preferences and general configuration." },
] as const;

export default async function AdminDashboardPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("dashboard");
  const isArabic = locale === "ar";

  return (
    <section className="space-y-6 pb-10">
      <header className="rounded-3xl bg-gradient-to-br from-[#0d5545] via-[#0c5949] to-[#143b35] p-6 text-white shadow-lg sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">{isArabic ? "مساحة إدارة أكاديمية نون" : "NOON academy administration"}</p>
        <h1 className="mt-3 text-3xl font-bold">{t("admin")}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50/90">{isArabic ? "نظرة عامة على أقسام الإدارة. ستظهر الأرقام عند ربط المؤشرات ببيانات الأكاديمية." : "Overview of administration areas. Metrics will populate when connected to academy data."}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[[isArabic ? "الطلاب" : "Students", "◉"], [isArabic ? "المعلمون" : "Teachers", "✦"], [isArabic ? "الجلسات القادمة" : "Upcoming sessions", "◷"], [isArabic ? "أنشطة تحتاج متابعة" : "Activities to review", "▥"]].map(([label, icon]) => <div key={label} className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"><span aria-hidden="true" className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-900">{icon}</span><div><p className="text-sm text-stone-600">{label}</p><strong className="mt-1 block text-2xl text-stone-900">—</strong></div></div>)}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => <Link key={module.href} href={module.href} className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-emerald-700">
          <div className="flex items-center justify-between"><span aria-hidden="true" className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-900">{module.icon}</span><span className="text-lg text-stone-400 transition group-hover:text-emerald-800" aria-hidden="true">↗</span></div>
          <h2 className="mt-4 text-lg font-bold text-stone-900">{isArabic ? module.ar : module.en}</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">{isArabic ? module.detailAr : module.detailEn}</p>
        </Link>)}
      </div>
      <p className="rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-950">{isArabic ? "تنبيه: هذه المرحلة تنشئ الهيكل والتنقل فقط؛ إجراءات إدارة الحسابات والمناهج لم تُفعّل بعد." : "Note: this phase sets up the structure and navigation only. User and curriculum management actions are not active yet."}</p>
    </section>
  );
}

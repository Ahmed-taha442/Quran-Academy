import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { requireRole } from "@/lib/authorization";

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

const navigation = [
  ["/admin/dashboard", "لوحة التحكم", "Dashboard"],
  ["/admin/users", "المستخدمون", "Users"],
  ["/admin/students", "الطلاب", "Students"],
  ["/admin/teachers", "المعلمون", "Teachers"],
  ["/admin/curriculum", "المناهج", "Curriculum"],
  ["/admin/sessions", "الجلسات", "Sessions"],
  ["/admin/reports", "التقارير", "Reports"],
  ["/admin/settings", "الإعدادات", "Settings"],
] as const;

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  await requireRole(locale, ["ADMIN"]);
  setRequestLocale(locale);
  const isArabic = locale === "ar";

  return (
    <div className="mx-auto grid max-w-[90rem] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8 lg:px-8" dir={isArabic ? "rtl" : "ltr"}>
      <aside className="h-fit rounded-3xl border border-stone-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
        <p className="px-3 pb-3 pt-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">{isArabic ? "إدارة الأكاديمية" : "Academy administration"}</p>
        <nav aria-label={isArabic ? "قائمة المدير" : "Admin navigation"} className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-1">
          {navigation.map(([href, arabic, english]) => <Link key={href} href={href} className="rounded-xl px-3 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-emerald-50 hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-emerald-700">{isArabic ? arabic : english}</Link>)}
        </nav>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}

import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function StudentDashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold">{t("student")}</h1>
      <p className="mt-2 text-stone-700">{t("continue")}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/learn/noor-bayan" className="rounded-xl border bg-white p-5">
          Noor Al-Bayan
        </Link>
        <Link href="/learn/quran" className="rounded-xl border bg-white p-5">
          Quran
        </Link>
      </div>
    </section>
  );
}

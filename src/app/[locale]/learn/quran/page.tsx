import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function QuranTrackPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("quran");

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link href="/learn/quran/mushaf" className="rounded-xl border bg-white p-5">
          {t("mushaf")}
        </Link>
        <Link href="/learn/quran/tajweed" className="rounded-xl border bg-white p-5">
          {t("tajweed")}
        </Link>
        <Link href="/learn/quran/hifz" className="rounded-xl border bg-white p-5">
          {t("hifz")}
        </Link>
      </div>
    </section>
  );
}

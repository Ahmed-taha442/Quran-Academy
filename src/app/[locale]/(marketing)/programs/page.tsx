import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProgramsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("programs");

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-2">
      <h1 className="md:col-span-2 text-3xl font-semibold">{t("title")}</h1>
      <Link href="/learn/noor-bayan" className="rounded-2xl border border-stone-300 bg-white p-6">
        <h2 className="text-xl font-semibold">{t("noorTitle")}</h2>
        <p className="mt-2 text-stone-700">{t("noorBody")}</p>
      </Link>
      <Link href="/learn/quran" className="rounded-2xl border border-stone-300 bg-white p-6">
        <h2 className="text-xl font-semibold">{t("quranTitle")}</h2>
        <p className="mt-2 text-stone-700">{t("quranBody")}</p>
      </Link>
    </section>
  );
}

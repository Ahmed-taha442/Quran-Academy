import { getTranslations, setRequestLocale } from "next-intl/server";
import { FoundationTabs } from "@/components/arabic-foundation/foundation-tabs";
import { getTextDirection } from "@/lib/direction";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ArabicFoundationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("arabicFoundation");

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#f7f8f5] px-4 py-8 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 px-5 py-8 text-white shadow-lg sm:px-9 sm:py-11">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">{t("eyebrow")}</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{t("title")}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-emerald-50 sm:text-base">{t("intro")}</p>
          <div className="mt-7 flex flex-wrap gap-2" aria-label={t("tablist")}>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm">أ، ب، ت، ث</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm">َ ِ ُ</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm">ا، و، ي</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm">ً ٍ ٌ</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm">ْ</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm">ّ</span>
          </div>
        </div>

        <FoundationTabs direction={getTextDirection(locale)} />
      </section>
    </section>
  );
}

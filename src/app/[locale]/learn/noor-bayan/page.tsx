import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

const units = [
  {
    id: "letters",
    href: "https://wordwall.net/teacher/2368183/folder/2928771/%D9%85%D9%86%D9%87%D8%AC-%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D8%A6%D9%8A%D8%A9-%D8%A8%D8%A7%D9%84%D8%A3%D9%84%D8%B9%D8%A7%D8%A8-%D8%A7%D9%84%D8%AA%D8%B9%D9%84%D9%8A%D9%85%D9%8A%D8%A9-jfj/1-%D8%A7%D9%84%D8%AD%D8%B1%D9%88%D9%81",
  },
  {
    id: "shortVowels",
    href: "https://wordwall.net/teacher/2368183/folder/2928790/%D9%85%D9%86%D9%87%D8%AC-%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D8%A6%D9%8A%D8%A9-%D8%A8%D8%A7%D9%84%D8%A3%D9%84%D8%B9%D8%A7%D8%A8-%D8%A7%D9%84%D8%AA%D8%B9%D9%84%D9%8A%D9%85%D9%8A%D8%A9-jfj/2-%D8%A7%D9%84%D8%AD%D8%B1%D9%83%D8%A7%D8%AA-%D8%A7%D9%84%D8%AB%D9%84%D8%A7%D8%AB",
  },
  {
    id: "longVowels",
    href: "https://wordwall.net/teacher/2368183/folder/2910248/%D9%85%D9%86%D9%87%D8%AC-%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D8%A6%D9%8A%D8%A9-%D8%A8%D8%A7%D9%84%D8%A3%D9%84%D8%B9%D8%A7%D8%A8-%D8%A7%D9%84%D8%AA%D8%B9%D9%84%D9%8A%D9%85%D9%8A%D8%A9-jfj/3-%D8%A7%D9%84%D9%85%D8%AF%D9%88%D8%AF-%D8%A7%D9%84%D8%AB%D9%84%D8%A7%D8%AB",
  },
  {
    id: "tanween",
    href: "https://wordwall.net/teacher/2368183/folder/2928765/%D9%85%D9%86%D9%87%D8%AC-%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D8%A6%D9%8A%D8%A9-%D8%A8%D8%A7%D9%84%D8%A3%D9%84%D8%B9%D8%A7%D8%A8-%D8%A7%D9%84%D8%AA%D8%B9%D9%84%D9%8A%D9%85%D9%8A%D8%A9-jfj/4-%D8%A7%D9%84%D8%AA%D9%86%D9%88%D9%8A%D9%86",
  },
  {
    id: "sukoon",
    href: "https://wordwall.net/teacher/2368183/folder/3109796/%D9%85%D9%86%D9%87%D8%AC-%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D8%A6%D9%8A%D8%A9-%D8%A8%D8%A7%D9%84%D8%A3%D9%84%D8%B9%D8%A7%D8%A8-%D8%A7%D9%84%D8%AA%D8%B9%D9%84%D9%8A%D9%85%D9%8A%D8%A9-jfj/5-%D8%A7%D9%84%D8%B3%D9%83%D9%88%D9%86",
  },
  {
    id: "shadda",
    href: "https://wordwall.net/teacher/2368183/folder/3246322/%D9%85%D9%86%D9%87%D8%AC-%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D8%A6%D9%8A%D8%A9-%D8%A8%D8%A7%D9%84%D8%A3%D9%84%D8%B9%D8%A7%D8%A8-%D8%A7%D9%84%D8%AA%D8%B9%D9%84%D9%8A%D9%85%D9%8A%D8%A9-jfj/6-%D8%A7%D9%84%D8%B4%D8%AF%D8%A9",
  },
  {
    id: "noorBayan",
    href: "https://drive.google.com/file/d/1KvPgr1fd118LSq-2xBdCTonlUC-Rbfcr/view?pli=1",
  },
] as const;

export default async function ArabicFoundationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("arabicFoundation");

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#f7f8f5] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 px-5 py-8 text-white shadow-lg sm:px-9 sm:py-11">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">{t("eyebrow")}</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{t("title")}</h1>
        </header>

        <nav aria-label={t("unitListLabel")} className="mt-6 grid gap-3">
          {units.map((unit, index) => (
            <a
              key={unit.id}
              href={unit.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[76px] items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 sm:px-6"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-900 group-hover:bg-emerald-800 group-hover:text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 text-base font-bold text-slate-900 sm:text-lg">
                {t(`units.${unit.id}`)}
              </span>
              <span aria-hidden="true" className="text-xl font-semibold text-emerald-800 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}

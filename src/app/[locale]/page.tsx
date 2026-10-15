import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { YoutubeEmbed } from "@/components/media/youtube-embed";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const headingClass = locale === "ar" ? "font-arabic" : "";
  const offerKeys = ["offer1", "offer2", "offer3", "offer4", "offer5"] as const;

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="mb-3 text-sm font-semibold tracking-wide text-[var(--gold)]">
          {t("eyebrow")}
        </p>
        <h1
          className={`max-w-3xl text-4xl font-semibold leading-tight md:text-5xl ${headingClass}`}
        >
          {t("headline")}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-stone-700">{t("sub")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={siteConfig.whatsappTrialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-white"
          >
            {t("ctaTrial")}
          </a>
          <Link href="/programs" className="rounded-full border border-stone-400 px-5 py-2.5">
            {t("ctaPrograms")}
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 md:grid-cols-2 md:items-center">
        <div>
          <h2 className={`text-2xl font-semibold ${headingClass}`}>{t("videoTitle")}</h2>
          <p className="mt-3 text-stone-700">{t("videoCaption")}</p>
        </div>
        <YoutubeEmbed videoId={siteConfig.introVideoId} title={t("videoTitle")} />
      </section>

      <section className="bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-sm font-semibold tracking-wide text-[var(--gold)]">
            {t("teacherRole")}
          </p>
          <h2 className={`mt-2 text-3xl font-semibold ${headingClass}`}>{t("aboutTitle")}</h2>
          <p className={`mt-1 text-xl text-[var(--accent)] ${headingClass}`}>
            {t("teacherName")}
          </p>
          <div className="mt-6 grid gap-4 text-stone-700 md:grid-cols-2">
            <p>{t("intro")}</p>
            <p>{t("experience")}</p>
            <p>{t("credentials")}</p>
            <p>{t("classes")}</p>
            <p className="md:col-span-2">{t("goal")}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className={`text-2xl font-semibold ${headingClass}`}>{t("offerTitle")}</h2>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {offerKeys.map((key) => (
            <li
              key={key}
              className="rounded-2xl border border-stone-300 bg-white px-5 py-4 text-stone-800"
            >
              {t(key)}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-stone-300/70 bg-[#efe7d6]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className={`text-2xl font-semibold ${headingClass}`}>{t("trialTitle")}</h2>
          <p className="mt-3 max-w-2xl text-stone-700">{t("trialBody")}</p>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">{t("trialNote")}</p>
          <a
            href={siteConfig.whatsappTrialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full bg-[var(--accent)] px-5 py-2.5 text-white"
          >
            {t("ctaWhatsApp")}
          </a>
        </div>
      </section>
    </div>
  );
}

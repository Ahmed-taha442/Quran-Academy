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
      <section className="relative isolate mx-auto max-w-6xl overflow-hidden px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -end-20 -top-24 -z-10 size-72 rounded-full bg-emerald-100/70 blur-3xl sm:size-96" />
        <p className="mb-3 text-sm font-semibold tracking-wide text-[var(--gold)]">
          {t("eyebrow")}
        </p>
        <h1
          className={`max-w-3xl text-3xl font-semibold leading-[1.3] tracking-tight sm:text-4xl md:text-5xl ${headingClass}`}
        >
          {t("headline")}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">{t("sub")}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={siteConfig.whatsappTrialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-[var(--accent-hover)]"
          >
            {t("ctaTrial")}
          </a>
          <Link href="/programs" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--border)] bg-white/75 px-6 py-3 font-semibold text-[var(--accent)] transition-colors hover:bg-white">
            {t("ctaPrograms")}
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-14 sm:px-6 sm:pb-20 md:grid-cols-2 md:items-center md:gap-10 lg:px-8">
        <div>
          <h2 className={`text-2xl font-semibold tracking-tight sm:text-3xl ${headingClass}`}>{t("videoTitle")}</h2>
          <p className="mt-3 leading-7 text-[var(--muted)]">{t("videoCaption")}</p>
        </div>
        <YoutubeEmbed videoId={siteConfig.introVideoId} title={t("videoTitle")} />
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface-soft)]/80">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-sm font-semibold tracking-wide text-[var(--gold)]">
            {t("teacherRole")}
          </p>
          <h2 className={`mt-2 text-2xl font-semibold tracking-tight sm:text-3xl ${headingClass}`}>{t("aboutTitle")}</h2>
          <p className={`mt-1 text-xl text-[var(--accent)] ${headingClass}`}>
            {t("teacherName")}
          </p>
          <div className="mt-6 grid gap-4 leading-7 text-[var(--muted)] md:grid-cols-2">
            <p>{t("intro")}</p>
            <p>{t("experience")}</p>
            <p>{t("credentials")}</p>
            <p>{t("classes")}</p>
            <p className="md:col-span-2">{t("goal")}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <h2 className={`text-2xl font-semibold tracking-tight sm:text-3xl ${headingClass}`}>{t("offerTitle")}</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {offerKeys.map((key) => (
            <li
              key={key}
              className="rounded-2xl border border-[var(--border)] bg-white px-5 py-4 leading-7 text-[var(--ink)] shadow-sm shadow-emerald-950/[0.03]"
            >
              {t(key)}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-[var(--border)] bg-[#e8efe6]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <h2 className={`text-2xl font-semibold tracking-tight sm:text-3xl ${headingClass}`}>{t("trialTitle")}</h2>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">{t("trialBody")}</p>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">{t("trialNote")}</p>
          <a
            href={siteConfig.whatsappTrialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-[var(--accent-hover)] sm:w-auto"
          >
            {t("ctaWhatsApp")}
          </a>
        </div>
      </section>
    </div>
  );
}

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
  const contactLabels = {
    ar: { title: "\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u064a", preply: "\u0627\u062d\u062c\u0632 \u062f\u0631\u0633\u064b\u0627 \u0639\u0628\u0631 Preply", email: "\u0631\u0627\u0633\u0644\u0646\u064a \u0639\u0628\u0631 \u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a" },
    en: { title: "Get in touch", preply: "Book a lesson on Preply", email: "Email me" },
    fr: { title: "Me contacter", preply: "Réserver un cours sur Preply", email: "M’écrire par e-mail" },
    id: { title: "Hubungi saya", preply: "Pesan kelas di Preply", email: "Kirim email" },
    tr: { title: "İletişime geçin", preply: "Preply'de ders ayırtın", email: "E-posta gönderin" },
    ur: { title: "\u0645\u062c\u06be \u0633\u06d2 \u0631\u0627\u0628\u0637\u06c1 \u06a9\u0631\u06cc\u06ba", preply: "Preply \u067e\u0631 \u06a9\u0644\u0627\u0633 \u0628\u06a9 \u06a9\u0631\u06cc\u06ba", email: "\u0627\u06cc \u0645\u06cc\u0644 \u06a9\u0631\u06cc\u06ba" },
  };
  const contact = contactLabels[locale as keyof typeof contactLabels] ?? contactLabels.en;

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

      <section className="border-t border-[var(--border)] bg-white" aria-labelledby="home-contact-title">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h2 id="home-contact-title" className={"text-2xl font-semibold tracking-tight sm:text-3xl " + headingClass}>{contact.title}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
            <a href="https://preply.in/AFAF9EN42595869112?ts=17921586" target="_blank" rel="noopener noreferrer" className="group flex min-h-24 min-w-0 items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]/60 p-4 transition-colors hover:border-[var(--accent)] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:p-5">
              <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-white"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-6"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path strokeLinecap="round" d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17M8 14h3m2 0h3M8 17h3"/></svg></span>
              <span className="min-w-0"><span className="block font-semibold text-[var(--ink)] group-hover:text-[var(--accent)]">{contact.preply}</span><span className="mt-1 block text-sm text-[var(--muted)]">Preply</span></span>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="ms-auto size-5 shrink-0 text-[var(--muted)]"><path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M8 7h9v9"/></svg>
            </a>
            <a href="mailto:afafassem2000@gmail.com" className="group flex min-h-24 min-w-0 items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]/60 p-4 transition-colors hover:border-[var(--accent)] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:p-5">
              <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[var(--accent)]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-6"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6"/></svg></span>
              <span className="min-w-0"><span className="block font-semibold text-[var(--ink)] group-hover:text-[var(--accent)]">{contact.email}</span><span dir="ltr" className="mt-1 block break-all text-left text-sm text-[var(--muted)]">afafassem2000@gmail.com</span></span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
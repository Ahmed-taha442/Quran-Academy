"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header className="border-b border-stone-300/70 bg-[#f6f1e7]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="font-arabic text-xl font-bold text-[var(--accent)]">
          Accadmy
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-3 text-sm">
          <Link href="/programs">{t("programs")}</Link>
          <Link href="/learn/noor-bayan">{t("noorBayan")}</Link>
          <Link href="/learn/quran">{t("quran")}</Link>
          <LocaleSwitcher />
          <a
            href={siteConfig.whatsappTrialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#1f6b4a] px-4 py-1.5 text-white"
          >
            {t("trial")}
          </a>
          <Link href="/login" className="rounded-full border border-stone-400 px-4 py-1.5">
            {t("login")}
          </Link>
        </nav>
      </div>
    </header>
  );
}

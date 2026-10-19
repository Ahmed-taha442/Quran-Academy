"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { authClient } from "@/lib/auth-client";

export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const role = session
    ? (session.user as typeof session.user & { role?: string }).role
    : undefined;
  const dashboardHref = role === "TEACHER"
    ? "/teacher/dashboard"
    : role === "ADMIN"
      ? "/admin/dashboard"
      : "/student/dashboard";

  async function signOut() {
    await authClient.signOut();
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex shrink-0 items-center rounded-lg" aria-label="NOON Quran Memorization Academy">
          <Image
            src="/brand/noon-logo-horizontal.png"
            alt="NOON Quran Memorization Academy"
            width={194}
            height={64}
            sizes="(max-width: 640px) 133px, (max-width: 1024px) 170px, 194px"
            preload
            className="h-11 w-auto sm:h-14 lg:h-16"
          />
        </Link>
        <button
          type="button"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[var(--ink)] md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="text-xl leading-none" aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
        </button>
        <nav
          id="site-navigation"
          className={`${menuOpen ? "flex" : "hidden"} absolute inset-x-3 top-[calc(100%+0.5rem)] flex-col items-stretch gap-1 rounded-2xl border border-[var(--border)] bg-white p-3 text-sm shadow-xl md:static md:flex md:flex-row md:items-center md:justify-end md:gap-2 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          <Link onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2.5 hover:bg-[var(--surface-soft)] md:py-2" href="/programs">{t("programs")}</Link>
          <Link onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2.5 hover:bg-[var(--surface-soft)] md:py-2" href="/learn/noor-bayan">{t("arabicFoundation")}</Link>
          <Link onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2.5 hover:bg-[var(--surface-soft)] md:py-2" href="/learn/quran">{t("quran")}</Link>
          <div className="my-1 md:my-0"><LocaleSwitcher /></div>
          <a
            href={siteConfig.whatsappTrialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[var(--accent)] px-4 py-2.5 text-center font-medium text-white transition-colors hover:bg-[var(--accent-hover)] md:py-2"
          >
            {t("trial")}
          </a>
          {session ? (
            <>
              <span className="max-w-32 truncate px-2 text-sm font-medium text-[var(--ink)] sm:max-w-48" title={session.user.name}>
                {session.user.name}
              </span>
              <Link onClick={() => setMenuOpen(false)} href={dashboardHref} className="rounded-full border border-[var(--border)] px-4 py-2.5 text-center font-medium text-[var(--accent)] hover:bg-[var(--surface-soft)] md:py-2">
                {locale === "ar" ? "لوحتي" : "Dashboard"}
              </Link>
              <button onClick={signOut} type="button" className="rounded-full border border-[var(--border)] px-4 py-2.5 text-center font-medium text-[var(--accent)] hover:bg-[var(--surface-soft)] md:py-2">
                {locale === "ar" ? "تسجيل الخروج" : "Sign out"}
              </button>
            </>
          ) : (
            <Link onClick={() => setMenuOpen(false)} href="/login" className="rounded-full border border-[var(--border)] px-4 py-2.5 text-center font-medium text-[var(--accent)] hover:bg-[var(--surface-soft)] md:py-2">
              {t("login")}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

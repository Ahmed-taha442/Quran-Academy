"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const languages = [
  { locale: "en", label: "EN" },
  { locale: "ar", label: "عربي" },
] as const;

export function LocaleSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center rounded-full border border-stone-300 bg-white/80 p-0.5 text-xs font-semibold">
      {languages.map((language) => {
        const isActive = currentLocale === language.locale;
        return (
          <Link
            key={language.locale}
            href={pathname}
            locale={language.locale}
            className={`rounded-full px-2.5 py-1 ${
              isActive ? "bg-[var(--accent)] text-white" : "text-stone-600"
            }`}
          >
            {language.label}
          </Link>
        );
      })}
    </div>
  );
}

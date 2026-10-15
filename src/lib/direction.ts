import { siteConfig, type AppLocale } from "@/config/site";

export function getTextDirection(locale: string): "rtl" | "ltr" {
  return (siteConfig.rtlLocales as readonly string[]).includes(locale)
    ? "rtl"
    : "ltr";
}

export function isRtlLocale(locale: AppLocale): boolean {
  return (siteConfig.rtlLocales as readonly string[]).includes(locale);
}

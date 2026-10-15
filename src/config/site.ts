export const siteConfig = {
  name: "Accadmy",
  nameAr: "أكاديمية القرآن ونور البيان",
  description:
    "Academy for teaching the Holy Quran and Noor Al-Bayan to non-Arabic speakers.",
  defaultLocale: "en",
  locales: ["en", "ar", "ur", "fr", "id", "tr"] as const,
  rtlLocales: ["ar", "ur"] as const,
  teacher: {
    name: "Afaf Assem",
    nameAr: "عفاف عاصم",
  },
  whatsappTrialUrl: "https://wa.me/qr/6KXHZYEVMFRVL1",
  introVideoId: "FAptqcLViVU",
} as const;

export type AppLocale = (typeof siteConfig.locales)[number];

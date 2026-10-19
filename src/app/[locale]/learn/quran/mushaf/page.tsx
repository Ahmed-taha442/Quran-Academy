import { setRequestLocale } from "next-intl/server";
import { MushafReader } from "@/components/quran/mushaf-reader";
import { requireAuthenticated } from "@/lib/authorization";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function MushafPage({ params }: Props) {
  const { locale } = await params;
  await requireAuthenticated(locale, `/${locale}/learn/quran/mushaf`);
  setRequestLocale(locale);

  return <MushafReader locale={locale} />;
}

import { setRequestLocale } from "next-intl/server";
import { MushafReader } from "@/components/quran/mushaf-reader";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function MushafPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MushafReader locale={locale} />;
}

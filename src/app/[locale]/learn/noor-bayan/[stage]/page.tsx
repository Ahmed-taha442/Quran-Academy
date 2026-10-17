import { redirect } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string; stage: string }>;
};

export default async function LegacyArabicFoundationStagePage({ params }: Props) {
  const { locale } = await params;
  redirect({ href: "/learn/noor-bayan", locale });
}

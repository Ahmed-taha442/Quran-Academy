import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TeacherDashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold">{t("teacher")}</h1>
      <ul className="mt-6 list-disc ps-6 text-stone-700">
        <li>Today&apos;s live sessions</li>
        <li>Recitation submissions to review</li>
        <li>Students needing catch-up</li>
      </ul>
    </section>
  );
}

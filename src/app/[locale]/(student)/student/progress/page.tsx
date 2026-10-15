import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProgressPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Progress</h1>
      <p className="mt-3 text-stone-700">Mastery by stage, teacher reviews, and streak.</p>
    </section>
  );
}

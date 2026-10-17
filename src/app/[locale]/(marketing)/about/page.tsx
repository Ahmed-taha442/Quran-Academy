import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Accadmy</h1>
      <p className="mt-4 text-stone-700">
        Structured Quran and Arabic Foundation learning for non-Arabic speakers, with
        teacher-led recitation and progress tracking.
      </p>
    </article>
  );
}

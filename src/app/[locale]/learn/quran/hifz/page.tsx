import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HifzPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Hifz</h1>
      <p className="mt-4 text-stone-700">
        Daily new lesson, recent review, and old review (new / sabq / qadeem).
      </p>
    </section>
  );
}

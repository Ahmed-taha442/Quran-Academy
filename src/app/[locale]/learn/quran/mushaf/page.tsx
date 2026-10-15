import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function MushafPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-arabic text-3xl">المصحف</h1>
      <p className="mt-4 text-stone-700">
        Uthmani text, ayah audio, and word-by-word highlighting belong in the
        quran module.
      </p>
    </section>
  );
}

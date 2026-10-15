import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { learningTracks } from "@/config/curriculum";

type Props = {
  params: Promise<{ locale: string; stage: string }>;
};

export default async function NoorBayanStagePage({ params }: Props) {
  const { locale, stage } = await params;
  setRequestLocale(locale);

  if (!(learningTracks.noorBayan.stages as readonly string[]).includes(stage)) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-arabic text-3xl">{stage}</h1>
      <p className="mt-4 text-stone-700">
        Interactive letter board, teacher audio, and tracing practice live in
        the noor-bayan module.
      </p>
    </section>
  );
}

import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { IsolatedLettersLesson } from "@/components/noor-bayan/isolated-letters-lesson";
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

  if (stage === "isolated-letters") {
    return <IsolatedLettersLesson />;
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-arabic text-3xl">{stage}</h1>
      <p className="mt-4 text-stone-700">
        Interactive lesson content for this stage is coming soon.
      </p>
    </section>
  );
}

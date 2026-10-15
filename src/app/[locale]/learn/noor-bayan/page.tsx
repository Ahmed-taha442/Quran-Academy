import { getTranslations, setRequestLocale } from "next-intl/server";
import { noorBayanLessons } from "@/modules/noor-bayan";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NoorBayanPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold">{t("noorBayan.title")}</h1>
      <ol className="mt-8 grid gap-3">
        {noorBayanLessons.map((lesson) => (
          <li key={lesson.id}>
            <Link
              href={`/learn/noor-bayan/${lesson.stage}`}
              className="block rounded-xl border border-stone-300 bg-white px-4 py-3"
            >
              {lesson.order}. {t(lesson.titleKey)}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

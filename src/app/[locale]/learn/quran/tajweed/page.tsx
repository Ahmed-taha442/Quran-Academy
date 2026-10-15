import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TajweedPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Tajweed</h1>
      <p className="mt-4 text-stone-700">
        Rules are taught after the student can read, not before letter mastery.
      </p>
    </section>
  );
}

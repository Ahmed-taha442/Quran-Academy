import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireRole } from "@/lib/authorization";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminDashboardPage({ params }: Props) {
  const { locale } = await params;
  await requireRole(locale, ["ADMIN"]);
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold">{t("admin")}</h1>
      <p className="mt-3 text-stone-700">Users, curriculum, media library, and reports.</p>
    </section>
  );
}

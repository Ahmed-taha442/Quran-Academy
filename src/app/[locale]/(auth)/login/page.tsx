import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { getSafeReturnTo } from "@/lib/authorization";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ callbackURL?: string }>;
};

export default async function LoginPage({ params, searchParams }: Props) {
  const [{ locale }, { callbackURL }] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  const returnTo = getSafeReturnTo(callbackURL, locale);

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold">{t("login")}</h1>
      <p className="mt-3 text-stone-600">{locale === "ar" ? "ادخل إلى حسابك لمتابعة رحلة التعلم." : "Sign in to continue your learning journey."}</p>
      <AuthForm locale={locale} mode="login" returnTo={returnTo} googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)} />
      <p className="mt-6 text-center text-sm text-stone-600">
        {locale === "ar" ? "ليس لديك حساب؟ " : "New to NOON? "}
        <Link href={`/register?callbackURL=${encodeURIComponent(returnTo)}`} className="font-semibold text-emerald-800 underline-offset-4 hover:underline">
          {locale === "ar" ? "أنشئ حساب طالب" : "Create a student account"}
        </Link>
      </p>
    </section>
  );
}

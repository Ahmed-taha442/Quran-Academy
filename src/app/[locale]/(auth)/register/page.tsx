import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { getSafeReturnTo } from "@/lib/authorization";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ callbackURL?: string }>;
};

export default async function RegisterPage({ params, searchParams }: Props) {
  const [{ locale }, { callbackURL }] = await Promise.all([params, searchParams]);
  const returnTo = getSafeReturnTo(callbackURL, locale);
  setRequestLocale(locale);

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold">{locale === "ar" ? "إنشاء حساب طالب" : "Create your student account"}</h1>
      <p className="mt-3 text-stone-600">{locale === "ar" ? "ابدأ رحلتك في تعلم العربية والقرآن الكريم." : "Start learning Arabic and the Holy Quran."}</p>
      <AuthForm locale={locale} mode="register" returnTo={returnTo} googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)} />
      <p className="mt-6 text-center text-sm text-stone-600">
        {locale === "ar" ? "لديك حساب بالفعل؟ " : "Already have an account? "}
        <Link href={`/login?callbackURL=${encodeURIComponent(returnTo)}`} className="font-semibold text-emerald-800 underline-offset-4 hover:underline">
          {locale === "ar" ? "تسجيل الدخول" : "Sign in"}
        </Link>
      </p>
    </section>
  );
}

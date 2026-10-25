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
  const copy = locale === "ar"
    ? {
        eyebrow: "أكاديمية نون",
        title: "رحلتك في الحفظ تبدأ بخطوة",
        description: "سجّل دخولك لمتابعة الحفظ والمراجعة، وارجع للمصحف من حيث توقفت.",
        feature1: "متابعة منظمة للحفظ والمراجعة",
        feature2: "مسارات تأسيس في القراءة العربية",
        feature3: "مساحة تعلم خاصة وآمنة",
        cardTitle: "مرحبًا بعودتك",
        cardHint: "أدخل بيانات حسابك للمتابعة.",
      }
    : {
        eyebrow: "NOON ACADEMY",
        title: "Your memorization journey starts here",
        description: "Sign in to continue memorizing, review your progress, and return to the Mushaf where you left off.",
        feature1: "A clear plan for memorization and review",
        feature2: "Arabic reading foundations",
        feature3: "A private, focused learning space",
        cardTitle: "Welcome back",
        cardHint: "Enter your account details to continue.",
      };

  return (
    <section className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-6xl items-center gap-5 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 lg:px-8">
      <aside className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0d5545] via-[#0c5949] to-[#143b35] p-7 text-white shadow-xl shadow-emerald-950/10 sm:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute -end-12 -top-14 -z-10 size-56 rounded-full border-[22px] border-white/[0.07] sm:size-72" />
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-100/80">{copy.eyebrow}</p>
        <h1 className="mt-7 max-w-lg text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{copy.title}</h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-emerald-50/85 sm:text-base">{copy.description}</p>
        <ul className="mt-8 space-y-4">
          {[copy.feature1, copy.feature2, copy.feature3].map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-white/95">
              <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-emerald-50">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </aside>

      <div className="rounded-[2rem] border border-[var(--border)] bg-white p-5 shadow-lg shadow-emerald-950/[0.04] sm:p-8 lg:p-10">
        <div className="mx-auto max-w-md">
          <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-2xl bg-[var(--surface-soft)] text-2xl text-[var(--accent)]">⌑</span>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight">{copy.cardTitle}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{copy.cardHint}</p>
          <AuthForm locale={locale} mode="login" returnTo={returnTo} googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)} />
          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            {locale === "ar" ? "ليس لديك حساب؟ " : "New to NOON? "}
            <Link href={`/register?callbackURL=${encodeURIComponent(returnTo)}`} className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline">
              {locale === "ar" ? "أنشئ حساب طالب" : "Create a student account"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

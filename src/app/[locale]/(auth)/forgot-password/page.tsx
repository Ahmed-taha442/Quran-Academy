import { setRequestLocale } from "next-intl/server";
import { PasswordResetForm } from "@/components/auth/password-reset-form";

type Props = { params: Promise<{ locale: string }> };

export default async function ForgotPasswordPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold">{locale === "ar" ? "إعادة تعيين كلمة المرور" : "Reset your password"}</h1>
      <p className="mt-3 text-stone-600">{locale === "ar" ? "أدخل بريدك الإلكتروني وسنرسل لك رابطًا آمنًا لإعادة التعيين." : "Enter your email and we’ll send a secure reset link."}</p>
      <PasswordResetForm locale={locale} />
    </section>
  );
}

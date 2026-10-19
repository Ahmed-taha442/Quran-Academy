import { setRequestLocale } from "next-intl/server";
import { PasswordResetForm } from "@/components/auth/password-reset-form";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ params, searchParams }: Props) {
  const [{ locale }, { token }] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold">{locale === "ar" ? "اختيار كلمة مرور جديدة" : "Choose a new password"}</h1>
      <p className="mt-3 text-stone-600">{locale === "ar" ? "استخدم كلمة مرور قوية لم تستخدمها من قبل." : "Choose a strong password you haven’t used before."}</p>
      <PasswordResetForm locale={locale} token={token} />
    </section>
  );
}

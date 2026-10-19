"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";

type Props = { locale: string; token?: string };

export function PasswordResetForm({ locale, token }: Props) {
  const router = useRouter();
  const arabic = locale === "ar";
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    setPending(true);
    setMessage("");
    try {
      if (token) {
        const result = await authClient.resetPassword({
          newPassword: String(formData.get("password") ?? ""),
          token,
        });
        if (result.error) throw new Error(result.error.message);
        router.push("/login");
        return;
      }

      await authClient.requestPasswordReset({
        email: String(formData.get("email") ?? "").trim().toLowerCase(),
        redirectTo: new URL(`/${locale}/reset-password`, window.location.origin).toString(),
      });
      setMessage(arabic
        ? "إذا كان البريد مسجلًا، ستصلك رسالة برابط إعادة التعيين."
        : "If the email is registered, you will receive a password reset link.");
    } catch {
      setMessage(arabic ? "تعذر إكمال الطلب. حاول مرة أخرى." : "Could not complete the request. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={submit} className="mt-8 space-y-4">
      {!token ? (
        <label className="block space-y-2 text-sm font-medium">
          <span>{arabic ? "البريد الإلكتروني" : "Email address"}</span>
          <input name="email" type="email" required maxLength={254} autoComplete="email" className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15" />
        </label>
      ) : (
        <label className="block space-y-2 text-sm font-medium">
          <span>{arabic ? "كلمة المرور الجديدة (12 حرفًا على الأقل)" : "New password (at least 12 characters)"}</span>
          <input name="password" type="password" required minLength={12} maxLength={128} autoComplete="new-password" className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15" />
        </label>
      )}
      {message && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{message}</p>}
      <button type="submit" disabled={pending} className="w-full rounded-xl bg-emerald-800 px-4 py-3 font-semibold text-white transition hover:bg-emerald-900 disabled:opacity-60">
        {pending ? "…" : token ? (arabic ? "حفظ كلمة المرور" : "Save new password") : (arabic ? "إرسال رابط إعادة التعيين" : "Send reset link")}
      </button>
    </form>
  );
}

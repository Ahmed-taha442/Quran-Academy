"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Link, useRouter } from "@/i18n/navigation";

type Props = {
  locale: string;
  mode: "login" | "register";
  returnTo: string;
  googleEnabled: boolean;
};

export function AuthForm({ locale, mode, returnTo, googleEnabled }: Props) {
  const router = useRouter();
  const isArabic = locale === "ar";
  const isRegister = mode === "register";
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const copy = isArabic
    ? {
        name: "الاسم الكامل",
        email: "البريد الإلكتروني",
        password: "كلمة المرور (12 حرفًا على الأقل)",
        submit: isRegister ? "إنشاء حساب طالب" : "تسجيل الدخول",
        google: "المتابعة باستخدام Google",
        separator: "أو باستخدام البريد الإلكتروني",
        genericError: "تعذر إكمال العملية. راجع البيانات وحاول مرة أخرى.",
        googleUnavailable: "تسجيل الدخول باستخدام Google غير مُعدّ بعد.",
      }
    : {
        name: "Full name",
        email: "Email address",
        password: "Password (at least 12 characters)",
        submit: isRegister ? "Create student account" : "Sign in",
        google: "Continue with Google",
        separator: "or continue with email",
        genericError: "Could not complete the request. Check your details and try again.",
        googleUnavailable: "Google sign-in is not configured yet.",
      };

  async function handleSubmit(formData: FormData) {
    setError("");
    setPending(true);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const callbackURL = returnTo;

    try {
      if (isRegister) {
        const name = String(formData.get("name") ?? "").trim();
        const result = await authClient.signUp.email({ name, email, password, callbackURL });
        if (result.error) throw new Error(result.error.message);
        if (result.data?.token) {
          router.push(returnTo);
        } else {
          // If the provider did not establish a session during sign-up, authenticate
          // the newly-created account through the normal database-backed sign-in flow.
          const signInResult = await authClient.signIn.email({ email, password, callbackURL });
          if (signInResult.error) throw new Error(signInResult.error.message);
          router.push(returnTo);
        }
      } else {
        const result = await authClient.signIn.email({ email, password, callbackURL });
        if (result.error) throw new Error(result.error.message);
        const role = result.data
          ? (result.data.user as typeof result.data.user & { role?: string }).role
          : undefined;
        const dashboard = role === "TEACHER"
          ? "/teacher/dashboard"
          : role === "ADMIN"
            ? "/admin/dashboard"
            : "/student/dashboard";
        router.push(dashboard);
      }
    } catch {
      setError(copy.genericError);
    } finally {
      setPending(false);
    }
  }

  async function signInWithGoogle() {
    setError("");
    setPending(true);
    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: returnTo,
    });
    if (result.error) {
      setError(copy.genericError);
      setPending(false);
    }
  }

  return (
    <div className="mt-8 space-y-5">
      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={pending || !googleEnabled}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-stone-300 bg-white px-4 py-3 font-semibold text-stone-800 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span aria-hidden="true" className="text-lg font-bold text-[#4285F4]">G</span>
        {copy.google}
      </button>
      {!googleEnabled && <p className="-mt-3 text-center text-xs text-stone-500">{copy.googleUnavailable}</p>}

      <p className="text-center text-sm text-stone-500">{copy.separator}</p>

      <form action={handleSubmit} className="space-y-4">
        {isRegister && (
          <label className="block space-y-2 text-sm font-medium">
            <span>{copy.name}</span>
            <input name="name" required minLength={2} maxLength={80} autoComplete="name" className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15" />
          </label>
        )}
        <label className="block space-y-2 text-sm font-medium">
          <span>{copy.email}</span>
          <input name="email" type="email" required maxLength={254} autoComplete="email" className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15" />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{copy.password}</span>
          <input name="password" type="password" required minLength={12} maxLength={128} autoComplete={isRegister ? "new-password" : "current-password"} className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15" />
        </label>
        {error && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{error}</p>}
        <button type="submit" disabled={pending} className="w-full rounded-xl bg-emerald-800 px-4 py-3 font-semibold text-white transition hover:bg-emerald-900 disabled:opacity-60">
          {pending ? "…" : copy.submit}
        </button>
        {!isRegister && (
          <div className="text-end text-sm">
            <Link href="/forgot-password" className="font-medium text-emerald-800 underline-offset-4 hover:underline">
              {isArabic ? "نسيت كلمة المرور؟" : "Forgot password?"}
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}

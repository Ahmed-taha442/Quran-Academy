import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type AcademyRole = "STUDENT" | "TEACHER" | "ADMIN" | "GUARDIAN";

export function getSafeReturnTo(value: string | undefined, locale: string) {
  const fallback = `/${locale}/student/dashboard`;
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }

  try {
    const target = new URL(value, "https://noon-academy.invalid");
    if (target.origin !== "https://noon-academy.invalid" || target.pathname.startsWith("/api/")) {
      return fallback;
    }
    return `${target.pathname}${target.search}`;
  } catch {
    return fallback;
  }
}

const dashboardByRole: Record<AcademyRole, string> = {
  STUDENT: "student/dashboard",
  TEACHER: "teacher/dashboard",
  ADMIN: "admin/dashboard",
  GUARDIAN: "",
};

export async function requireRole(locale: string, allowedRoles: AcademyRole[]) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = session
    ? (session.user as typeof session.user & { role?: AcademyRole }).role
    : undefined;

  if (!session || !role) redirect(`/${locale}/login`);
  if (!allowedRoles.includes(role)) {
    const dashboard = dashboardByRole[role];
    redirect(dashboard ? `/${locale}/${dashboard}` : `/${locale}`);
  }

  return session;
}

export async function requireAuthenticated(locale: string, returnTo: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    const loginUrl = `/${locale}/login?callbackURL=${encodeURIComponent(returnTo)}`;
    redirect(loginUrl as never);
  }

  return session;
}

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type AcademyRole = "STUDENT" | "TEACHER" | "ADMIN" | "GUARDIAN";

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

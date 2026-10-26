import type { Prisma } from "@prisma/client";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authorization";

type Props = {
  locale: string;
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>;
};

const pageSize = 25;

export async function AdminStudentsSection({ locale, searchParams }: Props) {
  await requireRole(locale, ["ADMIN"]);
  const isArabic = locale === "ar";
  const queryParams = await searchParams;
  const rawQuery = Array.isArray(queryParams.q) ? queryParams.q[0] : queryParams.q;
  const search = rawQuery?.trim().slice(0, 100) ?? "";
  const rawPage = Array.isArray(queryParams.page) ? queryParams.page[0] : queryParams.page;
  const requestedPage = Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1);

  const where: Prisma.StudentProfileWhereInput = search
    ? {
        user: {
          OR: [
            { displayName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
      }
    : {};

  const [totalStudents, assignedStudents, unassignedStudents, filteredCount] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.studentProfile.count({ where: { teacherId: { not: null } } }),
    prisma.studentProfile.count({ where: { teacherId: null } }),
    prisma.studentProfile.count({ where }),
  ]);

  const pageCount = Math.max(1, Math.ceil(filteredCount / pageSize));
  const page = Math.min(requestedPage, pageCount);
  const students = await prisma.studentProfile.findMany({
    where,
    orderBy: { user: { createdAt: "desc" } },
    skip: (page - 1) * pageSize,
    take: pageSize,
    select: {
      id: true,
      teacherId: true,
      user: { select: { displayName: true, email: true, createdAt: true } },
      enrollments: {
        select: {
          course: {
            select: {
              track: true,
              _count: { select: { lessons: true } },
            },
          },
        },
      },
      progress: {
        where: { status: "COMPLETED" },
        orderBy: { updatedAt: "desc" },
        take: 1,
        select: { updatedAt: true },
      },
      quranActivities: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
      _count: { select: { progress: { where: { status: "COMPLETED" } } } },
    },
  });

  const teacherIds = [...new Set(students.flatMap((student) => student.teacherId ? [student.teacherId] : []))];
  const teachers = teacherIds.length
    ? await prisma.user.findMany({ where: { id: { in: teacherIds }, role: "TEACHER" }, select: { id: true, displayName: true } })
    : [];
  const teacherNames = new Map(teachers.map((teacher) => [teacher.id, teacher.displayName]));
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });

  const copy = isArabic
    ? {
        eyebrow: "إدارة الأكاديمية",
        title: "إدارة الطلاب",
        description: "ملفات الطلاب، البرامج المسجلين بها، تقدم الدروس، والمعلم المسؤول.",
        total: "إجمالي الطلاب",
        assigned: "لديهم معلم",
        unassigned: "دون معلم",
        search: "ابحث بالاسم أو البريد الإلكتروني",
        searchButton: "بحث",
        clear: "مسح البحث",
        student: "الطالب",
        teacher: "المعلم",
        program: "البرنامج",
        progress: "الدروس المكتملة",
        lastActivity: "آخر نشاط",
        noTeacher: "غير مسند",
        noProgram: "غير مسجل ببرنامج",
        quran: "القرآن الكريم",
        foundation: "التأسيس العربي",
        lessons: "درسًا",
        noActivity: "لا يوجد نشاط مسجل",
        noResults: "لا توجد نتائج مطابقة للبحث.",
        noStudents: "لا يوجد طلاب مسجلون حتى الآن.",
        showing: "عرض",
        of: "من",
        previous: "السابق",
        next: "التالي",
        page: "صفحة",
      }
    : {
        eyebrow: "Academy administration",
        title: "Student management",
        description: "Student profiles, enrolled programs, lesson progress, and assigned teachers.",
        total: "Total students",
        assigned: "With a teacher",
        unassigned: "Without a teacher",
        search: "Search by name or email",
        searchButton: "Search",
        clear: "Clear search",
        student: "Student",
        teacher: "Teacher",
        program: "Program",
        progress: "Lessons completed",
        lastActivity: "Last activity",
        noTeacher: "Unassigned",
        noProgram: "No program enrolled",
        quran: "Quran",
        foundation: "Arabic foundations",
        lessons: "lessons",
        noActivity: "No activity recorded",
        noResults: "No students match this search.",
        noStudents: "No students have registered yet.",
        showing: "Showing",
        of: "of",
        previous: "Previous",
        next: "Next",
        page: "Page",
      };

  const pageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    params.set("page", String(targetPage));
    return `/${locale}/admin/students?${params.toString()}`;
  };

  return (
    <section className="space-y-6 pb-10">
      <header className="rounded-3xl bg-gradient-to-br from-[#0d5545] via-[#0c5949] to-[#143b35] p-6 text-white shadow-lg sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">{copy.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold">{copy.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">{copy.description}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          [copy.total, totalStudents],
          [copy.assigned, assignedStudents],
          [copy.unassigned, unassignedStudents],
        ].map(([label, value]) => (
          <article key={label} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-stone-600">{label}</p>
            <p className="mt-3 text-3xl font-bold text-emerald-950">{value}</p>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <form action={`/${locale}/admin/students`} method="get" className="flex flex-col gap-2 sm:flex-row">
          <label className="min-w-0 flex-1">
            <span className="sr-only">{copy.search}</span>
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder={copy.search}
              className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            />
          </label>
          <button type="submit" className="min-h-11 rounded-xl bg-[#003f32] px-5 text-sm font-semibold text-white transition hover:bg-[#0d5545]">{copy.searchButton}</button>
          {search && <Link href="/admin/students" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-200 px-4 text-sm font-semibold text-stone-700 hover:bg-stone-50">{copy.clear}</Link>}
        </form>

        <div className="mt-5 overflow-x-auto rounded-xl border border-stone-200">
          <table className="w-full min-w-[58rem] border-collapse text-start text-sm">
            <thead className="bg-stone-50 text-stone-600">
              <tr>
                {[copy.student, copy.teacher, copy.program, copy.progress, copy.lastActivity].map((heading) => <th key={heading} scope="col" className="px-4 py-3 font-semibold">{heading}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {students.map((student) => {
                const programs = [...new Set(student.enrollments.map(({ course }) => course.track))];
                const totalLessons = student.enrollments.reduce((sum, { course }) => sum + course._count.lessons, 0);
                const completedLessons = student._count.progress;
                const lessonProgress = totalLessons > 0
                  ? `${Math.min(completedLessons, totalLessons)} / ${totalLessons} ${copy.lessons}`
                  : completedLessons > 0
                    ? `${completedLessons} ${copy.lessons}`
                    : "—";
                const lastActivity = [student.progress[0]?.updatedAt, student.quranActivities[0]?.createdAt]
                  .filter((date): date is Date => Boolean(date))
                  .sort((a, b) => b.getTime() - a.getTime())[0];

                return (
                  <tr key={student.id} className="align-top hover:bg-stone-50/70">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-stone-900">{student.user.displayName}</p>
                      <p className="mt-1 text-xs text-stone-500">{student.user.email}</p>
                    </td>
                    <td className="px-4 py-4 text-stone-700">{student.teacherId ? teacherNames.get(student.teacherId) ?? copy.noTeacher : copy.noTeacher}</td>
                    <td className="px-4 py-4">
                      {programs.length ? <div className="flex flex-wrap gap-1.5">{programs.map((program) => <span key={program} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-900">{program === "QURAN" ? copy.quran : copy.foundation}</span>)}</div> : <span className="text-stone-500">{copy.noProgram}</span>}
                    </td>
                    <td className="px-4 py-4 text-stone-700">{lessonProgress}</td>
                    <td className="px-4 py-4 text-stone-600">{lastActivity ? dateFormatter.format(lastActivity) : copy.noActivity}</td>
                  </tr>
                );
              })}
              {students.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-stone-500">{search ? copy.noResults : copy.noStudents}</td></tr>}
            </tbody>
          </table>
        </div>

        <footer className="mt-4 flex flex-col gap-3 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">
          <p>{copy.showing} {filteredCount === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredCount)} {copy.of} {filteredCount}</p>
          <nav aria-label={isArabic ? "صفحات الطلاب" : "Student pages"} className="flex items-center justify-between gap-2 sm:justify-end">
            <a aria-disabled={page <= 1} href={page > 1 ? pageHref(page - 1) : undefined} className="rounded-lg border border-stone-200 px-3 py-2 aria-disabled:pointer-events-none aria-disabled:opacity-40">{copy.previous}</a>
            <span className="px-2">{copy.page} {page} / {pageCount}</span>
            <a aria-disabled={page >= pageCount} href={page < pageCount ? pageHref(page + 1) : undefined} className="rounded-lg border border-stone-200 px-3 py-2 aria-disabled:pointer-events-none aria-disabled:opacity-40">{copy.next}</a>
          </nav>
        </footer>
      </section>
    </section>
  );
}

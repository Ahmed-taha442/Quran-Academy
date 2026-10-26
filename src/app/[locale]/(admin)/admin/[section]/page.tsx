import { notFound } from "next/navigation";
import { AdminStudentsSection } from "@/components/admin/admin-students-section";
import { AdminSectionPage } from "@/components/admin/admin-section-page";

type Props = {
  params: Promise<{ locale: string; section: string }>;
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>;
};

const sections = {
  users: {
    title: ["إدارة المستخدمين", "User management"], description: ["استعرض حسابات الأكاديمية وأدر أدوار الوصول وحالة الحساب.", "Review academy accounts and manage access roles and account status."],
    metrics: [["إجمالي الحسابات", "Total accounts"], ["حسابات نشطة", "Active accounts"], ["بانتظار المراجعة", "Needs review"]],
    actions: [["إضافة مستخدم", "Add user"], ["تصدير القائمة", "Export list"]], columns: [["الاسم", "Name"], ["البريد الإلكتروني", "Email"], ["الدور", "Role"], ["الحالة", "Status"], ["تاريخ الإنشاء", "Created"]],
  },
  students: {
    title: ["إدارة الطلاب", "Student management"], description: ["ملفات الطلاب ومستوى التقدم وربط كل طالب بمعلمه.", "Student profiles, learning progress, and teacher assignments."],
    metrics: [["إجمالي الطلاب", "Total students"], ["طلاب لديهم معلم", "Assigned to a teacher"], ["طلاب غير مرتبطين", "Unassigned students"]],
    actions: [["إضافة طالب", "Add student"], ["ربط بمعلم", "Assign teacher"]], columns: [["الطالب", "Student"], ["المعلم", "Teacher"], ["البرنامج", "Program"], ["التقدم", "Progress"], ["آخر نشاط", "Last activity"]],
  },
  teachers: {
    title: ["إدارة المعلمين", "Teacher management"], description: ["ملفات المعلمين وتوزيع الطلاب ومتابعة عبء التدريس.", "Teacher profiles, student assignments, and teaching load."],
    metrics: [["إجمالي المعلمين", "Total teachers"], ["طلاب مسندون", "Assigned students"], ["دون طلاب", "Without students"]],
    actions: [["إضافة معلم", "Add teacher"], ["توزيع الطلاب", "Assign students"]], columns: [["المعلم", "Teacher"], ["البريد الإلكتروني", "Email"], ["عدد الطلاب", "Students"], ["الحالة", "Status"], ["آخر نشاط", "Last activity"]],
  },
  curriculum: {
    title: ["المناهج والبرامج", "Curriculum & programs"], description: ["إدارة مسارات القرآن والتأسيس والوحدات التعليمية ومصادرها.", "Manage Quran and Arabic foundations tracks, units, and resources."],
    metrics: [["البرامج", "Programs"], ["الوحدات", "Units"], ["الدروس", "Lessons"]],
    actions: [["إضافة برنامج", "Add program"], ["إضافة وحدة", "Add unit"]], columns: [["البرنامج", "Program"], ["الوحدات", "Units"], ["الدروس", "Lessons"], ["الطلاب", "Students"], ["الحالة", "Status"]],
  },
  sessions: {
    title: ["الجلسات المباشرة", "Live sessions"], description: ["نظرة على مواعيد الدروس والمعلمين والطلاب والحضور.", "Review lesson schedules, teachers, students, and attendance."],
    metrics: [["جلسات اليوم", "Today's sessions"], ["جلسات قادمة", "Upcoming sessions"], ["تحتاج متابعة", "Need follow-up"]],
    actions: [["جدولة جلسة", "Schedule session"], ["عرض التقويم", "View calendar"]], columns: [["الموضوع", "Topic"], ["المعلم", "Teacher"], ["الطلاب", "Students"], ["الموعد", "Time"], ["الحالة", "Status"]],
  },
  reports: {
    title: ["التقارير والتحليلات", "Reports & analytics"], description: ["ملخص التسجيل والتقدم والنشاط عبر البرامج والفصول.", "Summaries of enrollment, progress, and activity across programs and sessions."],
    metrics: [["التسجيلات الجديدة", "New enrollments"], ["معدل الحضور", "Attendance rate"], ["نشاط الحفظ", "Memorization activity"]],
    actions: [["تصدير تقرير", "Export report"], ["تحديد الفترة", "Choose date range"]], columns: [["المؤشر", "Metric"], ["الفترة الحالية", "Current period"], ["الفترة السابقة", "Previous period"], ["التغير", "Change"]],
  },
  settings: {
    title: ["إعدادات الأكاديمية", "Academy settings"], description: ["هيكل إعدادات اللغة والمظهر وسياسات الأدوار والإشعارات.", "Structure for locale, appearance, role policies, and notifications."],
    metrics: [["اللغات", "Languages"], ["الأدوار", "Roles"], ["التكاملات", "Integrations"]],
    actions: [["حفظ الإعدادات", "Save settings"], ["إعادة الضبط", "Reset"]], columns: [["الإعداد", "Setting"], ["القيمة الحالية", "Current value"], ["الوصف", "Description"], ["آخر تعديل", "Last updated"]],
  },
} as const;

export default async function AdminSectionRoute({ params, searchParams }: Props) {
  const { locale, section } = await params;
  const content = sections[section as keyof typeof sections];
  if (!content) notFound();
  if (section === "students") return <AdminStudentsSection locale={locale} searchParams={searchParams} />;
  return <AdminSectionPage locale={locale} title={locale === "ar" ? content.title[0] : content.title[1]} description={locale === "ar" ? content.description[0] : content.description[1]} metrics={content.metrics.map(([ar, en]) => ({ ar, en }))} actions={content.actions.map(([ar, en]) => ({ ar, en }))} columns={content.columns.map(([ar, en]) => ({ ar, en }))} />;
}

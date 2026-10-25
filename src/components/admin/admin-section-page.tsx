type Props = {
  locale: string;
  title: string;
  description: string;
  metrics: { ar: string; en: string }[];
  actions: { ar: string; en: string }[];
  columns: { ar: string; en: string }[];
};

export function AdminSectionPage({ locale, title, description, metrics, actions, columns }: Props) {
  const isArabic = locale === "ar";
  return (
    <section className="space-y-6 pb-10">
      <header className="rounded-3xl bg-gradient-to-br from-[#0d5545] via-[#0c5949] to-[#143b35] p-6 text-white shadow-lg sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">{isArabic ? "لوحة المدير" : "Administrator workspace"}</p>
        <h1 className="mt-3 text-3xl font-bold">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90">{description}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map((metric) => <div key={metric.en} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"><p className="text-sm text-stone-600">{isArabic ? metric.ar : metric.en}</p><p className="mt-3 text-3xl font-bold text-emerald-950">—</p></div>)}
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="min-w-52 flex-1"><span className="sr-only">{isArabic ? "بحث" : "Search"}</span><input disabled placeholder={isArabic ? "بحث… (قريبًا)" : "Search… (coming soon)"} className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm text-stone-700 disabled:cursor-not-allowed" /></label>
          <div className="flex flex-wrap gap-2">{actions.map((action) => <button key={action.en} type="button" disabled title={isArabic ? "سيتم تفعيل هذا التحكم في مرحلة ربط البيانات" : "This control will be enabled when data actions are implemented"} className="min-h-10 rounded-xl border border-stone-200 px-3 text-sm font-semibold text-stone-500 disabled:cursor-not-allowed disabled:bg-stone-50">{isArabic ? action.ar : action.en}</button>)}</div>
        </div>

        <div className="mt-5 overflow-x-auto rounded-xl border border-stone-200">
          <table className="w-full min-w-[38rem] border-collapse text-start text-sm">
            <thead className="bg-stone-50 text-stone-600"><tr>{columns.map((column) => <th key={column.en} scope="col" className="px-4 py-3 font-semibold">{isArabic ? column.ar : column.en}</th>)}</tr></thead>
            <tbody><tr><td colSpan={columns.length} className="px-4 py-12 text-center text-stone-500">{isArabic ? "ستظهر البيانات هنا عند ربط هذه الصفحة بقاعدة البيانات." : "Data will appear here when this page is connected to the database."}</td></tr></tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-5 text-stone-500">{isArabic ? "هذه واجهة أولية فقط؛ البحث والتصفية والإضافة والتعديل لم تُربط بقاعدة البيانات بعد." : "This is a UI scaffold. Search, filters, create, and edit actions are not connected to the database yet."}</p>
      </section>
    </section>
  );
}

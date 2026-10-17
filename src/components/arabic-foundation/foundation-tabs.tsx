"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";

const resources = [
  {
    id: "letters",
    href: "https://wordwall.net/teacher/2368183/folder/2928771/%D9%85%D9%86%D9%87%D8%AC-%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D8%A6%D9%8A%D8%A9-%D8%A8%D8%A7%D9%84%D8%A3%D9%84%D8%B9%D8%A7%D8%A8-%D8%A7%D9%84%D8%AA%D8%B9%D9%84%D9%8A%D9%85%D9%8A%D8%A9-jfj/1-%D8%A7%D9%84%D8%AD%D8%B1%D9%88%D9%81",
  },
  {
    id: "shortVowels",
    href: "https://wordwall.net/teacher/2368183/folder/2928790/%D9%85%D9%86%D9%87%D8%AC-%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D8%A6%D9%8A%D8%A9-%D8%A8%D8%A7%D9%84%D8%A3%D9%84%D8%B9%D8%A7%D8%A8-%D8%A7%D9%84%D8%AA%D8%B9%D9%84%D9%8A%D9%85%D9%8A%D8%A9-jfj/2-%D8%A7%D9%84%D8%AD%D8%B1%D9%83%D8%A7%D8%AA-%D8%A7%D9%84%D8%AB%D9%84%D8%A7%D8%AB",
  },
  {
    id: "longVowels",
    href: "https://wordwall.net/teacher/2368183/folder/2910248/%D9%85%D9%86%D9%87%D8%AC-%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D8%A6%D9%8A%D8%A9-%D8%A8%D8%A7%D9%84%D8%A3%D9%84%D8%B9%D8%A7%D8%A8-%D8%A7%D9%84%D8%AA%D8%B9%D9%84%D9%8A%D9%85%D9%8A%D8%A9-jfj/3-%D8%A7%D9%84%D9%85%D8%AF%D9%88%D8%AF-%D8%A7%D9%84%D8%AB%D9%84%D8%A7%D8%AB",
  },
  {
    id: "tanween",
    href: "https://wordwall.net/teacher/2368183/folder/2928765/%D9%85%D9%86%D9%87%D8%AC-%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D8%A6%D9%8A%D8%A9-%D8%A8%D8%A7%D9%84%D8%A3%D9%84%D8%B9%D8%A7%D8%A8-%D8%A7%D9%84%D8%AA%D8%B9%D9%84%D9%8A%D9%85%D9%8A%D8%A9-jfj/4-%D8%A7%D9%84%D8%AA%D9%86%D9%88%D9%8A%D9%86",
  },
  {
    id: "sukoon",
    href: "https://wordwall.net/teacher/2368183/folder/3109796/%D9%85%D9%86%D9%87%D8%AC-%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D8%A6%D9%8A%D8%A9-%D8%A8%D8%A7%D9%84%D8%A3%D9%84%D8%B9%D8%A7%D8%A8-%D8%A7%D9%84%D8%AA%D8%B9%D9%84%D9%8A%D9%85%D9%8A%D8%A9-jfj/5-%D8%A7%D9%84%D8%B3%D9%83%D9%88%D9%86",
  },
  {
    id: "shadda",
    href: "https://wordwall.net/teacher/2368183/folder/3246322/%D9%85%D9%86%D9%87%D8%AC-%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D8%A6%D9%8A%D8%A9-%D8%A8%D8%A7%D9%84%D8%A3%D9%84%D8%B9%D8%A7%D8%A8-%D8%A7%D9%84%D8%AA%D8%B9%D9%84%D9%8A%D9%85%D9%8A%D8%A9-jfj/6-%D8%A7%D9%84%D8%B4%D8%AF%D8%A9",
  },
  {
    id: "noorBayan",
    href: "https://drive.google.com/file/d/1KvPgr1fd118LSq-2xBdCTonlUC-Rbfcr/view?pli=1",
  },
] as const;

type ResourceId = (typeof resources)[number]["id"];
type Direction = "ltr" | "rtl";

export function FoundationTabs({ direction }: { direction: Direction }) {
  const t = useTranslations("arabicFoundation");
  const [activeId, setActiveId] = useState<ResourceId>(resources[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = resources.findIndex((resource) => resource.id === activeId);
  const activeResource = resources[activeIndex];
  const isDriveResource = activeResource.id === "noorBayan";

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const nextKey = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
    const previousKey = direction === "rtl" ? "ArrowRight" : "ArrowLeft";
    let nextIndex: number | undefined;

    if (event.key === nextKey) nextIndex = (index + 1) % resources.length;
    if (event.key === previousKey) nextIndex = (index + resources.length - 1) % resources.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = resources.length - 1;

    if (nextIndex !== undefined) {
      event.preventDefault();
      setActiveId(resources[nextIndex].id);
      tabRefs.current[nextIndex]?.focus();
    }
  }

  return (
    <div className="mt-8">
      <div className="overflow-x-auto pb-2" role="tablist" aria-label={t("tablist")} dir={direction}>
        <div className="flex min-w-max gap-2">
          {resources.map((resource, index) => (
            <button
              key={resource.id}
              ref={(element) => { tabRefs.current[index] = element; }}
              id={`foundation-tab-${resource.id}`}
              type="button"
              role="tab"
              aria-selected={activeId === resource.id}
              aria-controls="foundation-tab-panel"
              tabIndex={activeId === resource.id ? 0 : -1}
              onClick={() => setActiveId(resource.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={`min-h-14 min-w-[145px] rounded-2xl border px-4 py-3 text-sm font-bold transition sm:min-w-[160px] ${activeId === resource.id ? "border-emerald-800 bg-emerald-800 text-white shadow-md shadow-emerald-950/10" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"}`}
            >
              <span className="mb-0.5 block text-[11px] font-semibold opacity-70">{index + 1} / {resources.length}</span>
              {t(`tabs.${resource.id}`)}
            </button>
          ))}
        </div>
      </div>

      <section
        id="foundation-tab-panel"
        role="tabpanel"
        aria-labelledby={`foundation-tab-${activeResource.id}`}
        tabIndex={0}
        className="mt-5 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-8 lg:p-10"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-800">
              {isDriveResource ? t("drive") : t("wordwall")}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
              {t(`tabs.${activeResource.id}`)}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {t(`descriptions.${activeResource.id}`)}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {isDriveResource ? t("driveNote") : t("wordwallNote")}
            </p>
          </div>

          <a
            href={activeResource.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-2xl bg-emerald-800 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
          >
            {isDriveResource ? t("openDrive") : t("openWordwall")}
            <span aria-hidden="true" className="text-lg">↗</span>
          </a>
        </div>
      </section>
    </div>
  );
}

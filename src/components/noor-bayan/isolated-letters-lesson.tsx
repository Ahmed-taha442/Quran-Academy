"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const letters = [
  { char: "أ", name: "أَلِف", transliteration: "alif", dots: 0, shapeKey: "alifShape", guideKey: "alifGuide" },
  { char: "ب", name: "بَاء", transliteration: "baa", dots: 1, shapeKey: "baShape", guideKey: "baGuide" },
  { char: "ت", name: "تَاء", transliteration: "taa", dots: 2, shapeKey: "taShape", guideKey: "taGuide" },
  { char: "ث", name: "ثَاء", transliteration: "thaa", dots: 3, shapeKey: "thaShape", guideKey: "thaGuide" },
] as const;

type Tab = "study" | "review";

export function IsolatedLettersLesson() {
  const t = useTranslations("noorBayan.isolatedLesson");
  const [tab, setTab] = useState<Tab>("study");
  const [activeIndex, setActiveIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const active = letters[activeIndex];

  function selectLetter(index: number) {
    setActiveIndex(index);
    setAnswer(null);
    setChecked(false);
  }

  function nextLetter() {
    selectLetter((activeIndex + 1) % letters.length);
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f7f8f5] px-3 py-5 text-slate-900 sm:px-6 sm:py-8">
      <div className="mx-auto grid max-w-[1600px] gap-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-7">
        <section className="min-w-0 rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-7 lg:p-9">
          <header className="mb-6 border-b border-slate-100 pb-5 sm:mb-8 sm:pb-7">
            <Link href="/learn/noor-bayan" className="text-sm font-semibold text-emerald-800 hover:underline">← {t("back")}</Link>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">نور البيان · ١</p>
            <h1 className="mt-2 font-arabic text-3xl font-bold sm:text-4xl">{t("title")}</h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">{t("intro")}</p>
          </header>

          <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1.5" role="tablist" aria-label={t("title")}>
            {(["study", "review"] as const).map((item) => (
              <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`min-h-12 rounded-xl px-3 text-sm font-bold transition sm:px-4 ${tab === item ? "bg-white text-emerald-800 shadow-sm" : "text-slate-600 hover:text-emerald-800"}`}>
                {t(item)}
              </button>
            ))}
          </div>

          {tab === "study" ? (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.7fr)]">
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-[#e8e1c9] bg-[#fffdf5] p-5 sm:min-h-[480px] sm:p-8">
                <span className="mb-3 rounded-full bg-white px-4 py-1 text-sm font-semibold text-slate-600 shadow-sm">{t("letter")} {activeIndex + 1} / {letters.length}</span>
                <div className="font-arabic text-[clamp(10rem,32vw,19rem)] leading-[1.05] text-black" lang="ar" dir="rtl" aria-label={`${t("letterAlt")} ${active.char}`}>
                  {active.char}
                </div>
                <div className="mt-2 text-center">
                  <p className="font-arabic text-3xl font-bold" lang="ar" dir="rtl">{active.name}</p>
                  <p className="mt-1 text-sm font-medium text-slate-500">{active.transliteration}</p>
                </div>
                <div className="mt-7 flex w-full max-w-lg items-center justify-between gap-3">
                  <button type="button" aria-label={t("previous")} onClick={() => selectLetter((activeIndex + letters.length - 1) % letters.length)} className="min-h-12 min-w-12 rounded-xl border border-emerald-200 bg-white px-4 text-2xl font-bold text-emerald-900 hover:bg-emerald-50">‹</button>
                  <p className="font-arabic text-2xl tracking-[0.35em] text-emerald-800" lang="ar" dir="rtl">أ ب ت ث</p>
                  <button type="button" aria-label={t("next")} onClick={nextLetter} className="min-h-12 min-w-12 rounded-xl border border-emerald-200 bg-white px-4 text-2xl font-bold text-emerald-900 hover:bg-emerald-50">›</button>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-3xl bg-emerald-50/70 p-5 sm:p-7">
                <article className="rounded-2xl border border-emerald-100 bg-white p-5 sm:p-6">
                  <p className="text-sm font-bold text-slate-500">{t("shape")}</p>
                  <p className="mt-2 text-lg font-semibold leading-8 text-slate-900">{t(active.shapeKey)}</p>
                </article>
                <article className="rounded-2xl border border-emerald-100 bg-white p-5 sm:p-6">
                  <p className="text-sm font-bold text-slate-500">{t("dotCount")}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="font-arabic text-5xl leading-none text-black" lang="ar" dir="rtl">{active.char}</span>
                    <span className="text-lg font-semibold text-slate-900">{active.dots}</span>
                    <span className="flex gap-1.5" aria-label={`${active.dots} ${t("dotCount")}`}>
                      {Array.from({ length: active.dots }, (_, index) => <span key={index} className="h-2.5 w-2.5 rounded-full bg-emerald-700" />)}
                    </span>
                  </div>
                  {active.char === "أ" && <p className="mt-3 text-sm leading-6 text-amber-800">{t("alifNote")}</p>}
                </article>
                <article className="rounded-2xl border border-emerald-100 bg-white p-5 sm:p-6">
                  <p className="text-sm font-bold text-slate-500">{t("guide")}</p>
                  <p className="mt-2 text-base leading-7 text-slate-800">{t(active.guideKey)}</p>
                </article>
                <p className="text-xs leading-5 text-slate-500">{t("tip")}</p>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl rounded-3xl border border-slate-100 bg-white p-5 sm:p-8">
              <div className="flex flex-col items-center">
                <p className="text-sm font-bold text-emerald-800">{t("question")}</p>
                <span className="my-3 font-arabic text-[clamp(8rem,25vw,13rem)] leading-tight text-black" lang="ar" dir="rtl">{active.char}</span>
                <p className="font-arabic text-xl font-bold" lang="ar" dir="rtl">{active.name}</p>
              </div>
              <p className="mt-6 text-center font-bold">{t("dotCount")}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[0, 1, 2, 3].map((count) => {
                  const isCorrect = checked && count === active.dots;
                  const isWrong = checked && answer === count && count !== active.dots;
                  return <button type="button" key={count} disabled={checked} onClick={() => setAnswer(count)} className={`min-h-14 rounded-xl border-2 px-2 font-semibold transition ${isCorrect ? "border-emerald-600 bg-emerald-50 text-emerald-900" : isWrong ? "border-rose-400 bg-rose-50 text-rose-800" : answer === count ? "border-emerald-700 bg-emerald-50" : "border-slate-200 hover:border-emerald-400"}`}>{count}</button>;
                })}
              </div>
              {checked && <p role="status" className={`mt-5 text-center font-bold ${answer === active.dots ? "text-emerald-800" : "text-rose-700"}`}>{answer === active.dots ? t("correct") : t("incorrect")}</p>}
              <div className="mt-6 flex justify-center">
                {!checked ? <button type="button" disabled={answer === null} onClick={() => setChecked(true)} className="min-h-12 rounded-xl bg-emerald-700 px-8 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{t("check")}</button> : <button type="button" onClick={nextLetter} className="min-h-12 rounded-xl bg-emerald-700 px-8 font-bold text-white">{t("next")}</button>}
              </div>
            </div>
          )}
        </section>

        <aside className="flex flex-col gap-4 xl:sticky xl:top-5 xl:self-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-bold text-slate-500">{t("progress")}</p>
            <div className="mt-3 flex gap-2" aria-label={`${activeIndex + 1} / ${letters.length}`}>
              {letters.map((item, index) => <span key={item.char} className={`h-2 flex-1 rounded-full ${index <= activeIndex ? "bg-emerald-600" : "bg-slate-200"}`} />)}
            </div>
            <div className="mt-5 grid grid-cols-4 gap-2">
              {letters.map((item, index) => <button key={item.char} type="button" onClick={() => selectLetter(index)} aria-current={activeIndex === index ? "step" : undefined} aria-label={`${t("letter")} ${item.char}`} className={`flex min-h-[58px] items-center justify-center rounded-xl font-arabic text-3xl ${activeIndex === index ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100"}`}>{item.char}</button>)}
            </div>
            <button type="button" onClick={() => setTab("review")} className="mt-5 min-h-12 w-full rounded-xl bg-slate-900 px-4 font-bold text-white hover:bg-slate-800">{t("review")}</button>
          </div>
          <a href="https://wordwall.net/teacher/2368183/folder/2780796/%D9%85%D9%86%D9%87%D8%AC-%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D8%A6%D9%8A%D8%A9-%D8%A8%D8%A7%D9%84%D8%A3%D9%84%D8%B9%D8%A7%D8%A8-%D8%A7%D9%84%D8%AA%D8%B9%D9%84%D9%8A%D9%85%D9%8A%D8%A9-jfj/1-%D8%A7%D9%84%D8%AD%D8%B1%D9%88%D9%81/1-review-%D8%A3-%D8%A8-%D8%AA-%D8%AB" target="_blank" rel="noreferrer" className="rounded-3xl border border-amber-200 bg-amber-50 p-5 transition hover:border-amber-400 hover:bg-amber-100 sm:p-6">
            <span className="flex items-center justify-between gap-3 font-bold text-amber-950"><span>{t("wordwall")}</span><span aria-hidden="true">↗</span></span>
            <span className="mt-2 block text-sm leading-6 text-amber-900/80">{t("wordwallHint")}</span>
          </a>
        </aside>
      </div>
    </main>
  );
}

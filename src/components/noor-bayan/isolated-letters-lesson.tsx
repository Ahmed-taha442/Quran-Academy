"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const letters = [
  { char: "أ", name: "أَلِف", sound: "أَ", roman: "alif", dots: 0, position: "none" },
  { char: "ب", name: "بَاء", sound: "بَ", roman: "baa", dots: 1, position: "below" },
  { char: "ت", name: "تَاء", sound: "تَ", roman: "taa", dots: 2, position: "above" },
  { char: "ث", name: "ثَاء", sound: "ثَ", roman: "thaa", dots: 3, position: "above" },
] as const;

type Tab = "explore" | "dots" | "quiz";
function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA";
  utterance.rate = 0.78;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

export function IsolatedLettersLesson() {
  const t = useTranslations("noorBayan.isolatedLesson");
  const [tab, setTab] = useState<Tab>("explore");
  const [activeIndex, setActiveIndex] = useState(0);
  const [dotAnswer, setDotAnswer] = useState<number | null>(null);
  const [dotChecked, setDotChecked] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const active = letters[activeIndex];
  const quizLetter = letters[(quizIndex * 3 + 1) % letters.length];
  const options = letters;

  function startQuiz() {
    setTab("quiz");
    setQuizIndex(0);
    setQuizAnswer(null);
    setQuizChecked(false);
    setScore(0);
    setFinished(false);
  }

  function checkDots() {
    if (dotAnswer === null) return;
    setDotChecked(true);
  }

  function nextDot() {
    setActiveIndex((value) => (value + 1) % letters.length);
    setDotAnswer(null);
    setDotChecked(false);
  }

  function checkQuiz() {
    if (!quizAnswer) return;
    setQuizChecked(true);
    if (quizAnswer === quizLetter.char) setScore((value) => value + 1);
  }

  function nextQuiz() {
    if (quizIndex === 3) {
      setFinished(true);
      return;
    }
    setQuizIndex((value) => value + 1);
    setQuizAnswer(null);
    setQuizChecked(false);
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f7f8f5] px-3 py-5 text-slate-900 sm:px-6 sm:py-8">
      <div className="mx-auto grid max-w-[1500px] gap-5 xl:grid-cols-[minmax(0,1fr)_290px] xl:gap-7">
        <section className="min-w-0 rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-7 lg:p-9">
          <header className="mb-6 border-b border-slate-100 pb-5 sm:mb-8 sm:pb-7">
            <Link href="/learn/noor-bayan" className="text-sm font-semibold text-emerald-800 hover:underline">← {t("back")}</Link>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">نور البيان · ١</p>
            <h1 className="mt-2 font-arabic text-3xl font-bold sm:text-4xl">{t("title")}</h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">{t("intro")}</p>
          </header>

          <div className="mb-6 grid grid-cols-3 rounded-2xl bg-slate-100 p-1.5" role="tablist" aria-label={t("title")}>
            {(["explore", "dots", "quiz"] as const).map((item) => (
              <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => item === "quiz" ? startQuiz() : setTab(item)} className={`min-h-12 rounded-xl px-2 text-sm font-bold transition sm:px-4 ${tab === item ? "bg-white text-emerald-800 shadow-sm" : "text-slate-600 hover:text-emerald-800"}`}>
                {t(item)}
              </button>
            ))}
          </div>

          {tab === "explore" && (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.72fr)]">
              <div className="flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-[#e8e1c9] bg-[#fffdf5] p-5 sm:min-h-[430px] sm:p-8">
                <span className="mb-4 rounded-full bg-white px-4 py-1 text-sm font-semibold text-slate-600 shadow-sm">{t("letter")} {activeIndex + 1} / {letters.length}</span>
                <div className="font-arabic text-[clamp(9rem,28vw,17rem)] leading-[1.05] text-black" lang="ar" dir="rtl" aria-label={`${t("letterAlt")} ${active.char}`}>
                  {active.char}
                </div>
                <div className="mt-3 text-center">
                  <p className="font-arabic text-3xl font-bold" lang="ar" dir="rtl">{active.name}</p>
                  <p className="mt-1 text-sm font-medium text-slate-500">{active.roman}</p>
                </div>
                <div className="mt-6 flex w-full max-w-lg flex-wrap justify-center gap-3">
                  <button type="button" onClick={() => speak(active.name)} className="min-h-12 rounded-xl border border-emerald-200 bg-white px-5 font-bold text-emerald-900 hover:bg-emerald-50">🔊 {t("listenName")}</button>
                  <button type="button" onClick={() => speak(active.sound)} className="min-h-12 rounded-xl bg-emerald-700 px-5 font-bold text-white hover:bg-emerald-800">{t("listenSound")} <span className="font-arabic text-lg">{active.sound}</span></button>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-3xl bg-emerald-50/70 p-5 sm:p-7">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-emerald-800">{t("pronunciation")}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{t("deviceVoice")}</p>
                  <div className="mt-7 rounded-2xl border border-emerald-100 bg-white p-5">
                    <p className="text-sm font-semibold text-slate-500">{t("dotCount")}</p>
                    <p className="mt-2 font-arabic text-2xl font-bold" lang="ar" dir="rtl">
                      {active.dots === 0 ? t("noDots") : `${active.dots} · ${active.position === "above" ? t("above") : t("below")}`}
                    </p>
                    {active.char === "أ" && <p className="mt-3 text-sm leading-6 text-amber-800">{t("alifNote")}</p>}
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between gap-3">
                  <button type="button" onClick={() => setActiveIndex((value) => (value + letters.length - 1) % letters.length)} className="min-h-12 rounded-xl border border-emerald-200 bg-white px-4 font-bold text-emerald-900">‹</button>
                  <p className="font-arabic text-2xl tracking-[0.35em] text-emerald-800" lang="ar" dir="rtl">أ ب ت ث</p>
                  <button type="button" onClick={() => setActiveIndex((value) => (value + 1) % letters.length)} className="min-h-12 rounded-xl border border-emerald-200 bg-white px-4 font-bold text-emerald-900">›</button>
                </div>
              </div>
            </div>
          )}

          {tab === "dots" && (
            <div className="mx-auto max-w-3xl rounded-3xl border border-slate-100 bg-white p-5 sm:p-8">
              <div className="flex flex-col items-center">
                <p className="text-sm font-bold text-emerald-800">{t("dotQuestion")}</p>
                <span className="my-2 font-arabic text-[clamp(8rem,25vw,13rem)] leading-tight text-black" lang="ar" dir="rtl">{active.char}</span>
                <p className="font-arabic text-xl font-bold" lang="ar" dir="rtl">{active.name}</p>
                {active.char === "أ" && <p className="mt-2 max-w-md text-center text-sm leading-6 text-amber-800">{t("alifNote")}</p>}
              </div>
              <p className="mt-6 text-center font-bold">{t("dotCount")}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[0, 1, 2, 3].map((count) => {
                  const label = [t("noDots"), t("oneDot"), t("twoDots"), t("threeDots")][count];
                  const isCorrect = dotChecked && count === active.dots;
                  const isWrong = dotChecked && dotAnswer === count && count !== active.dots;
                  return <button type="button" key={count} disabled={dotChecked} onClick={() => setDotAnswer(count)} className={`min-h-14 rounded-xl border-2 px-2 font-semibold transition ${isCorrect ? "border-emerald-600 bg-emerald-50 text-emerald-900" : isWrong ? "border-rose-400 bg-rose-50 text-rose-800" : dotAnswer === count ? "border-emerald-700 bg-emerald-50" : "border-slate-200 hover:border-emerald-400"}`}>{label}</button>;
                })}
              </div>
              {dotChecked && <p role="status" className={`mt-5 text-center font-bold ${dotAnswer === active.dots ? "text-emerald-800" : "text-rose-700"}`}>{dotAnswer === active.dots ? t("correct") : t("incorrect")}</p>}
              <div className="mt-6 flex justify-center">
                {!dotChecked ? <button type="button" onClick={checkDots} disabled={dotAnswer === null} className="min-h-12 rounded-xl bg-emerald-700 px-8 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{t("check")}</button> : <button type="button" onClick={nextDot} className="min-h-12 rounded-xl bg-emerald-700 px-8 font-bold text-white">{t("next")}</button>}
              </div>
            </div>
          )}

          {tab === "quiz" && (
            <div className="mx-auto max-w-3xl rounded-3xl border border-slate-100 bg-white p-5 sm:p-8">
              {finished ? (
                <div className="py-10 text-center">
                  <span className="text-5xl" aria-hidden="true">🎉</span>
                  <h2 className="mt-5 font-arabic text-2xl font-bold">{t("completion")}</h2>
                  <p className="mt-3 text-lg font-semibold text-emerald-800">{t("score")}: {score} / 4</p>
                  <button type="button" onClick={startQuiz} className="mt-6 min-h-12 rounded-xl bg-emerald-700 px-6 font-bold text-white">{t("retry")}</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-500"><span>{t("question")} {quizIndex + 1} / 4</span><span>{t("score")}: {score}</span></div>
                  <div className="my-7 flex min-h-56 flex-col items-center justify-center rounded-2xl bg-[#fffdf5] p-5">
                    <p className="font-semibold text-slate-600">{t("promptLetter")}</p>
                    <button type="button" onClick={() => speak(quizLetter.name)} className="mt-5 min-h-14 rounded-xl bg-emerald-700 px-6 font-bold text-white hover:bg-emerald-800">🔊 {t("listenName")}</button>
                    <p className="mt-4 text-sm text-slate-500">{t("question")} {quizIndex + 1} / 4</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {options.map((option) => {
                      const isCorrect = quizChecked && option.char === quizLetter.char;
                      const isWrong = quizChecked && quizAnswer === option.char && option.char !== quizLetter.char;
                      return <button type="button" key={option.char} disabled={quizChecked} onClick={() => setQuizAnswer(option.char)} aria-label={`${t("letterAlt")} ${option.char}`} className={`min-h-20 rounded-2xl border-2 font-arabic text-5xl transition ${isCorrect ? "border-emerald-600 bg-emerald-50 text-emerald-900" : isWrong ? "border-rose-400 bg-rose-50 text-rose-800" : quizAnswer === option.char ? "border-emerald-700 bg-emerald-50" : "border-slate-200 hover:border-emerald-400"}`}>{option.char}</button>;
                    })}
                  </div>
                  {quizChecked && <p role="status" className={`mt-5 text-center font-bold ${quizAnswer === quizLetter.char ? "text-emerald-800" : "text-rose-700"}`}>{quizAnswer === quizLetter.char ? t("correct") : t("incorrect")}</p>}
                  <div className="mt-6 flex justify-center">
                    {!quizChecked ? <button type="button" disabled={!quizAnswer} onClick={checkQuiz} className="min-h-12 rounded-xl bg-emerald-700 px-8 font-bold text-white disabled:opacity-50">{t("check")}</button> : <button type="button" onClick={nextQuiz} className="min-h-12 rounded-xl bg-emerald-700 px-8 font-bold text-white">{quizIndex === 3 ? t("continue") : t("next")}</button>}
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        <aside className="flex flex-col gap-4 xl:sticky xl:top-5 xl:self-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-bold text-slate-500">{t("progress")}</p>
            <div className="mt-3 flex gap-2" aria-label={`${activeIndex + 1} / ${letters.length}`}>
              {letters.map((item, index) => <button key={item.char} type="button" onClick={() => { setActiveIndex(index); setTab("explore"); }} aria-label={`${t("letter")} ${item.char}`} className={`h-2 flex-1 rounded-full ${index <= activeIndex ? "bg-emerald-600" : "bg-slate-200"}`} />)}
            </div>
            <div className="mt-5 grid grid-cols-4 gap-2">
              {letters.map((item, index) => <button key={item.char} type="button" onClick={() => { setActiveIndex(index); setTab("explore"); }} aria-label={`${t("letter")} ${item.char}`} className={`flex min-h-[58px] items-center justify-center rounded-xl font-arabic text-3xl ${activeIndex === index ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100"}`}>{item.char}</button>)}
            </div>
            <button type="button" onClick={startQuiz} className="mt-5 min-h-12 w-full rounded-xl bg-slate-900 px-4 font-bold text-white hover:bg-slate-800">{t("quiz")}</button>
          </div>
          <a href="https://wordwall.net/resource/95817605/%D8%A7%D9%84%D8%AD%D8%B1%D9%88%D9%81-%D8%A3-%D8%A8-%D8%AA-%D8%AB" target="_blank" rel="noreferrer" className="rounded-3xl border border-amber-200 bg-amber-50 p-5 transition hover:border-amber-400 hover:bg-amber-100 sm:p-6">
            <span className="flex items-center justify-between gap-3 font-bold text-amber-950"><span>{t("wordwall")}</span><span aria-hidden="true">↗</span></span>
            <span className="mt-2 block text-sm leading-6 text-amber-900/80">{t("wordwallHint")}</span>
          </a>
        </aside>
      </div>
    </main>
  );
}

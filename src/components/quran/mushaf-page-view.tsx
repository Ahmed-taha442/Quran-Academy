"use client";

import { useEffect, useRef, useState } from "react";

const ASSET_VERSION = "v1.1.1";

type MushafPageViewProps = {
  page: number;
  hiddenWords: string[];
  allowedWordKeys: string[];
  challengeActive: boolean;
  onWordsLoaded: (keys: string[]) => void;
  loadingLabel: string;
  errorLabel: string;
  locale: string;
};

export function MushafPageView({
  page,
  hiddenWords,
  allowedWordKeys,
  challengeActive,
  onWordsLoaded,
  loadingLabel,
  errorLabel,
  locale,
}: MushafPageViewProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const wordsLoadedRef = useRef(onWordsLoaded);
  const [loadState, setLoadState] = useState<{ page: number; status: "loading" | "ready" | "error" }>({ page, status: "loading" });
  const status = loadState.page === page ? loadState.status : "loading";

  useEffect(() => { wordsLoadedRef.current = onWordsLoaded; }, [onWordsLoaded]);

  useEffect(() => {
    const controller = new AbortController();
    const pageHost = hostRef.current;
    if (!pageHost) return () => controller.abort();
    const targetHost: HTMLDivElement = pageHost;

    async function loadPage() {
      try {
        const pageId = String(page).padStart(3, "0");
        const response = await fetch(
          `https://cdn.quran.ws/svg/elements/${ASSET_VERSION}/pages/${pageId}.svg`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Page unavailable");
        const markup = await response.text();
        const parsed = new DOMParser().parseFromString(markup, "image/svg+xml");
        const sourceSvg = parsed.documentElement;
        if (parsed.querySelector("parsererror") || sourceSvg.localName !== "svg" || sourceSvg.dataset.decomposition !== "word") {
          throw new Error("Unexpected Mushaf page format");
        }

        sourceSvg.removeAttribute("width");
        sourceSvg.removeAttribute("height");
        sourceSvg.setAttribute("aria-label", locale === "ar" ? `صفحة المصحف ${page}` : `Mushaf page ${page}`);
        sourceSvg.setAttribute("role", "group");
        sourceSvg.style.cssText = "display:block;height:100%;width:auto;max-width:100%;margin-inline:auto;background:#fff";
        sourceSvg.querySelectorAll("script,foreignObject,iframe,object,embed").forEach((element) => element.remove());
        sourceSvg.querySelectorAll("*").forEach((element) => {
          for (const attribute of [...element.attributes]) {
            if (/^on/i.test(attribute.name) || ((attribute.name === "href" || attribute.name.endsWith(":href")) && !attribute.value.startsWith("#"))) {
              element.removeAttribute(attribute.name);
            }
          }
        });

        const svg = document.importNode(sourceSvg, true) as unknown as SVGSVGElement;
        targetHost.replaceChildren(svg);
        const words = [...svg.querySelectorAll<SVGGElement>("g.word[data-word-key]")];
        if (words.length === 0) throw new Error("Page has no word layer");
        words.forEach((word) => word.querySelectorAll("path").forEach((path) => path.setAttribute("fill", "#111111")));
        wordsLoadedRef.current(words.map((word) => word.dataset.wordKey!).filter(Boolean));
        setLoadState({ page, status: "ready" });
      } catch {
        if (!controller.signal.aborted) {
          targetHost.replaceChildren();
          setLoadState({ page, status: "error" });
        }
      }
    }

    void loadPage();
    return () => controller.abort();
  }, [page, locale]);

  useEffect(() => {
    const svg = hostRef.current?.querySelector("svg");
    if (!svg) return;
    svg.querySelectorAll<SVGGElement>("g.word[data-word-key]").forEach((word) => {
      const key = word.dataset.wordKey ?? "";
      const hidden = challengeActive && allowedWordKeys.includes(key) && hiddenWords.includes(key);
      word.style.opacity = hidden ? "0" : "1";
      word.style.pointerEvents = "none";
      word.setAttribute("aria-label", hidden
        ? (locale === "ar" ? "كلمة مخفية، اضغط لإظهارها" : "Hidden word. Activate to reveal")
        : (word.dataset.rasmUthmani ?? "Quran word"));
    });
  }, [hiddenWords, allowedWordKeys, challengeActive, locale, status, page]);

  return (
    <div className="relative mx-auto flex h-[min(88dvh,76rem)] min-h-[28rem] w-full max-w-4xl items-center justify-center overflow-auto rounded-xl border border-[#dedede] bg-white p-0 shadow-sm sm:min-h-[36rem] sm:p-1" aria-busy={status === "loading"}>
      <div ref={hostRef} className="h-full max-w-full [&>svg]:max-h-full" />
      {status !== "ready" && <p role={status === "error" ? "alert" : "status"} className="absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-xl bg-white/95 p-4 text-center text-sm font-medium text-[var(--muted)] shadow-sm">{status === "loading" ? loadingLabel : errorLabel}</p>}
    </div>
  );
}

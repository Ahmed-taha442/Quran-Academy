"use client";

import { useEffect, useRef, useState } from "react";

const ASSET_VERSION = "v1.1.1";

type MushafPageViewProps = {
  page: number;
  hiddenWords: string[];
  allowedWordKeys: string[];
  challengeActive: boolean;
  onWordsLoaded: (keys: string[]) => void;
  onRevealWord: (key: string) => void;
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
  onRevealWord,
  loadingLabel,
  errorLabel,
  locale,
}: MushafPageViewProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef(onRevealWord);
  const wordsLoadedRef = useRef(onWordsLoaded);
  const hiddenRef = useRef(hiddenWords);
  const allowedRef = useRef(allowedWordKeys);
  const challengeRef = useRef(challengeActive);
  const [loadState, setLoadState] = useState<{ page: number; status: "loading" | "ready" | "error" }>({ page, status: "loading" });
  const status = loadState.page === page ? loadState.status : "loading";

  useEffect(() => { revealRef.current = onRevealWord; }, [onRevealWord]);
  useEffect(() => { wordsLoadedRef.current = onWordsLoaded; }, [onWordsLoaded]);
  useEffect(() => { hiddenRef.current = hiddenWords; }, [hiddenWords]);
  useEffect(() => { allowedRef.current = allowedWordKeys; }, [allowedWordKeys]);
  useEffect(() => { challengeRef.current = challengeActive; }, [challengeActive]);

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
        sourceSvg.style.cssText = "display:block;height:100%;width:auto;max-width:100%;margin-inline:auto";
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
        for (const word of words) {
          word.setAttribute("tabindex", "0");
          word.setAttribute("role", "button");
        }
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
      word.style.cursor = hidden ? "pointer" : "default";
      word.setAttribute("aria-label", hidden
        ? (locale === "ar" ? "كلمة مخفية، اضغط لإظهارها" : "Hidden word. Activate to reveal")
        : (word.dataset.rasmUthmani ?? "Quran word"));
    });
  }, [hiddenWords, allowedWordKeys, challengeActive, locale, status, page]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const revealFromTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return;
      const word = target.closest<SVGGElement>("g.word[data-word-key]");
      const key = word?.dataset.wordKey;
      if (key && challengeRef.current && allowedRef.current.includes(key) && hiddenRef.current.includes(key)) revealRef.current(key);
    };
    const handleClick = (event: MouseEvent) => revealFromTarget(event.target);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const word = (event.target as Element | null)?.closest<SVGGElement>("g.word[data-word-key]");
      if (word && challengeRef.current && allowedRef.current.includes(word.dataset.wordKey ?? "") && hiddenRef.current.includes(word.dataset.wordKey ?? "")) {
        event.preventDefault();
        revealRef.current(word.dataset.wordKey!);
      }
    };
    host.addEventListener("click", handleClick);
    host.addEventListener("keydown", handleKeyDown);
    return () => {
      host.removeEventListener("click", handleClick);
      host.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative mx-auto flex h-[min(76dvh,68rem)] min-h-[24rem] w-full max-w-3xl items-center justify-center overflow-auto rounded-2xl border border-[#cfb77f] bg-[#f6f0df] p-2 shadow-inner sm:min-h-[32rem] sm:p-4" aria-busy={status === "loading"}>
      <div ref={hostRef} className="h-full max-w-full [&>svg]:max-h-full" />
      {status !== "ready" && <p role={status === "error" ? "alert" : "status"} className="absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-xl bg-[#fffdf5]/95 p-4 text-center text-sm font-medium text-[var(--muted)] shadow-sm">{status === "loading" ? loadingLabel : errorLabel}</p>}
    </div>
  );
}

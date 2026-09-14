import { useEffect, useRef, useState } from "react";
import Lenis, { type LenisOptions } from "lenis";

import { DEFAULT_SCROLL_OPTIONS } from "../constants";

export const useCreateScroll = (
  root: boolean,
  wrapper: boolean,
  options: ScrollOptions,
) => {
  const [scroll, setScroll] = useState<Lenis | null>(null);

  const wrapRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let lenis: Lenis | null = null;
    let rafId = 0;

    // После первого paint — меньше TBT на LCP
    const startId = window.requestAnimationFrame(() => {
      if (cancelled) return;

      const args: LenisOptions = {
        eventsTarget: document.body,
        ...DEFAULT_SCROLL_OPTIONS,
        ...options,
      };

      if (wrapper && wrapRef.current && contentRef.current) {
        args.wrapper = wrapRef.current;
        args.content = contentRef.current;
      }

      lenis = new Lenis({ ...args });

      if (root) {
        window.__GLOBAL_SCROLL__ = lenis;
      }

      setScroll(lenis);

      const loop = (time: number) => {
        lenis?.raf(time);
        rafId = window.requestAnimationFrame(loop);
      };

      rafId = window.requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(startId);
      window.cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, [root]);

  return [scroll, wrapRef, contentRef];
};

"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import { useScroll } from "@widgets/scroll/hooks/use-scroll";

import { clamp, lerp } from "@shared/utils/math";

import { SCROLL_EASE } from "../constants";
import { applyDomParallax } from "../lib/apply-dom-parallax";
import type { GalleryScrollState } from "../lib/types";

type UseParallaxGalleryScrollOptions = {
  wrapperRef: RefObject<HTMLDivElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  imageRefs: RefObject<(HTMLImageElement | null)[]>;
};

export const useParallaxGalleryScroll = ({
  wrapperRef,
  containerRef,
  imageRefs,
}: UseParallaxGalleryScrollOptions) => {
  const scrollRef = useRef<GalleryScrollState>({
    current: 0,
    target: 0,
    limit: 0,
  });
  const rafRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);

  const setScrollLimit = useCallback((limit: number) => {
    scrollRef.current.limit = limit;
  }, []);

  useScroll(
    useCallback((event) => {
      const delta = event.targetScroll - lastScrollYRef.current;
      lastScrollYRef.current = event.targetScroll;

      if (scrollRef.current.limit <= 0 || delta === 0) return;

      scrollRef.current.target = clamp(
        scrollRef.current.target + delta,
        0,
        scrollRef.current.limit,
      );
    }, []),
    [],
    10,
  );

  useEffect(() => {
    const render = () => {
      const container = containerRef.current;
      if (!container) return;

      const scroll = scrollRef.current;

      scroll.target = clamp(scroll.target, 0, scroll.limit);
      scroll.current = lerp(scroll.current, scroll.target, SCROLL_EASE);

      container.style.transform = `translateX(${-scroll.current}px)`;
      applyDomParallax(imageRefs.current);

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [containerRef, imageRefs]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onWheel = (event: WheelEvent) => {
      if (scrollRef.current.limit <= 0) return;

      scrollRef.current.target = clamp(
        scrollRef.current.target + event.deltaY,
        0,
        scrollRef.current.limit,
      );
    };

    wrapper.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      wrapper.removeEventListener("wheel", onWheel);
    };
  }, [wrapperRef]);

  return { scrollRef, setScrollLimit };
};

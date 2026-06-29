"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import { useScroll } from "@widgets/scroll/hooks/use-scroll";

import { clamp, lerp } from "@shared/utils/math";
import type { ScrollEvent } from "@/widgets/scroll";

import { SCROLL_EASE, TOUCH_DRAG_THRESHOLD } from "../constants";
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
    useCallback((event: ScrollEvent) => {
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

    const touchState = {
      isActive: false,
      hasDragged: false,
      lastX: 0,
      lastY: 0,
      startX: 0,
      startY: 0,
    };

    const applyScrollDelta = (deltaX: number, deltaY: number) => {
      if (scrollRef.current.limit <= 0) return;

      const delta =
        Math.abs(deltaX) > Math.abs(deltaY) ? -deltaX : deltaY;

      scrollRef.current.target = clamp(
        scrollRef.current.target + delta,
        0,
        scrollRef.current.limit,
      );
      scrollRef.current.current = scrollRef.current.target;
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;

      const touch = event.touches[0];
      touchState.isActive = true;
      touchState.hasDragged = false;
      touchState.lastX = touch.clientX;
      touchState.lastY = touch.clientY;
      touchState.startX = touch.clientX;
      touchState.startY = touch.clientY;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!touchState.isActive || event.touches.length !== 1) return;

      const touch = event.touches[0];
      const deltaX = touch.clientX - touchState.lastX;
      const deltaY = touch.clientY - touchState.lastY;

      if (!touchState.hasDragged) {
        const totalDeltaX = touch.clientX - touchState.startX;
        const totalDeltaY = touch.clientY - touchState.startY;

        if (
          Math.hypot(totalDeltaX, totalDeltaY) < TOUCH_DRAG_THRESHOLD
        ) {
          return;
        }

        touchState.hasDragged = true;
      }

      touchState.lastX = touch.clientX;
      touchState.lastY = touch.clientY;

      applyScrollDelta(deltaX, deltaY);
    };

    const onTouchEnd = () => {
      touchState.isActive = false;
      touchState.hasDragged = false;
    };

    wrapper.addEventListener("wheel", onWheel, { passive: true });
    wrapper.addEventListener("touchstart", onTouchStart, { passive: true });
    wrapper.addEventListener("touchmove", onTouchMove, { passive: true });
    wrapper.addEventListener("touchend", onTouchEnd, { passive: true });
    wrapper.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      wrapper.removeEventListener("wheel", onWheel);
      wrapper.removeEventListener("touchstart", onTouchStart);
      wrapper.removeEventListener("touchmove", onTouchMove);
      wrapper.removeEventListener("touchend", onTouchEnd);
      wrapper.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [wrapperRef]);

  return { scrollRef, setScrollLimit };
};

"use client";

import { type MouseEvent, type RefObject, useEffect, useRef } from "react";
import gsap from "gsap";

import { BREAKPOINTS } from "@/shared/config";
import { useMedia } from "@/shared/hooks/use-media";

type UsePointerParallaxOptions = {
  strength?: number;
  duration?: number;
};

type UsePointerParallaxResult = {
  rootRef: RefObject<HTMLDivElement | null>;
  onMouseMove: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
  enabled: boolean;
};

export const usePointerParallax = (
  options: UsePointerParallaxOptions = {},
): UsePointerParallaxResult => {
  const { strength = 2, duration = 0.55 } = options;

  const rootRef = useRef<HTMLDivElement>(null);
  const xToRef = useRef<gsap.QuickToFunc | null>(null);
  const yToRef = useRef<gsap.QuickToFunc | null>(null);
  const enabledRef = useRef(true);

  const isCoarsePointer = useMedia("(pointer: coarse)", false);
  const isNoHover = useMedia("(hover: none)", false);
  const isMobileWidth = useMedia(`(max-width: ${BREAKPOINTS.md}px)`, false);

  const enabled = !isCoarsePointer && !isNoHover && !isMobileWidth;
  enabledRef.current = enabled;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.set(root, { "--pointer-x": 0, "--pointer-y": 0 });

    if (!enabled) {
      xToRef.current = null;
      yToRef.current = null;
      return;
    }

    xToRef.current = gsap.quickTo(root, "--pointer-x", {
      duration,
      ease: "power3.out",
    });
    yToRef.current = gsap.quickTo(root, "--pointer-y", {
      duration,
      ease: "power3.out",
    });

    return () => {
      xToRef.current = null;
      yToRef.current = null;
    };
  }, [duration, enabled]);

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!enabledRef.current) return;

    const root = rootRef.current;
    if (!root || !xToRef.current || !yToRef.current) return;

    const rect = root.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    xToRef.current(x * strength);
    yToRef.current(y * strength);
  };

  const onMouseLeave = () => {
    if (!enabledRef.current) return;

    xToRef.current?.(0);
    yToRef.current?.(0);
  };

  return { rootRef, onMouseMove, onMouseLeave, enabled };
};

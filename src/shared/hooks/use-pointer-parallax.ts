"use client";

import { useEffect, useRef, type MouseEvent, type RefObject } from "react";
import gsap from "gsap";

type UsePointerParallaxOptions = {
  strength?: number;
  duration?: number;
};

type UsePointerParallaxResult = {
  rootRef: RefObject<HTMLDivElement | null>;
  onMouseMove: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
};

export const usePointerParallax = (
  options: UsePointerParallaxOptions = {},
): UsePointerParallaxResult => {
  const { strength = 2, duration = 0.55 } = options;

  const rootRef = useRef<HTMLDivElement>(null);
  const xToRef = useRef<gsap.QuickToFunc | null>(null);
  const yToRef = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.set(root, { "--pointer-x": 0, "--pointer-y": 0 });

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
  }, [duration]);

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    if (!root || !xToRef.current || !yToRef.current) return;

    const rect = root.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    xToRef.current(x * strength);
    yToRef.current(y * strength);
  };

  const onMouseLeave = () => {
    xToRef.current?.(0);
    yToRef.current?.(0);
  };

  return { rootRef, onMouseMove, onMouseLeave };
};

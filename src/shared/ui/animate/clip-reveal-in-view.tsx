"use client";

import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import clsx from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export type ClipRevealInViewProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  /** ScrollTrigger start, по умолчанию когда верх элемента у 85% высоты скролла */
  start?: string;
} & Omit<ComponentProps<"div">, "children" | "className">;

/**
 * Раскрытие через clip-path inset снизу вверх при скролле.
 * Один раз. GSAP ScrollTrigger + Lenis (`#scroll`).
 *
 * Анимирует `--clip-reveal` (0 → 1) через DOM; clip-path задаётся в CSS.
 */
export const ClipRevealInView = (props: ClipRevealInViewProps) => {
  const {
    children,
    className,
    delay = 0,
    duration = 1.1,
    start = "top 85%",
    ...rest
  } = props;

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    gsap.registerPlugin(ScrollTrigger);

    const scroller = document.getElementById("scroll");
    if (!scroller) return;

    const state = { reveal: 0 };

    const apply = (value: number) => {
      node.style.setProperty("--clip-reveal", value.toFixed(4));
    };

    apply(0);

    let tween: gsap.core.Tween | null = null;

    const play = () => {
      if (tween) return;

      node.style.willChange = "clip-path";

      tween = gsap.to(state, {
        reveal: 1,
        duration,
        delay,
        ease: "power4.inOut",
        onUpdate: () => apply(state.reveal),
        onComplete: () => {
          node.style.willChange = "auto";
          // финальный clip можно снять — элемент уже полностью виден
          node.style.clipPath = "none";
          node.style.removeProperty("--clip-reveal");
        },
      });
    };

    const st = ScrollTrigger.create({
      trigger: node,
      scroller,
      start,
      once: true,
      onEnter: play,
    });

    if (st.isActive) {
      play();
    }

    return () => {
      tween?.kill();
      st.kill();
    };
  }, [delay, duration, start]);

  return (
    <div ref={rootRef} className={clsx(className)} {...rest}>
      {children}
    </div>
  );
};

ClipRevealInView.displayName = "ClipRevealInView";

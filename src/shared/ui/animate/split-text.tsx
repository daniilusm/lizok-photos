import {
  createElement,
  type ElementType,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import clsx from "clsx";
import { gsap } from "gsap";

import { useIntersectionObserver } from "@shared/hooks/use-intersection-observer";
import { SplitText } from "@shared/ui/split-text";
import { composeRefs } from "@shared/utils/compose-refs";

import s from "./split-text.module.scss";

interface SplitTextAnimateProps {
  className?: string;
  children: React.ReactNode;
  isVisible: boolean;
  stagger?: number;
  duration?: number;
  delay?: number;
  as?: ElementType;
  type?: "char" | "word";
  ref?: React.Ref<HTMLElement>;
}

interface SplitTextAnimateInViewProps
  extends Omit<SplitTextAnimateProps, "isVisible"> {
  children: React.ReactNode;
}

export const SplitTextAnimate = ({
  className,
  children,
  isVisible,
  stagger = 0,
  duration = 0.9,
  delay = 0,
  as: As = "span",
  type = "word",
  ref,
}: SplitTextAnimateProps) => {
  const rootRef = useRef<HTMLElement>(null);
  const $letters = useRef<HTMLElement[]>([]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Анимируем `.char`: при type=word — одно «char» на слово, при type=char — по буквам
    $letters.current = gsap.utils.selector(root)(".char");
    gsap.set($letters.current, { yPercent: 105 });
  }, [type, children]);

  useEffect(() => {
    const targets = $letters.current;
    if (!targets.length) return;

    if (!isVisible) {
      gsap.set(targets, { yPercent: 105 });
      return;
    }

    const tween = gsap.to(targets, {
      yPercent: 0,
      ease: "power4.out",
      stagger,
      duration,
      delay,
      overwrite: "auto",
    });

    return () => {
      tween.kill();
    };
  }, [isVisible, delay, stagger, duration, type, children]);

  return createElement(
    As,
    {
      ref: composeRefs(ref, rootRef),
      className: clsx(s.root, className),
    },
    createElement(SplitText, { type, children }),
  );
};

export const SplitTextAnimateInView = ({
  children,
  ...props
}: SplitTextAnimateInViewProps) => {
  const observerOptions = useMemo(
    () => ({
      triggerOnce: true,
      threshold: 0.2,
      rootMargin: "0px 0px -8% 0px",
    }),
    [],
  );

  const [ref, inView] = useIntersectionObserver(observerOptions);

  return (
    <SplitTextAnimate isVisible={inView} ref={ref} {...props}>
      {children}
    </SplitTextAnimate>
  );
};

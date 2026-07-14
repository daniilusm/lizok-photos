"use client";

import {
  type ComponentProps,
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
} from "react";
import clsx from "clsx";
import gsap from "gsap";

import { composeRefs } from "@/shared/utils/compose-refs";

export type ParallaxScrollContainerProps = ComponentProps<"div"> & {
  className?: string;
  start?: string;
  edgeOnlyProgress?: boolean;
};

export const ParallaxScrollContainer = (
  props: ParallaxScrollContainerProps,
) => {
  const {
    className,
    children,
    style,
    start = "top top",
    edgeOnlyProgress = false,
    ref,
    ...restProps
  } = props;
  const rootRef = useRef<HTMLDivElement | null>(null);

  const rootStyle = useMemo(
    () =>
      ({
        ...style,
        "--parallax-scroll-progress": 0,
      }) as CSSProperties,
    [style],
  );

  useEffect(() => {
    if (!rootRef.current) return;

    let lastProgress = -1;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start: start,
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          if (!rootRef.current) return;

          if (Math.abs(self.progress - lastProgress) < 0.002) {
            return;
          }

          lastProgress = self.progress;

          if (!edgeOnlyProgress) {
            rootRef.current.style.setProperty(
              "--parallax-scroll-progress",
              self.progress.toFixed(3),
            );

            return;
          }

          const rect = rootRef.current.getBoundingClientRect();
          const viewportHeight =
            window.innerHeight || document.documentElement.clientHeight;

          const isStart = rect.top >= 0;
          const isEnd = rect.bottom <= viewportHeight;

          if (isStart) {
            rootRef.current.style.setProperty(
              "--parallax-scroll-progress",
              (self.progress * 2).toFixed(3),
            );
            return;
          }

          if (isEnd) {
            const clampedProgress = Math.max(0, self.progress - 0.5) * 2;

            rootRef.current.style.setProperty(
              "--parallax-scroll-progress",
              clampedProgress.toFixed(3),
            );
          }
        },
      },
    });

    return () => {
      tl.kill();
    };
  }, [edgeOnlyProgress, start]);

  return (
    <div
      ref={composeRefs(rootRef, ref)}
      className={clsx(className)}
      style={rootStyle}
      {...restProps}
    >
      {children}
    </div>
  );
};

ParallaxScrollContainer.displayName = "ParallaxScrollContainer";

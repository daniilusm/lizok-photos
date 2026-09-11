"use client";

import {
  type ComponentProps,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import clsx from "clsx";
import gsap from "gsap";

import { HOME_CONTENT } from "@/shared/stub/home";
import { Image } from "@/shared/ui/image";
import { Heading } from "@/shared/ui/typography/heading";

import s from "./comparison-section.module.scss";

export type ComparisonSectionProps = ComponentProps<"section"> & {
  className?: string;
  title?: string;
  beforeSrc?: string;
  afterSrc?: string;
  beforeLabel?: string;
  afterLabel?: string;
};

export const ComparisonSection = (props: ComparisonSectionProps) => {
  const {
    className,
    title = "До / После",
    beforeSrc = HOME_CONTENT.comparisonImages.before,
    afterSrc = HOME_CONTENT.comparisonImages.after,
    beforeLabel = "До",
    afterLabel = "После",
    ...restProps
  } = props;

  const frameRef = useRef<HTMLDivElement>(null);
  const progressToRef = useRef<gsap.QuickToFunc | null>(null);
  const activePointerIdRef = useRef<number | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    gsap.set(frame, { "--compare-progress": 0.5 });

    progressToRef.current = gsap.quickTo(frame, "--compare-progress", {
      duration: 0.35,
      ease: "power3.out",
    });

    return () => {
      progressToRef.current = null;
    };
  }, []);

  const setProgressFromClientX = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame || !progressToRef.current) return;

    const rect = frame.getBoundingClientRect();
    if (rect.width <= 0) return;

    const progress = Math.min(
      1,
      Math.max(0, (clientX - rect.left) / rect.width),
    );
    progressToRef.current(progress);
  }, []);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const frame = frameRef.current;
      if (!frame) return;

      activePointerIdRef.current = event.pointerId;
      frame.setPointerCapture(event.pointerId);
      setProgressFromClientX(event.clientX);
    },
    [setProgressFromClientX],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const isCaptured = activePointerIdRef.current === event.pointerId;
      const isMouseHover = event.pointerType === "mouse" && event.buttons === 0;

      // Мышь: и hover, и drag. Тач/перо: только при активном pointerdown.
      if (!isCaptured && !isMouseHover) return;

      setProgressFromClientX(event.clientX);
    },
    [setProgressFromClientX],
  );

  const handlePointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (activePointerIdRef.current !== event.pointerId) return;

    activePointerIdRef.current = null;

    if (frame?.hasPointerCapture(event.pointerId)) {
      frame.releasePointerCapture(event.pointerId);
    }
  }, []);

  const handlePointerLeave = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      // На таче не сбрасываем; на мыши — только если не тянем
      if (event.pointerType !== "mouse") return;
      if (activePointerIdRef.current !== null) return;

      progressToRef.current?.(0.5);
    },
    [],
  );

  return (
    <section className={clsx(s.root, className)} {...restProps}>
      {title && (
        <Heading level="2" tag="h2" className={s.title}>
          {title}
        </Heading>
      )}

      <div
        ref={frameRef}
        className={s.frame}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        <div className={s.layer}>
          <Image
            className={s.image}
            src={beforeSrc}
            alt={beforeLabel}
            height="100%"
            objectFit="cover"
            imageRole="hero"
            sizes="100vw"
            loading="lazy"
          />
        </div>

        <div className={clsx(s.layer, s.after)}>
          <Image
            className={s.image}
            src={afterSrc}
            alt={afterLabel}
            height="100%"
            objectFit="cover"
            imageRole="hero"
            sizes="100vw"
            loading="lazy"
          />
        </div>

        <div className={s.handle} aria-hidden>
          <span className={s.handleLine} />
        </div>
        <span className={clsx(s.label, s.afterLabel)}>{afterLabel}</span>
        <span className={clsx(s.label, s.beforeLabel)}>{beforeLabel}</span>
      </div>
    </section>
  );
};

ComparisonSection.displayName = "ComparisonSection";

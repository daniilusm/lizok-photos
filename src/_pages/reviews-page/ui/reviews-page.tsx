"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import { BREAKPOINTS } from "@/shared/config/breakpoints";
import { useMedia } from "@/shared/hooks/use-media";
import { REVIEWS } from "@/shared/stub/reviews";
import { Image } from "@/shared/ui/image";
import { Body } from "@/shared/ui/typography/body";
import { Heading } from "@/shared/ui/typography/heading";
import { typografText } from "@/shared/utils/typograf";
import { useScroll } from "@/widgets/scroll";
import {
  EVENTS_TRANSITION_LAYOUT,
  transitionLayoutEmitter,
} from "@/widgets/transition-layout/emmiter";

import { ReviewForm } from "./review-form";

import s from "./reviews-page.module.scss";

const SLIDE_MS = 3000;
const MOBILE_SWIPE_PX = 36;
const MOBILE_WHEEL_DELTA = 12;
const MOBILE_SNAP_MS = 700;

type ReviewTextProps = {
  text: string;
  isActive: boolean;
};

const ReviewText = ({ text, isActive }: ReviewTextProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setExpanded] = useState(false);
  const [isOverflowing, setOverflowing] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [text, isActive]);

  useLayoutEffect(() => {
    if (!isActive) return;

    const el = textRef.current;
    if (!el) return;

    const measure = () => {
      const inner = el.querySelector<HTMLElement>(`.${s.textInner}`);
      const target = inner ?? el;
      const lineHeight = parseFloat(getComputedStyle(target).lineHeight);

      if (!Number.isFinite(lineHeight) || lineHeight <= 0) {
        setOverflowing(false);
        return;
      }

      setOverflowing(target.scrollHeight > lineHeight * 5 + 2);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => observer.disconnect();
  }, [text, isActive]);

  return (
    <div className={s.textBlock}>
      <div
        ref={textRef}
        className={clsx(s.text, isExpanded && s.textExpanded)}
        {...(isExpanded ? { "data-lenis-prevent": true } : {})}
        onWheel={(event) => {
          if (!isExpanded) return;
          event.stopPropagation();
        }}
      >
        <p className={s.textInner}>{text}</p>
      </div>

      {isOverflowing && (
        <button
          type="button"
          className={s.moreButton}
          aria-expanded={isExpanded}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {typografText(isExpanded ? "Свернуть" : "Читать полностью")}
        </button>
      )}
    </div>
  );
};

const isFromExpandedText = (target: EventTarget | null) =>
  target instanceof Element && Boolean(target.closest(`.${s.textExpanded}`));

export const ReviewsPage = () => {
  const trackRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const showHintRef = useRef(true);
  const activeIndexRef = useRef(0);
  const isSnappingRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const isMobile = useMedia(`(max-width: ${BREAKPOINTS.md - 1}px)`, false);
  const lenis = useScroll();

  activeIndexRef.current = activeIndex;

  const hideHint = useCallback(() => {
    if (!showHintRef.current) return;
    showHintRef.current = false;
    setShowScrollHint(false);
  }, []);

  const showHint = useCallback(() => {
    showHintRef.current = true;
    setShowScrollHint(true);
  }, []);

  const getLenis = useCallback(() => {
    return lenis ?? window.__GLOBAL_SCROLL__ ?? null;
  }, [lenis]);

  const goToReview = useCallback(
    (nextIndex: number, options?: { force?: boolean }) => {
      const track = trackRef.current;
      const scroll = getLenis();
      if (!track || !scroll || isSnappingRef.current) return;

      const count = REVIEWS.length;
      const clamped = Math.max(0, Math.min(count - 1, nextIndex));
      if (clamped === activeIndexRef.current && !options?.force) {
        scroll.start();
        return;
      }

      hideHint();
      isSnappingRef.current = true;
      activeIndexRef.current = clamped;
      setActiveIndex(clamped);

      const segment = track.offsetHeight / count;
      const target = track.offsetTop + clamped * segment;

      scroll.scrollTo(target, {
        duration: MOBILE_SNAP_MS / 1000,
        force: true,
        onComplete: () => {
          isSnappingRef.current = false;
          scroll.start();
        },
      });

      window.setTimeout(() => {
        isSnappingRef.current = false;
        scroll.start();
      }, MOBILE_SNAP_MS + 80);
    },
    [getLenis, hideHint],
  );

  // Hint: always visible on enter; hide only after real user scroll past baseline
  useEffect(() => {
    showHint();

    const hintArmedRef = { current: false };
    const baselineProgressRef = { current: 0 };

    const armHint = (progress = 0) => {
      baselineProgressRef.current = progress;
      hintArmedRef.current = true;
    };

    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    if (!track) return;

    const scroller = document.getElementById("scroll");
    if (!scroller) return;

    let lastIndex = -1;

    const st = ScrollTrigger.create({
      trigger: track,
      scroller,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        if (
          hintArmedRef.current &&
          Math.abs(self.progress - baselineProgressRef.current) > 0.02
        ) {
          hideHint();
        }

        if (isSnappingRef.current) {
          track.style.setProperty(
            "--scroll-progress",
            self.progress.toFixed(4),
          );
          return;
        }

        const count = REVIEWS.length;
        const nextIndex = Math.min(
          count - 1,
          Math.floor(self.progress * count),
        );

        track.style.setProperty("--scroll-progress", self.progress.toFixed(4));

        if (nextIndex !== lastIndex) {
          lastIndex = nextIndex;
          activeIndexRef.current = nextIndex;
          setActiveIndex(nextIndex);
        }
      },
    });

    const syncAndArm = () => {
      showHint();
      ScrollTrigger.refresh();
      armHint(st.progress);
    };

    const refreshId = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      // Don't arm yet — wait for page transition / scroll settle
    });

    const armTimeoutId = window.setTimeout(syncAndArm, 500);

    transitionLayoutEmitter.on(
      EVENTS_TRANSITION_LAYOUT.pageInComplete,
      syncAndArm,
    );
    transitionLayoutEmitter.on(
      EVENTS_TRANSITION_LAYOUT.resetScroll,
      syncAndArm,
    );

    return () => {
      window.cancelAnimationFrame(refreshId);
      window.clearTimeout(armTimeoutId);
      transitionLayoutEmitter.off(
        EVENTS_TRANSITION_LAYOUT.pageInComplete,
        syncAndArm,
      );
      transitionLayoutEmitter.off(
        EVENTS_TRANSITION_LAYOUT.resetScroll,
        syncAndArm,
      );
      st.kill();
    };
  }, [hideHint, showHint]);

  useEffect(() => {
    if (!isMobile) return;

    const sticky = stickyRef.current;
    if (!sticky) return;

    const step = (direction: 1 | -1) => {
      goToReview(activeIndexRef.current + direction);
    };

    const onWheel = (event: WheelEvent) => {
      if (isFromExpandedText(event.target)) return;
      if (isSnappingRef.current) {
        event.preventDefault();
        return;
      }
      if (Math.abs(event.deltaY) < MOBILE_WHEEL_DELTA) return;

      const atStart = activeIndexRef.current <= 0;
      const atEnd = activeIndexRef.current >= REVIEWS.length - 1;
      // Дать уйти со страницы отзывов к форме / назад
      if ((event.deltaY > 0 && atEnd) || (event.deltaY < 0 && atStart)) {
        getLenis()?.start();
        return;
      }

      event.preventDefault();
      getLenis()?.stop();
      step(event.deltaY > 0 ? 1 : -1);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (isFromExpandedText(event.target)) {
        touchStartYRef.current = null;
        return;
      }
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
      getLenis()?.stop();
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touchStartYRef.current == null || isSnappingRef.current) return;
      if (isFromExpandedText(event.target)) return;

      const currentY = event.touches[0]?.clientY;
      if (currentY == null) return;

      const deltaY = currentY - touchStartYRef.current;
      if (Math.abs(deltaY) < MOBILE_SWIPE_PX) return;

      const atStart = activeIndexRef.current <= 0;
      const atEnd = activeIndexRef.current >= REVIEWS.length - 1;
      const goingNext = deltaY < 0;
      const goingPrev = deltaY > 0;

      if ((goingNext && atEnd) || (goingPrev && atStart)) {
        touchStartYRef.current = null;
        getLenis()?.start();
        return;
      }

      event.preventDefault();
      touchStartYRef.current = null;
      step(goingNext ? 1 : -1);
    };

    const onTouchEnd = () => {
      if (touchStartYRef.current != null && !isSnappingRef.current) {
        // Короткий жест — вернуть к текущему отзыву
        goToReview(activeIndexRef.current, { force: true });
      }
      touchStartYRef.current = null;
    };

    sticky.addEventListener("wheel", onWheel, { passive: false });
    sticky.addEventListener("touchstart", onTouchStart, { passive: true });
    sticky.addEventListener("touchmove", onTouchMove, { passive: false });
    sticky.addEventListener("touchend", onTouchEnd);
    sticky.addEventListener("touchcancel", onTouchEnd);

    return () => {
      sticky.removeEventListener("wheel", onWheel);
      sticky.removeEventListener("touchstart", onTouchStart);
      sticky.removeEventListener("touchmove", onTouchMove);
      sticky.removeEventListener("touchend", onTouchEnd);
      sticky.removeEventListener("touchcancel", onTouchEnd);
      getLenis()?.start();
    };
  }, [getLenis, goToReview, isMobile]);

  useEffect(() => {
    setSlideIndex(0);

    const images = REVIEWS[activeIndex]?.images.slice(0, 3) ?? [];
    if (images.length <= 1) return;

    const timerId = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % images.length);
    }, SLIDE_MS);

    return () => {
      window.clearInterval(timerId);
    };
  }, [activeIndex]);

  const trackStyle = {
    "--reviews-count": REVIEWS.length,
    "--scroll-progress": 0,
  } as CSSProperties;

  return (
    <main className={s.root}>
      <section
        ref={trackRef}
        className={s.track}
        style={trackStyle}
        aria-label="Отзывы"
      >
        <div ref={stickyRef} className={s.sticky}>
          {REVIEWS.map((review, reviewIndex) => {
            const isActive = reviewIndex === activeIndex;
            const slides = review.images.slice(0, 3);

            return (
              <article
                key={review.id}
                className={clsx(s.review, isActive && s.reviewActive)}
                aria-hidden={!isActive}
              >
                <div className={s.gallery} aria-hidden>
                  {slides.map((src, imageIndex) => (
                    <Image
                      key={`${review.id}-${src}`}
                      className={clsx(
                        s.slide,
                        isActive && imageIndex === slideIndex && s.slideActive,
                      )}
                      src={src}
                      alt=""
                      height="100%"
                      objectFit="cover"
                      imageRole="preview"
                      sizes="100vw"
                      loading={reviewIndex === 0 ? "eager" : "lazy"}
                    />
                  ))}
                </div>

                <div className={s.overlay} aria-hidden />

                <div className={s.content}>
                  <Body size="small" tag="p" className={s.type}>
                    {review.type}
                  </Body>
                  <ReviewText text={review.text} isActive={isActive} />
                  <Body size="small" tag="p" className={s.name}>
                    {review.name}
                  </Body>
                </div>
              </article>
            );
          })}

          <div className={s.chrome}>
            <p className={s.counter} aria-live="polite">
              {activeIndex + 1} / {REVIEWS.length}
            </p>
            <div className={s.progress} aria-hidden>
              <div className={s.progressBar} />
            </div>
          </div>

          <p
            className={clsx(
              s.scrollHint,
              !showScrollHint && s.scrollHintHidden,
            )}
            aria-hidden
          >
            {typografText(
              isMobile
                ? "Смахните вверх или вниз — следующий отзыв"
                : "Листайте вниз — следующие отзывы",
            )}
          </p>
        </div>
      </section>

      <section
        className={s.formSection}
        aria-label={typografText("Оставить отзыв")}
      >
        <div className={s.formInner}>
          <div className={s.formTexts}>
            <Heading level="2" tag="h2" className={s.formTitle} animate={false}>
              {typografText("Оставить отзыв")}
            </Heading>
            <Body size="primary" tag="p" className={s.formLead} animate={false}>
              {typografText(
                "Если вы уже были на съёмке — напишите пару слов. Это помогает другим решиться.",
              )}
            </Body>
          </div>
          <ReviewForm className={s.reviewForm} />
        </div>
      </section>
    </main>
  );
};

ReviewsPage.displayName = "ReviewsPage";

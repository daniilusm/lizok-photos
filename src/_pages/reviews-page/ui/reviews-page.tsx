"use client";

import {
  type CSSProperties,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import { REVIEWS } from "@/shared/stub/reviews";
import { Image } from "@/shared/ui/image";
import { Body } from "@/shared/ui/typography/body";
import { typografText } from "@/shared/utils/typograf";

import s from "./reviews-page.module.scss";

const SLIDE_MS = 3000;

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

      // Высота полного текста без clamp / 70svh — иначе ложные срабатывания
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
          // Не отдаём жест Lenis / странице, пока крутим текст
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

export const ReviewsPage = () => {
  const trackRef = useRef<HTMLElement>(null);
  const showHintRef = useRef(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    if (!track) return;

    const scroller = document.getElementById("scroll");
    if (!scroller) return;

    let lastIndex = -1;

    const hideHint = () => {
      if (!showHintRef.current) return;
      showHintRef.current = false;
      setShowScrollHint(false);
    };

    const st = ScrollTrigger.create({
      trigger: track,
      scroller,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        if (self.progress > 0.005) {
          hideHint();
        }

        const count = REVIEWS.length;
        const nextIndex = Math.min(
          count - 1,
          Math.floor(self.progress * count),
        );

        track.style.setProperty("--scroll-progress", self.progress.toFixed(4));

        if (nextIndex !== lastIndex) {
          lastIndex = nextIndex;
          setActiveIndex(nextIndex);
        }
      },
    });

    const refreshId = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      window.cancelAnimationFrame(refreshId);
      st.kill();
    };
  }, []);

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
        <div className={s.sticky}>
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
                      imageRole="hero"
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
            className={clsx(s.scrollHint, !showScrollHint && s.scrollHintHidden)}
            aria-hidden
          >
            {typografText("Листайте вниз — следующие отзывы")}
          </p>
        </div>
      </section>
    </main>
  );
};

ReviewsPage.displayName = "ReviewsPage";

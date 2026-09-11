"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import { REVIEWS } from "@/shared/stub/reviews";
import { Image } from "@/shared/ui/image";
import { Body } from "@/shared/ui/typography/body";

import s from "./reviews-page.module.scss";

const SLIDE_MS = 3000;

export const ReviewsPage = () => {
  const trackRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
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
                  <p className={s.type}>{review.type}</p>
                  <Body size="primary" tag="p" className={s.text}>
                    {review.text}
                  </Body>
                  <p className={s.name}>{review.name}</p>
                </div>
              </article>
            );
          })}

          <div className={s.progress} aria-hidden>
            <div className={s.progressBar} />
          </div>
        </div>
      </section>
    </main>
  );
};

ReviewsPage.displayName = "ReviewsPage";

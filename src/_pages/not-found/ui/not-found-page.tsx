"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import { usePointerParallax } from "@/shared/hooks/use-pointer-parallax";
import { Image } from "@/shared/ui/image";
import { Link } from "@/shared/ui/link";
import { Body } from "@/shared/ui/typography/body";
import { Heading } from "@/shared/ui/typography/heading";
import { typografText } from "@/shared/utils/typograf";

import s from "./not-found-page.module.scss";

const IMAGE_SRC =
  "https://res.cloudinary.com/fgedebup/image/upload/v1785084857/IMG_5435_cajx0d.jpg";

export const NotFoundPage = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const codeInnerRef = useRef<HTMLSpanElement>(null);
  const metaRef = useRef<HTMLParagraphElement>(null);
  const { rootRef, onMouseMove, onMouseLeave } = usePointerParallax({
    strength: 1.4,
    duration: 0.7,
  });

  useEffect(() => {
    const root = rootRef.current;
    const content = contentRef.current;
    const code = codeInnerRef.current;
    const meta = metaRef.current;
    if (!root || !content || !code || !meta) return;

    const actions = root.querySelectorAll<HTMLElement>(`.${s.actions} a`);

    const ctx = gsap.context(() => {
      gsap.set([code, meta, content, actions], { opacity: 0 });
      gsap.set(code, { yPercent: 18, scale: 0.92 });
      gsap.set(content, { y: 28 });
      gsap.set(actions, { y: 16 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.to(meta, { opacity: 1, duration: 0.6 }, 0.15)
        .to(code, { opacity: 0.22, yPercent: 0, scale: 1, duration: 1.15 }, 0.2)
        .to(content, { opacity: 1, y: 0, duration: 0.85 }, 0.45)
        .to(actions, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 }, 0.7);
    }, root);

    return () => {
      ctx.revert();
    };
  }, [rootRef]);

  return (
    <main
      ref={rootRef}
      className={s.root}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className={s.media} aria-hidden>
        <Image
          className={s.image}
          src={IMAGE_SRC}
          alt=""
          height="100%"
          objectFit="cover"
          imageRole="hero"
          sizes="100vw"
          loading="eager"
        />
      </div>

      <div className={s.overlay} aria-hidden />

      <div className={s.viewfinder} aria-hidden>
        <span className={s.corner} data-pos="tl" />
        <span className={s.corner} data-pos="tr" />
        <span className={s.corner} data-pos="bl" />
        <span className={s.corner} data-pos="br" />
      </div>

      <p ref={metaRef} className={s.meta}>
        {typografText("негатив утерян · кадр 404")}
      </p>

      <p className={s.code} aria-hidden>
        <span ref={codeInnerRef} className={s.codeInner}>
          404
        </span>
      </p>

      <div ref={contentRef} className={s.content}>
        <Heading level="2" tag="h1" className={s.title} animate={false}>
          {typografText("Этот кадр не сохранился")}
        </Heading>
        <Body size="primary" tag="p" className={s.text} animate={false}>
          {typografText(
            "Страницы нет — зато портфолио на месте. Вернитесь на главную или выберите съёмку, которая вам ближе.",
          )}
        </Body>

        <nav className={s.actions} aria-label={typografText("Куда дальше")}>
          <Link variant="underline" href="/" className={s.link}>
            на главную
          </Link>
          <Link variant="underline" href="/portfolio" className={s.link}>
            портфолио
          </Link>
          <Link variant="underline" href="/contacts" className={s.link}>
            написать
          </Link>
        </nav>
      </div>
    </main>
  );
};

NotFoundPage.displayName = "NotFoundPage";

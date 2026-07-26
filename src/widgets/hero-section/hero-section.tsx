"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { HOME_CONTENT } from "@/shared/stub/home";
import { SplitTextAnimate } from "@/shared/ui/animate";
import { Image } from "@/shared/ui/image";
import { ParallaxScrollContainer } from "@/shared/ui/parallax-scroll-container";
import { Body } from "@/shared/ui/typography/body";
import { Heading } from "@/shared/ui/typography/heading";

import { usePreloaderStore } from "../preloader/model/preloaderStore";

import s from "./hero-section.module.scss";

export type HeroSectionProps = ComponentProps<"section"> & {
  className?: string;
  title?: string;
  text?: string;
  imageSrc?: string;
};

export const HeroSection = (props: HeroSectionProps) => {
  const {
    className,
    title = HOME_CONTENT.hero.title,
    text = HOME_CONTENT.hero.text,
    imageSrc = HOME_CONTENT.hero.image ?? "",
    ...restProps
  } = props;

  const { isFinishEndAnimation } = usePreloaderStore();

  return (
    <section className={clsx(s.root, className)} {...restProps}>
      <ParallaxScrollContainer className={s.parallax} end="bottom top">
        <div className={s.media} aria-hidden>
          {imageSrc && (
            <Image
              className={s.image}
              src={imageSrc}
              alt=""
              height="100%"
              objectFit="cover"
              loading="eager"
              sizes="100vw"
            />
          )}
        </div>

        <div className={s.content}>
          <SplitTextAnimate isVisible={isFinishEndAnimation}>
            <Heading level="1" tag="h1" className={s.title}>
              {title}
            </Heading>
          </SplitTextAnimate>
          <SplitTextAnimate isVisible={isFinishEndAnimation}>
            <Body size="primary" tag="p" className={s.text}>
              {text}
            </Body>
          </SplitTextAnimate>
        </div>
      </ParallaxScrollContainer>
    </section>
  );
};

HeroSection.displayName = "HeroSection";

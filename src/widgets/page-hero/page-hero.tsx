"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { Image } from "@/shared/ui/image";
import { ParallaxScrollContainer } from "@/shared/ui/parallax-scroll-container";
import { Body } from "@/shared/ui/typography/body";
import { Heading } from "@/shared/ui/typography/heading";

import s from "./page-hero.module.scss";

export type PageHeroProps = ComponentProps<"div"> & {
  className?: string;
  title: string;
  text?: string;
  imageSrc: string;
};

export const PageHero = (props: PageHeroProps) => {
  const { className, title, text, imageSrc, ...restProps } = props;

  return (
    <ParallaxScrollContainer
      end="bottom top"
      className={clsx(s.root, className)}
      {...restProps}
    >
      <div className={s.media}>
        <Image
          className={s.image}
          src={imageSrc}
          alt={title}
          height="100%"
          objectFit="cover"
          imageRole="hero"
          loading="eager"
          sizes="100vw"
          fetchPriority="high"
          preloaded
        />
      </div>
      <div className={s.overlay} />
      <div className={s.content}>
        <Heading level="1" tag="h1" className={s.title}>
          {title}
        </Heading>
        {text && (
          <Body size="primary" tag="p" className={s.text}>
            {text}
          </Body>
        )}
      </div>
    </ParallaxScrollContainer>
  );
};

PageHero.displayName = "PageHero";

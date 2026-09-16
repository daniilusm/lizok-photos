"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { HOME_CONTENT } from "@/shared/stub/home";
import { Image } from "@/shared/ui/image";
import { ParallaxScrollContainer } from "@/shared/ui/parallax-scroll-container";
import { typografText } from "@/shared/utils/typograf";

import s from "./photo-examples-section.module.scss";

export type PhotoExamplesSectionProps = ComponentProps<"section"> & {
  className?: string;
  images?: string[];
};

export const PhotoExamplesSection = (props: PhotoExamplesSectionProps) => {
  const { className, images: imagesProp, ...restProps } = props;
  const images = imagesProp ?? HOME_CONTENT.favoriteImages;

  return (
    <section className={clsx(s.root, className)} {...restProps}>
      <ParallaxScrollContainer
        start="top bottom"
        end="bottom top"
        className={s.grid}
      >
        {images.map((src, index) => (
          <div key={`${src}-${index + 1}`} className={s.item}>
            <Image
              className={s.image}
              src={src}
              alt={typografText(`Пример фотосессии в Твери ${index + 1}`)}
              objectFit="cover"
              imageRole="card"
              sizes="(min-width: 769px) 25vw, 50vw"
              loading="lazy"
            />
          </div>
        ))}
      </ParallaxScrollContainer>
    </section>
  );
};

PhotoExamplesSection.displayName = "PhotoExamplesSection";

"use client";

import { type ComponentProps, useMemo } from "react";
import clsx from "clsx";

import { HOME_CONTENT } from "@/shared/stub/home";
import { Image } from "@/shared/ui/image";
import { ParallaxScrollContainer } from "@/shared/ui/parallax-scroll-container";

import s from "./photo-examples-section.module.scss";

export type PhotoExamplesSectionProps = ComponentProps<"section"> & {
  className?: string;
  images?: string[];
};

export const PhotoExamplesSection = (props: PhotoExamplesSectionProps) => {
  const { className, images: imagesProp, ...restProps } = props;

  const images = useMemo(() => {
    return HOME_CONTENT.favoriteImages;
  }, [imagesProp]);

  return (
    <section className={clsx(s.root, className)} {...restProps}>
      <ParallaxScrollContainer
        className={s.grid}
        start="top bottom"
        end="bottom top"
      >
        {images.map((src, index) => (
          <div key={`${src}-${index + 1}`} className={s.item}>
            <Image
              className={s.image}
              src={src}
              alt={`Пример фотографии ${index + 1}`}
              height="100%"
              objectFit="cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              loading="lazy"
            />
          </div>
        ))}
      </ParallaxScrollContainer>
    </section>
  );
};

PhotoExamplesSection.displayName = "PhotoExamplesSection";

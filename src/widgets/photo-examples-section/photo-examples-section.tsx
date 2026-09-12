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

const chunkImages = (images: readonly string[], size: number) => {
  const chunks: string[][] = [];

  for (let i = 0; i < images.length; i += size) {
    chunks.push([...images.slice(i, i + size)]);
  }

  return chunks;
};

const PhotoCell = ({
  src,
  index,
  className,
}: {
  src: string;
  index: number;
  className?: string;
}) => (
  <div className={clsx(s.item, className)}>
    <Image
      className={s.image}
      src={src}
      alt={typografText(`Пример фотосессии в Твери ${index + 1}`)}
      height="100%"
      objectFit="cover"
      imageRole="card"
      sizes="(min-width: 769px) 50vw, 50vw"
      loading="lazy"
    />
  </div>
);

export const PhotoExamplesSection = (props: PhotoExamplesSectionProps) => {
  const { className, images: imagesProp, ...restProps } = props;
  const images = imagesProp ?? HOME_CONTENT.favoriteImages;
  const [firstGroup = [], secondGroup = []] = chunkImages(images, 5);

  return (
    <section className={clsx(s.root, className)} {...restProps}>
      <ParallaxScrollContainer
        start="top bottom"
        end="bottom top"
        className={s.groups}
      >
        {firstGroup.length > 0 && (
          <div className={clsx(s.grid, s.gridFeatureStart)}>
            {firstGroup.map((src, index) => (
              <PhotoCell key={`${src}-${index + 1}`} src={src} index={index} />
            ))}
          </div>
        )}

        {secondGroup.length > 0 && (
          <div className={clsx(s.grid, s.gridFeatureEnd)}>
            {secondGroup.map((src, index) => (
              <PhotoCell
                key={`${src}-${firstGroup.length + index + 1}`}
                src={src}
                index={firstGroup.length + index}
              />
            ))}
          </div>
        )}
      </ParallaxScrollContainer>
    </section>
  );
};

PhotoExamplesSection.displayName = "PhotoExamplesSection";

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

const GROUP_SIZE = 5;

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
  featured,
}: {
  src: string;
  index: number;
  featured?: boolean;
}) => (
  <div className={s.item}>
    <Image
      className={s.image}
      src={src}
      alt={typografText(`Пример фотосессии в Твери ${index + 1}`)}
      height="100%"
      objectFit="cover"
      imageRole={featured ? "card" : "thumb"}
      sizes={
        featured
          ? "(min-width: 769px) 50vw, 100vw"
          : "(min-width: 769px) 25vw, 50vw"
      }
      loading="lazy"
    />
  </div>
);

export const PhotoExamplesSection = (props: PhotoExamplesSectionProps) => {
  const { className, images: imagesProp, ...restProps } = props;
  const images = imagesProp ?? HOME_CONTENT.favoriteImages;
  const groups = chunkImages(images, GROUP_SIZE);

  return (
    <section className={clsx(s.root, className)} {...restProps}>
      <ParallaxScrollContainer
        start="top bottom"
        end="bottom top"
        className={s.groups}
      >
        {groups.map((group, idx) => {
          const isFeatureStart = idx % 2 === 0;
          const offset = idx * GROUP_SIZE;
          const featuredIndex = isFeatureStart ? 0 : group.length - 1;

          return (
            <div
              key={`group-${idx + 1}`}
              className={clsx(
                s.grid,
                isFeatureStart ? s.gridFeatureStart : s.gridFeatureEnd,
              )}
            >
              {group.map((src, index) => (
                <PhotoCell
                  key={`${src}-${offset + index + 1}`}
                  src={src}
                  index={offset + index}
                  featured={index === featuredIndex}
                />
              ))}
            </div>
          );
        })}
      </ParallaxScrollContainer>
    </section>
  );
};

PhotoExamplesSection.displayName = "PhotoExamplesSection";

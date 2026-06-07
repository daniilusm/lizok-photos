import type { ComponentProps } from "react";
import clsx from "clsx";

import type { MediaWithBreakpoints, RebuiltImage } from "@/shared/types";

import { getSources } from "./utils/get-sources";
import { imgSizes } from "./utils/img-sizes";

import s from "./media-image.module.scss";

export type MediaImageProps = ComponentProps<"div"> & {
  className?: string;
  altText?: string;
  src?: string;
  image?: RebuiltImage;
  source?: MediaWithBreakpoints;
  sizes?: string;
  loading?: "eager" | "lazy";
  preloaded?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
};

export const DEFAULT_SIZES = imgSizes({
  md: 100,
  default: 50,
});

export const MediaImage = (props: MediaImageProps) => {
  const {
    className,
    source,
    image,
    sizes = DEFAULT_SIZES,
    src,
    altText,
    loading = "lazy",
    preloaded,
    objectFit,
    ...rest
  } = props;

  const finalSource =
    (src
      ? {
          default: {
            url: src,
            originalUrl: src,
            mediaType: "image" as const,
          } as RebuiltImage,
        }
      : undefined) ||
    (image ? { default: image } : undefined) ||
    (source ? (source as MediaWithBreakpoints) : undefined);

  if (!finalSource) {
    return null;
  }

  const sources = getSources(finalSource, sizes); // for diferance images on viewport (horizontal | vertical)

  if (sources.length === 0) {
    return null;
  }

  return (
    <div className={clsx(s.root, className)} {...rest}>
      <picture className={s.picture}>
        {sources.map((source) => (
          <source
            key={source.breakpointSize}
            srcSet={source.srcSet}
            media={source.media}
            sizes={source.sizes}
            type={source.type}
          />
        ))}
        <img
          className={s.image}
          src={sources[sources.length - 1]?.src}
          alt={altText || sources[sources.length - 1]?.altText || ""}
          data-preloaded={preloaded}
          loading={loading}
          height={0}
          width={0}
          style={
            { "--object-fit": objectFit || "cover" } as React.CSSProperties
          }
        />
      </picture>
    </div>
  );
};

MediaImage.displayName = "MediaImage";

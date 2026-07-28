"use client";

import { type ComponentProps, type CSSProperties, useState } from "react";
import clsx from "clsx";
import NextImage from "next/image";

import s from "./image.module.scss";

export type ImageProps = ComponentProps<"img"> & {
  src: string;
  alt: string;
  objectFit?: CSSProperties["objectFit"];
  preloaded?: boolean;
  loading?: "eager" | "lazy";
  unoptimized?: boolean;
};

export const Image = (props: ImageProps) => {
  const {
    className,
    style,
    sizes = "100vw",
    width,
    height,
    objectFit,
    loading = "lazy",
    preloaded = false,
    unoptimized = true,
    ...restProps
  } = props;

  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={clsx(s.root, className)} data-loading={isLoading}>
      <NextImage
        data-preloaded={preloaded}
        className={s.image}
        height={0}
        onLoad={handleLoad}
        sizes={sizes}
        loading={loading}
        width={0}
        unoptimized={unoptimized}
        style={{
          ...(width ? { "--image-width": width } : {}),
          ...(height ? { "--image-height": height } : {}),
          ...(objectFit ? { "--object-fit": objectFit } : {}),
          ...style,
        }}
        {...restProps}
      />
    </div>
  );
};

Image.displayName = "Image";

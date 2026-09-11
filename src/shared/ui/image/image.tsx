"use client";

import {
  type ComponentProps,
  type CSSProperties,
  useMemo,
  useState,
} from "react";
import clsx from "clsx";
import NextImage from "next/image";

import {
  type CloudinaryImageRole,
  type OptimizeCloudinaryImageOptions,
  getCloudinarySrcSet,
  isCloudinaryUrl,
  optimizeCloudinaryImage,
} from "@/shared/lib/cloudinary-image";

import s from "./image.module.scss";

export type ImageProps = ComponentProps<"img"> & {
  src: string;
  alt: string;
  objectFit?: CSSProperties["objectFit"];
  preloaded?: boolean;
  loading?: "eager" | "lazy";
  unoptimized?: boolean;
  /**
   * Оптимизация Cloudinary URL (q_auto, f_auto, width + srcSet).
   * По умолчанию включена для res.cloudinary.com.
   */
  optimize?: boolean;
  /** Пресет размера. По умолчанию `card`. */
  imageRole?: CloudinaryImageRole;
  /** Явная ширина transform (перебивает role.width для src) */
  imageWidth?: number;
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
    optimize = true,
    imageRole = "card",
    imageWidth,
    src,
    alt,
    ...restProps
  } = props;

  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const optimizeOptions = useMemo<OptimizeCloudinaryImageOptions>(
    () => ({
      role: imageRole,
      width: imageWidth,
      crop: imageRole === "thumb" ? "fill" : "limit",
      ...(imageRole === "thumb" && imageWidth
        ? { height: Math.round(imageWidth * 0.75) }
        : imageRole === "thumb"
          ? { height: Math.round(400 * 0.75) }
          : {}),
    }),
    [imageRole, imageWidth],
  );

  const shouldOptimize = optimize && isCloudinaryUrl(src);

  const optimizedSrc = useMemo(() => {
    if (!shouldOptimize) return src;
    return optimizeCloudinaryImage(src, optimizeOptions);
  }, [optimizeOptions, shouldOptimize, src]);

  const optimizedSrcSet = useMemo(() => {
    if (!shouldOptimize) return undefined;
    return getCloudinarySrcSet(src, optimizeOptions);
  }, [optimizeOptions, shouldOptimize, src]);

  const imageStyle = {
    ...(width ? { "--image-width": width } : {}),
    ...(height ? { "--image-height": height } : {}),
    ...(objectFit ? { "--object-fit": objectFit } : {}),
    ...style,
  } as CSSProperties;

  return (
    <div className={clsx(s.root, className)} data-loading={isLoading}>
      {shouldOptimize ? (
        // static export: Next Image unoptimized не строит srcSet — нужен native img
        // biome-ignore lint/performance/noImgElement: Cloudinary srcSet requires native img under static export
        <img
          {...(preloaded ? { "data-preloaded": "true" } : {})}
          className={s.image}
          src={optimizedSrc}
          srcSet={optimizedSrcSet}
          sizes={sizes}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={handleLoad}
          style={imageStyle}
          {...restProps}
        />
      ) : (
        <NextImage
          {...(preloaded ? { "data-preloaded": "true" } : {})}
          className={s.image}
          height={0}
          onLoad={handleLoad}
          sizes={sizes}
          loading={loading}
          width={0}
          unoptimized={unoptimized}
          src={src}
          alt={alt}
          style={imageStyle}
          {...restProps}
        />
      )}
    </div>
  );
};

Image.displayName = "Image";

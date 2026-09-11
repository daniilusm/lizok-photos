import { memo } from "react";
import clsx from "clsx";

import { Image } from "@/shared/ui/image";

import s from "./inner-page.module.scss";

type InnerPagePreviewProps = {
  images: { url: string }[];
  activeIndex: number;
  projectName: string;
};

export const InnerPagePreview = memo(
  ({ images, activeIndex, projectName }: InnerPagePreviewProps) => {
    if (!images.length) {
      return null;
    }

    return (
      <div className={s.imageHover}>
        <div className={s.previewStack}>
          {images.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <Image
                key={image.url}
                src={image.url}
                alt={`${projectName} — фото ${index + 1}`}
                height="100%"
                objectFit="contain"
                className={clsx(s.currentImage, isActive && s.currentImageActive)}
                imageRole="preview"
                loading={index === 0 ? "eager" : "lazy"}
                sizes="50vw"
                preloaded={index === 0}
                aria-hidden={!isActive}
              />
            );
          })}
        </div>
        <div className={s.counter}>
          {activeIndex + 1} / {images.length}
        </div>
      </div>
    );
  },
);

InnerPagePreview.displayName = "InnerPagePreview";

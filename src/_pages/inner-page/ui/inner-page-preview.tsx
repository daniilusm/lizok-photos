import { memo } from "react";

import { Image } from "@/shared/ui/image";

import { getCloudinaryPreviewUrl } from "../lib/get-cloudinary-image-url";

import s from "./inner-page.module.scss";

type InnerPagePreviewProps = {
  images: { url: string }[];
  activeIndex: number;
  slug?: string | string[];
};

export const InnerPagePreview = memo(
  ({ images, activeIndex, slug }: InnerPagePreviewProps) => {
    const activeImage = images[activeIndex];

    if (!activeImage) {
      return null;
    }

    return (
      <div className={s.imageHover}>
        <Image
          src={getCloudinaryPreviewUrl(activeImage.url)}
          alt={`${slug ?? "project"} image ${activeIndex + 1}`}
          height="100%"
          objectFit="contain"
          className={s.currentImage}
          loading="eager"
          sizes="50vw"
        />
        <div className={s.counter}>
          {activeIndex + 1} / {images.length}
        </div>
      </div>
    );
  },
);

InnerPagePreview.displayName = "InnerPagePreview";

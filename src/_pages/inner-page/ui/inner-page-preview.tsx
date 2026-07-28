import { memo } from "react";

import { Image } from "@/shared/ui/image";

import { getCloudinaryPreviewUrl } from "../lib/get-cloudinary-image-url";

import s from "./inner-page.module.scss";

type InnerPagePreviewProps = {
  images: { url: string }[];
  activeIndex: number;
  projectName: string;
};

export const InnerPagePreview = memo(
  ({ images, activeIndex, projectName }: InnerPagePreviewProps) => {
    const activeImage = images[activeIndex];

    if (!activeImage) {
      return null;
    }

    return (
      <div className={s.imageHover}>
        <Image
          src={getCloudinaryPreviewUrl(activeImage.url)}
          alt={`${projectName} — фото ${activeIndex + 1}`}
          height="100%"
          objectFit="contain"
          className={s.currentImage}
          loading="eager"
          sizes="50vw"
          preloaded={false}
        />
        <div className={s.counter}>
          {activeIndex + 1} / {images.length}
        </div>
      </div>
    );
  },
);

InnerPagePreview.displayName = "InnerPagePreview";

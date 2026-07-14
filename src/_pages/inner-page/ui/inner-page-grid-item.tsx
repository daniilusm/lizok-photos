import { memo, useCallback } from "react";
import clsx from "clsx";

import { Button } from "@/shared/ui/button";
import { Image } from "@/shared/ui/image";

import { getCloudinaryThumbnailUrl } from "../lib/get-cloudinary-image-url";

import s from "./inner-page.module.scss";

type InnerPageGridItemProps = {
  url: string;
  index: number;
  isActive: boolean;
  onSelect: (index: number) => void;
};

export const InnerPageGridItem = memo(
  ({ url, index, isActive, onSelect }: InnerPageGridItemProps) => {
    const handleClick = useCallback(() => {
      onSelect(index);
    }, [index, onSelect]);

    const handleMouseEnter = useCallback(() => {
      onSelect(index);
    }, [index, onSelect]);

    return (
      <Button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className={clsx(s.imageGridWrapper, {
          [s.activeHover]: isActive,
        })}
      >
        <Image
          className={s.image}
          src={getCloudinaryThumbnailUrl(url)}
          alt=""
          height="100%"
          sizes="(min-width: 1024px) 20vw, (min-width: 768px) 30vw, 45vw"
          loading="lazy"
        />
      </Button>
    );
  },
);

InnerPageGridItem.displayName = "InnerPageGridItem";

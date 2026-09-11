import { memo, useCallback } from "react";
import clsx from "clsx";

import { Button } from "@/shared/ui/button";
import { Image } from "@/shared/ui/image";

import s from "./inner-page.module.scss";

type InnerPageGridItemProps = {
  url: string;
  index: number;
  projectName: string;
  isActive: boolean;
  onSelect: (index: number) => void;
};

export const InnerPageGridItem = memo(
  ({
    url,
    index,
    projectName,
    isActive,
    onSelect,
  }: InnerPageGridItemProps) => {
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
        aria-label={`${projectName}: фото ${index + 1}`}
      >
        <Image
          className={s.image}
          src={url}
          alt={`${projectName} — фото ${index + 1}`}
          height="100%"
          imageRole="thumb"
          sizes="(min-width: 1024px) 20vw, (min-width: 768px) 30vw, 45vw"
          loading="lazy"
          preloaded={false}
        />
      </Button>
    );
  },
);

InnerPageGridItem.displayName = "InnerPageGridItem";

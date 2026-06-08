import { type ComponentProps, useCallback, useState } from "react";
import clsx from "clsx";

import { Button } from "@/shared/ui/button";
import { Image } from "@/shared/ui/image";
import { ParallaxScrollContainer } from "@/shared/ui/parallax-scroll-container";
import { Portal } from "@/shared/ui/portal";

import s from "./inner-page.module.scss";

export type InnerPageProps = ComponentProps<"div"> & {
  className?: string;
};

export const InnerPage = (props: InnerPageProps) => {
  const { className } = props;

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const handleClose = useCallback(() => {
    setCurrentIndex(null);
  }, []);

  return (
    <>
      <ParallaxScrollContainer className={clsx(s.root, className)}>
        {Array.from({ length: 10 }).map((_, idx) => (
          <Button
            key={`image-${idx + 1}`}
            onClick={() => setCurrentIndex(idx + 1)}
          >
            <Image
              className={s.image}
              src={`/parallax-gallery/${idx + 1}.webp`}
              alt="image"
              height="100%"
            />
          </Button>
        ))}
      </ParallaxScrollContainer>
      <Portal
        id="image-popup"
        className={clsx(s.imagePopup, { [s.openPopup]: currentIndex !== null })}
      >
        <div>
          <Button onClick={handleClose} className={s.crossBtn}>
            close
          </Button>
          <div className={s.overlay} onClick={handleClose} />
          {currentIndex !== null && (
            <Image
              src={`/parallax-gallery/${currentIndex}.webp`}
              alt="alt image popup"
              height="100%"
              className={s.popupImage}
            />
          )}
        </div>
      </Portal>
    </>
  );
};

InnerPage.displayName = "InnerPage";

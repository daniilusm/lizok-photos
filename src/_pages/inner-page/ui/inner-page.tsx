import { type ComponentProps, useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";

import { projects } from "@/shared/stub/projects";
import { Button } from "@/shared/ui/button";
import { ImageSwitcher } from "@/shared/ui/Image-switcher";
import { Icon } from "@/shared/ui/icon";
import { Image } from "@/shared/ui/image";
import { ParallaxScrollContainer } from "@/shared/ui/parallax-scroll-container";
import { Portal } from "@/shared/ui/portal";

import s from "./inner-page.module.scss";

export type InnerPageProps = ComponentProps<"div"> & {
  className?: string;
};

export const InnerPage = (props: InnerPageProps) => {
  const { className } = props;

  const { query } = useRouter();

  const currentProject = useMemo(() => {
    return projects.find((item) => item.slug === query.slug);
  }, [query.slug]);

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const [currentIndexHover, setCurrentIndexHover] = useState<number>(0);

  const handleClose = useCallback(() => {
    setCurrentIndex(null);
  }, []);

  return (
    <>
      <ParallaxScrollContainer className={clsx(s.root, className)}>
        <div className={s.list}>
          {currentProject?.images.map((item, idx) => (
            <Button
              key={`image-${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              onMouseEnter={() => setCurrentIndexHover(idx)}
              className={clsx(s.imageGridWrapper, {
                [s.activeHover]: currentIndexHover === idx,
              })}
            >
              <Image
                className={s.image}
                src={item.url}
                alt="image"
                height="100%"
              />
            </Button>
          ))}
        </div>
        <div className={s.imageHover}>
          <Image
            src={currentProject?.images[currentIndexHover]?.url!}
            alt={`${query.slug} image`}
            height="100%"
            objectFit="contain"
            className={s.currentImage}
          />
        </div>
      </ParallaxScrollContainer>
      <Portal
        id="image-popup"
        className={clsx(s.imagePopup, { [s.openPopup]: currentIndex !== null })}
      >
        <div>
          <Button onClick={handleClose} className={s.crossBtn}>
            <Icon name="close" size="s" />
          </Button>
          <div className={s.overlay} onClick={handleClose} />
          {currentIndex !== null && (
            <Image
              src={currentProject?.images[currentIndex]?.url!}
              alt={`${query.slug} image`}
              height="100%"
              objectFit="contain"
              className={s.popupImage}
            />
          )}
        </div>
      </Portal>
    </>
  );
};

InnerPage.displayName = "InnerPage";

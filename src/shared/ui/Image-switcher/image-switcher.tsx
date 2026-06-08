import clsx from "clsx";

import type { RebuiltMedia } from "@shared/types";
import { Image } from "@shared/ui/image";
import { SwitchTransition } from "@shared/ui/transition";

import s from "./image-switcher.module.scss";

export type ImageSwitcherProps = {
  className: string;
  curImage?: RebuiltMedia | null;
  imagesPreload: RebuiltMedia[];
  timeout?: number;
};

export const ImageSwitcher = (props: ImageSwitcherProps) => {
  const { className, curImage, imagesPreload, timeout = 0 } = props;

  return (
    <div className={clsx(s.root, className)}>
      <SwitchTransition mode="default" state={curImage} timeout={timeout}>
        {(state, _stage) =>
          state && (
            <Image
              height="100%"
              className={s.image}
              alt={state.alt || ""}
              src={state.url}
            />
          )
        }
      </SwitchTransition>

      {imagesPreload && (
        <div className={s.preloadImage}>
          {imagesPreload.map((img) => (
            <Image
              key={img.id || Math.random()}
              alt={img.alt || ""}
              src={img.url}
            />
          ))}
        </div>
      )}
    </div>
  );
};

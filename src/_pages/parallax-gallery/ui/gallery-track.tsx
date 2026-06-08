"use client";

import type { RefObject } from "react";

import s from "./parallax-gallery-page.module.scss";

type GalleryTrackProps = {
  images: string[];
  containerRef: RefObject<HTMLDivElement | null>;
  setMediaRef: (index: number, node: HTMLDivElement | null) => void;
  setImageRef: (index: number, node: HTMLImageElement | null) => void;
};

export const GalleryTrack = ({
  images,
  containerRef,
  setMediaRef,
  setImageRef,
}: GalleryTrackProps) => {
  return (
    <div ref={containerRef} className={s.container}>
      {images.map((src, index) => (
        <div
          key={src}
          className={s.media}
          ref={(node) => setMediaRef(index, node)}
        >
          {/* biome-ignore lint/performance/noImgElement: Required for texture preloading and fallback */}
          <img
            ref={(node) => setImageRef(index, node)}
            className={s.mediaImage}
            src={src}
            alt=""
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
};

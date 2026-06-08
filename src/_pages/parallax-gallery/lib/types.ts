import type { RefObject } from "react";

export type GalleryViewport = {
  width: number;
  height: number;
};

export type GalleryScrollState = {
  current: number;
  target: number;
  limit: number;
};

export type GalleryRefs = {
  wrapperRef: RefObject<HTMLDivElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  mediaRefs: RefObject<(HTMLDivElement | null)[]>;
  imageRefs: RefObject<(HTMLImageElement | null)[]>;
};

export type GalleryPointerState = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  hover: number;
};

export type GalleryPointerRef = RefObject<GalleryPointerState[]>;

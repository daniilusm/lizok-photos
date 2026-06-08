import type { GalleryViewport } from "./types";

export const getWindowViewport = (): GalleryViewport => ({
  width: typeof window !== "undefined" ? window.innerWidth : 0,
  height: typeof window !== "undefined" ? window.innerHeight : 0,
});

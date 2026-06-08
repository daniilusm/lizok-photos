import { clamp } from "@shared/utils/math";

export const applyDomParallax = (images: (HTMLImageElement | null)[]) => {
  const viewportCenter = window.innerWidth / 2;

  for (const image of images) {
    if (!image) continue;

    const rect = image.parentElement?.getBoundingClientRect();
    if (!rect) continue;

    const t = clamp(
      (rect.left + rect.width / 2 - viewportCenter) / viewportCenter,
      -1,
      1,
    );

    image.style.transform = `translate3d(${-t * 10}%, 0, 0)`;
  }
};

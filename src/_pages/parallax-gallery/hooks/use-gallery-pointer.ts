"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import type { GalleryPointerState } from "../lib/types";

const createPointerState = (): GalleryPointerState => ({
  x: 0.5,
  y: 0.5,
  velocityX: 0,
  velocityY: 0,
  hover: 0,
});

export const useGalleryPointer = (
  mediaRefs: RefObject<(HTMLDivElement | null)[]>,
  count: number,
) => {
  const pointersRef = useRef<GalleryPointerState[]>(
    Array.from({ length: count }, createPointerState),
  );

  useEffect(() => {
    pointersRef.current = Array.from({ length: count }, (_, index) => {
      return pointersRef.current[index] ?? createPointerState();
    });
  }, [count]);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const pointers = pointersRef.current;

      for (let index = 0; index < count; index += 1) {
        const media = mediaRefs.current[index];
        const pointer = pointers[index] ?? createPointerState();

        if (!media) {
          pointer.hover = 0;
          pointer.velocityX = 0;
          pointer.velocityY = 0;
          pointers[index] = pointer;
          continue;
        }

        const rect = media.getBoundingClientRect();
        const isInside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;

        if (isInside) {
          pointer.x = (event.clientX - rect.left) / rect.width;
          pointer.y = 1 - (event.clientY - rect.top) / rect.height;
          pointer.velocityX = event.movementX / rect.width;
          pointer.velocityY = -event.movementY / rect.height;
          pointer.hover = 1;
        } else {
          pointer.hover = 0;
          pointer.velocityX = 0;
          pointer.velocityY = 0;
        }

        pointers[index] = pointer;
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [count, mediaRefs]);

  return pointersRef;
};

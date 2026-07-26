"use client";

import type { RefObject } from "react";
import Link from "next/link";

import {
  getProjectHref,
  type Project,
} from "@/shared/stub/projects";
import { Image } from "@/shared/ui/image";

import s from "./parallax-gallery-page.module.scss";

type GalleryTrackProps = {
  projectsType: string;
  projects: Project[];
  images: string[];
  containerRef: RefObject<HTMLDivElement | null>;
  setMediaRef: (index: number, node: HTMLDivElement | null) => void;
  setImageRef: (index: number, node: HTMLImageElement | null) => void;
};

export const GalleryTrack = ({
  projectsType,
  projects,
  images,
  containerRef,
  setMediaRef,
  setImageRef,
}: GalleryTrackProps) => {
  return (
    <div ref={containerRef} className={s.container}>
      {images.map((src, index) => {
        const project = projects[index];

        return (
          <div
            key={src}
            className={s.media}
            ref={(node) => setMediaRef(index, node)}
          >
            <Image
              ref={(node) => setImageRef(index, node)}
              className={s.mediaImage}
              src={src}
              alt={project?.slug ?? "project image"}
              draggable={false}
            />
            {project && (
              <Link
                className={s.link}
                href={getProjectHref(projectsType, project.slug)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

"use client";

import { usePointerParallax } from "@/shared/hooks/use-pointer-parallax";
import { getProjectHref, type Project } from "@/shared/stub/projects";
import { Button } from "@/shared/ui/button";
import { Image } from "@/shared/ui/image";

import s from "./project-card.module.scss";

export type ProjectCardProps = {
  project: Project;
  projectsType: string;
};

export const ProjectCard = ({ project, projectsType }: ProjectCardProps) => {
  const { rootRef, onMouseMove, onMouseLeave } = usePointerParallax({
    strength: 2,
  });

  return (
    <div
      ref={rootRef}
      className={s.card}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <Button
        href={getProjectHref(projectsType, project.slug)}
        className={s.link}
      >
        <Image
          className={s.image}
          src={project.mainImage}
          alt={project.name}
          height="100%"
          objectFit="cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
          loading="lazy"
        />
        <span className={s.overlay} aria-hidden />
        <span className={s.caption}>{project.name}</span>
      </Button>
    </div>
  );
};

ProjectCard.displayName = "ProjectCard";

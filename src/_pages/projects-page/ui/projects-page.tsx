"use client";

import clsx from "clsx";

import {
  getProjectHref,
  type Project,
  projectTypes,
} from "@/shared/stub/projects";
import { Button } from "@/shared/ui/button";
import { Image } from "@/shared/ui/image";
import { ParallaxScrollContainer } from "@/shared/ui/parallax-scroll-container";
import { Heading } from "@/shared/ui/typography/heading";

import s from "./projects-page.module.scss";

export type ProjectsPageProps = {
  className?: string;
  projectsType: string;
  currentProjects: Project[];
};

export const ProjectsPage = (props: ProjectsPageProps) => {
  const { className, projectsType, currentProjects } = props;

  const projectType = projectTypes.find((item) => item.slug === projectsType);

  return (
    <main className={clsx(s.root, className)}>
      {projectType && (
        <Heading level="2" tag="h1" className={s.title}>
          {projectType.name}
        </Heading>
      )}

      <ParallaxScrollContainer
        start="top bottom"
        end="bottom top"
        className={s.list}
      >
        {currentProjects.map((project) => (
          <Button
            key={project.slug}
            href={getProjectHref(projectsType, project.slug)}
            className={s.card}
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
        ))}
      </ParallaxScrollContainer>
    </main>
  );
};

ProjectsPage.displayName = "ProjectsPage";

"use client";

import clsx from "clsx";

import { type Project, projectTypes } from "@/shared/stub/projects";
import { ParallaxScrollContainer } from "@/shared/ui/parallax-scroll-container";
import { Heading } from "@/shared/ui/typography/heading";

import { ProjectCard } from "./project-card";

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
          <ProjectCard
            key={project.slug}
            project={project}
            projectsType={projectsType}
          />
        ))}
      </ParallaxScrollContainer>
    </main>
  );
};

ProjectsPage.displayName = "ProjectsPage";

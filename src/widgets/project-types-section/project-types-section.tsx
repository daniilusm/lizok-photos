"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { type ProjectType, projectTypes } from "@/shared/stub/projects";
import { SplitTextAnimateInView } from "@/shared/ui/animate";
import { ParallaxScrollContainer } from "@/shared/ui/parallax-scroll-container";
import { Heading } from "@/shared/ui/typography/heading";

import { ProjectTypeCard } from "./project-type-card";

import s from "./project-types-section.module.scss";

export type ProjectTypesSectionProps = ComponentProps<"section"> & {
  className?: string;
  items?: ProjectType[];
  title?: string;
};

export const ProjectTypesSection = (props: ProjectTypesSectionProps) => {
  const {
    className,
    items = projectTypes,
    title = "Фотосессии",
    ...restProps
  } = props;

  return (
    <section className={clsx(s.root, className)} {...restProps}>
      <SplitTextAnimateInView>
        <Heading level="2" tag="h2" className={s.heading}>
          {title}
        </Heading>
      </SplitTextAnimateInView>
      <ParallaxScrollContainer
        start="top bottom"
        end="bottom top"
        className={s.list}
      >
        {items.map((item) => (
          <ProjectTypeCard key={item.slug} item={item} />
        ))}
      </ParallaxScrollContainer>
    </section>
  );
};

ProjectTypesSection.displayName = "ProjectTypesSection";

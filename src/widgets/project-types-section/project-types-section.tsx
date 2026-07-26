"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import {
  getProjectTypeHref,
  type ProjectType,
  projectTypes,
} from "@/shared/stub/projects";
import { Button } from "@/shared/ui/button";
import { Image } from "@/shared/ui/image";
import { ParallaxScrollContainer } from "@/shared/ui/parallax-scroll-container";
import { Heading } from "@/shared/ui/typography/heading";

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
      <Heading level="2" tag="h2" className={s.heading}>
        {title}
      </Heading>
      <ParallaxScrollContainer
        start="top bottom"
        end="bottom top"
        className={s.list}
      >
        {items.map((item) => (
          <Button
            key={item.slug}
            href={getProjectTypeHref(item.slug)}
            className={s.card}
          >
            <Image
              className={s.image}
              src={item.mainImage}
              alt={item.name}
              height="100%"
              objectFit="cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              loading="lazy"
            />
            <span className={s.caption}>{item.name}</span>
          </Button>
        ))}
      </ParallaxScrollContainer>
    </section>
  );
};

ProjectTypesSection.displayName = "ProjectTypesSection";

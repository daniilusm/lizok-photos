"use client";

import { getProjectTypeHref, type ProjectType } from "@/shared/stub/projects";
import { usePointerParallax } from "@/shared/hooks/use-pointer-parallax";
import { Button } from "@/shared/ui/button";
import { Image } from "@/shared/ui/image";

import s from "./project-type-card.module.scss";

export type ProjectTypeCardProps = {
  item: ProjectType;
};

export const ProjectTypeCard = ({ item }: ProjectTypeCardProps) => {
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
      <Button href={getProjectTypeHref(item.slug)} className={s.link}>
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
    </div>
  );
};

ProjectTypeCard.displayName = "ProjectTypeCard";

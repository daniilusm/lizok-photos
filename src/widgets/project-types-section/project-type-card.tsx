"use client";

import { getProjectTypeHref, type ProjectType } from "@/shared/stub/projects";
import { Button } from "@/shared/ui/button";
import { Image } from "@/shared/ui/image";

import s from "./project-type-card.module.scss";

export type ProjectTypeCardProps = {
  item: ProjectType;
};

export const ProjectTypeCard = ({ item }: ProjectTypeCardProps) => {
  return (
    <div className={s.card}>
      <Button href={getProjectTypeHref(item.slug)} className={s.link}>
        <Image
          className={s.image}
          src={item.mainImage}
          alt={item.name}
          height="100%"
          objectFit="cover"
          imageRole="card"
          sizes="(min-width: 1024px) 50vw, 100vw"
          loading="lazy"
        />
        <div className={s.overlay} />
        <span className={s.caption}>{item.name}</span>
      </Button>
    </div>
  );
};

ProjectTypeCard.displayName = "ProjectTypeCard";

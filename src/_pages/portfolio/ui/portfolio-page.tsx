"use client";

import { typografText } from "@/shared/utils/typograf";
import { PageHero } from "@/widgets/page-hero";
import { ProjectTypesSection } from "@/widgets/project-types-section";

import s from "./portfolio-page.module.scss";

export const PortfolioPage = () => {
  return (
    <main className={s.root}>
      <PageHero
        title={typografText("Портфолио")}
        text={typografText(
          "Фотосессии: индивидуальные, семейные, свадебные и репортажные съёмки.",
        )}
        imageSrc="https://res.cloudinary.com/fgedebup/image/upload/v1789374537/00015_vfvdnt.webp"
      />
      <ProjectTypesSection className={s.section} />
    </main>
  );
};

PortfolioPage.displayName = "PortfolioPage";

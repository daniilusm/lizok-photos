"use client";

import { HOME_CONTENT } from "@/shared/stub/home";
import { PageHero } from "@/widgets/page-hero";
import { ProjectTypesSection } from "@/widgets/project-types-section";

import s from "./portfolio-page.module.scss";

export const PortfolioPage = () => {
  return (
    <main className={s.root}>
      <PageHero
        title="Портфолио"
        text="Подборка съёмок: индивидуальные, семейные и мероприятия."
        imageSrc={HOME_CONTENT.favoriteImages[0]}
      />
      <ProjectTypesSection />
    </main>
  );
};

PortfolioPage.displayName = "PortfolioPage";

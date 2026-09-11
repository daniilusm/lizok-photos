"use client";

import { HOME_CONTENT } from "@/shared/stub/home";
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
        imageSrc={HOME_CONTENT.favoriteImages[0]}
      />
      <ProjectTypesSection />
    </main>
  );
};

PortfolioPage.displayName = "PortfolioPage";

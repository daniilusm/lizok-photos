"use client";

import { HOME_CONTENT } from "@/shared/stub/home";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { PageHero } from "@/widgets/page-hero";
import { ProjectTypesSection } from "@/widgets/project-types-section";

import s from "./portfolio-page.module.scss";

export const PortfolioPage = () => {
  return (
    <main className={s.root}>
      <Breadcrumbs
        items={[{ label: "Главная", href: "/" }, { label: "Портфолио" }]}
      />
      <PageHero
        title="Портфолио фотографа в Твери"
        text="Фотосессии в Твери: индивидуальные, семейные, свадебные и репортажные съёмки. Примеры работ Елизаветы Акимовой."
        imageSrc={HOME_CONTENT.favoriteImages[0]}
      />
      <ProjectTypesSection />
    </main>
  );
};

PortfolioPage.displayName = "PortfolioPage";

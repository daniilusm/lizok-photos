"use client";

import { ProjectTypesSection } from "@/widgets/project-types-section";

import s from "./portfolio-page.module.scss";

export const PortfolioPage = () => {
  return (
    <main className={s.root}>
      <ProjectTypesSection title="Портфолио" isPage />
    </main>
  );
};

PortfolioPage.displayName = "PortfolioPage";

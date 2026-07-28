"use client";

import { AboutSection } from "@/widgets/about-section";
import { ComparisonSection } from "@/widgets/comparison-section";
import { ContactsSection } from "@/widgets/contacts-section";
import { HeroSection } from "@/widgets/hero-section";
import { PhotoExamplesSection } from "@/widgets/photo-examples-section";
import { ProjectTypesSection } from "@/widgets/project-types-section";
import { PHOTOGRAPHER } from "@/shared/seo";
import { SeoHeading } from "@/shared/ui/seo-heading";

import s from "./home-page.module.scss";

export const HomePage = () => {
  return (
    <main className={s.root}>
      <SeoHeading level={2}>
        Фотограф в {PHOTOGRAPHER.city} — индивидуальные, семейные и репортажные
        съёмки
      </SeoHeading>
      <HeroSection />
      <AboutSection />
      <PhotoExamplesSection />
      <ComparisonSection />
      <ProjectTypesSection title="Фотосессии" className={s.projects} />
      <ContactsSection />
    </main>
  );
};

HomePage.displayName = "HomePage";

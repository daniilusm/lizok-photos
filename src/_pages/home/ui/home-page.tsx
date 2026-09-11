"use client";

import { SeoHeading } from "@/shared/ui/seo-heading";
import { AboutSection } from "@/widgets/about-section";
import { ComparisonSection } from "@/widgets/comparison-section";
import { ContactsSection } from "@/widgets/contacts-section";
import { HeroSection } from "@/widgets/hero-section";
import { LocalSeoSection } from "@/widgets/local-seo-section";
import { PhotoExamplesSection } from "@/widgets/photo-examples-section";
import { ProjectTypesSection } from "@/widgets/project-types-section";

import s from "./home-page.module.scss";

export const HomePage = () => {
  return (
    <main className={s.root}>
      <SeoHeading level={2}>
        Фотограф Тверь, свадебный фотограф Тверь, фотосессии в Твери —
        портфолио и запись на съёмку
      </SeoHeading>
      <HeroSection />
      <AboutSection />
      <PhotoExamplesSection />
      <ComparisonSection
        beforeLabel="До обработки"
        afterLabel="После обработки"
      />
      <ProjectTypesSection
        title="Фотосессии в Твери"
        className={s.projects}
      />
      <LocalSeoSection />
      <ContactsSection />
    </main>
  );
};

HomePage.displayName = "HomePage";

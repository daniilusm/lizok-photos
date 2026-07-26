"use client";

import { AboutSection } from "@/widgets/about-section";
import { ContactsSection } from "@/widgets/contacts-section";
import { HeroSection } from "@/widgets/hero-section";
import { PhotoExamplesSection } from "@/widgets/photo-examples-section";
import { ProjectTypesSection } from "@/widgets/project-types-section";

import s from "./home-page.module.scss";

export const HomePage = () => {
  return (
    <main className={s.root}>
      <HeroSection />
      <AboutSection />
      <PhotoExamplesSection />
      <ProjectTypesSection />
      <ContactsSection />
    </main>
  );
};

HomePage.displayName = "HomePage";

"use client";

import { ContactsSection } from "@/widgets/contacts-section";

import s from "./contacts-page.module.scss";

export const ContactsPage = () => {
  return (
    <main className={s.root}>
      <ContactsSection isPage />
    </main>
  );
};

ContactsPage.displayName = "ContactsPage";

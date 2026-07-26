"use client";

import { Heading } from "@/shared/ui/typography/heading";

import s from "./price-page.module.scss";

export const PricePage = () => {
  return (
    <main className={s.root}>
      <section>
        <Heading level="1" tag="h1">
          Стоимость
        </Heading>
      </section>
      <section>пакеты</section>
    </main>
  );
};

PricePage.displayName = "PricePage";

"use client";

import s from "./price-page.module.scss";

export const PricePage = () => {
  return (
    <main className={s.root}>
      <section>стоимость</section>
      <section>пакеты</section>
    </main>
  );
};

PricePage.displayName = "PricePage";

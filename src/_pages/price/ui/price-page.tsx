"use client";

import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";

import { PRICE_CONTENT } from "@/shared/stub/price";
import { Image } from "@/shared/ui/image";
import { Link } from "@/shared/ui/link";
import { ParallaxScrollContainer } from "@/shared/ui/parallax-scroll-container";
import { Body } from "@/shared/ui/typography/body";
import { Heading } from "@/shared/ui/typography/heading";
import { typografText } from "@/shared/utils/typograf";
import { ComparisonSection } from "@/widgets/comparison-section";
import { PageHero } from "@/widgets/page-hero";

import s from "./price-page.module.scss";

type FaqItemProps = {
  question: string;
  answer: string;
};

const FaqItem = ({ question, answer }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const answerRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);
  const panelId = useId();

  useEffect(() => {
    const el = answerRef.current;
    if (!el) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      el.style.maxHeight = "0px";
      return;
    }

    if (isOpen) {
      el.style.maxHeight = "0px";
      void el.offsetHeight;
      el.style.maxHeight = `${el.scrollHeight}px`;
      return;
    }

    el.style.maxHeight = `${el.scrollHeight}px`;
    void el.offsetHeight;
    el.style.maxHeight = "0px";
  }, [isOpen, answer]);

  useEffect(() => {
    const el = answerRef.current;
    if (!el || !isOpen) return;

    const onResize = () => {
      el.style.maxHeight = `${el.scrollHeight}px`;
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen]);

  return (
    <div className={clsx(s.faqItem, isOpen && s.faqItemOpen)}>
      <button
        type="button"
        className={s.faqQuestion}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {question}
      </button>
      <section
        id={panelId}
        ref={answerRef}
        className={s.faqAnswer}
        aria-hidden={!isOpen}
      >
        <Body size="primary" tag="p" className={s.faqAnswerText}>
          {answer}
        </Body>
      </section>
    </div>
  );
};

export const PricePage = () => {
  const { hero, advantages, breakImage, process, packages, note, faq } =
    PRICE_CONTENT;

  return (
    <main className={s.root}>
      <PageHero title={hero.title} text={hero.text} imageSrc={hero.image} />

      <section className={s.advantages} aria-labelledby="price-advantages">
        <Heading
          level="2"
          tag="h2"
          id="price-advantages"
          className={s.sectionTitle}
        >
          {advantages.title}
        </Heading>
        <ul className={s.advantagesList}>
          {advantages.items.map((item) => (
            <li key={item} className={s.advantagesItem}>
              <Body size="primary" tag="span">
                {item}
              </Body>
            </li>
          ))}
        </ul>
      </section>

      <ParallaxScrollContainer
        className={s.breakMedia}
        start="top bottom"
        end="bottom top"
        aria-hidden
      >
        <Image
          className={s.breakImage}
          src={breakImage}
          alt=""
          height="100%"
          objectFit="cover"
          imageRole="hero"
          sizes="100vw"
          loading="lazy"
        />
      </ParallaxScrollContainer>

      <section className={s.process} aria-labelledby="price-process">
        <Heading
          level="2"
          tag="h2"
          id="price-process"
          className={s.sectionTitle}
        >
          {process.title}
        </Heading>

        <div className={s.processList}>
          {process.blocks.map((block) => (
            <article key={block.title} className={s.processBlock}>
              <Heading level="3" tag="h3" className={s.processBlockTitle}>
                {block.title}
              </Heading>
              <div className={s.processTexts}>
                {block.paragraphs.map((paragraph) => (
                  <Body
                    key={paragraph}
                    size="primary"
                    tag="p"
                    className={s.processText}
                  >
                    {paragraph}
                  </Body>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <ComparisonSection />

      <section className={s.packages} aria-labelledby="price-packages">
        <Heading
          level="2"
          tag="h2"
          id="price-packages"
          className={s.sectionTitle}
        >
          {packages.title}
        </Heading>

        <div className={s.packagesList}>
          {packages.items.map((item, index) => (
            <article
              key={item.slug}
              className={s.package}
              data-reverse={index % 2 === 1 || undefined}
            >
              <ParallaxScrollContainer
                end="bottom top"
                start="top bottom"
                className={s.packageMedia}
              >
                <Image
                  className={s.packageImage}
                  src={item.image}
                  alt={item.name}
                  height="100%"
                  objectFit="cover"
                  imageRole="card"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  loading="lazy"
                />
              </ParallaxScrollContainer>

              <div className={s.packageContent}>
                <div className={s.packageHead}>
                  <Heading level="3" tag="h3" className={s.packageName}>
                    {item.name}
                  </Heading>
                  <p className={s.packagePrice}>{item.price}</p>
                </div>

                <Body size="primary" tag="p" className={s.packageMeta}>
                  {item.duration} · {item.photos}
                </Body>

                <ul className={s.packageIncludes}>
                  {item.includes.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>

                <Link href="/contacts" className={s.packageCta}>
                  {typografText("Обсудить съёмку")}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <Body size="primary" tag="p" className={s.note}>
          {note}
        </Body>
      </section>

      <section className={s.faq} aria-labelledby="price-faq">
        <Heading level="2" tag="h2" id="price-faq" className={s.sectionTitle}>
          {faq.title}
        </Heading>
        <div className={s.faqList}>
          {faq.items.map((item) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

PricePage.displayName = "PricePage";

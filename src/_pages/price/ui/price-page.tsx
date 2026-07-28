"use client";

import { PRICE_CONTENT } from "@/shared/stub/price";
import { Image } from "@/shared/ui/image";
import { Link } from "@/shared/ui/link";
import { ParallaxScrollContainer } from "@/shared/ui/parallax-scroll-container";
import { Body } from "@/shared/ui/typography/body";
import { Heading } from "@/shared/ui/typography/heading";
import { ComparisonSection } from "@/widgets/comparison-section";
import { PageHero } from "@/widgets/page-hero";

import s from "./price-page.module.scss";

export const PricePage = () => {
  const { hero, advantages, breakImage, process, packages, note } =
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
                  Обсудить съёмку
                </Link>
              </div>
            </article>
          ))}
        </div>

        <Body size="primary" tag="p" className={s.note}>
          {note}
        </Body>
      </section>
    </main>
  );
};

PricePage.displayName = "PricePage";

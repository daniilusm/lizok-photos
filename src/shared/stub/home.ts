import { imageLink } from "./projects";

export const SOCIAL_LINKS = [
  {
    label: "instagram",
    href: "https://www.instagram.com/lizok.a.ph",
  },
  {
    label: "telegram",
    href: "https://t.me/Mu_lS",
  },
  {
    label: "vkontakte",
    href: "https://vk.ru/lizok.a.phtver",
  },
] as const;

export const HOME_CONTENT = {
  hero: {
    title: "Елизавета Акимова",
    text: "Фотограф. Снимаю людей, места и состояния.",
    image: `${imageLink}/v1785082070/photo_2026-07-26_19.06.32_endalg.webp`,
  },
  comparisonImages: {
    before: `${imageLink}/v1785185506/IMG_9009-2_dps3lw.webp`,
    after: `${imageLink}/v1785185506/IMG_9009_fqlbew.webp`,
  },
  about: {
    title: "Обо мне",
    text: "Привет! Меня зовут Лиза. По образованию я психолог, и, наверное, именно поэтому для меня фотография — это прежде всего про людей и настоящие эмоции. Я не стремлюсь создавать идеально постановочные кадры. Мне гораздо важнее поймать момент, когда человек расслабляется, забывает о камере и остается собой. Именно тогда появляются фотографии, к которым хочется возвращаться спустя годы. Мне близка кинематографичная обработка, естественный свет и спокойные, благородные оттенки. Я люблю создавать фотографии с атмосферой, которые не теряют своей ценности со временем.",
  },
  favoriteImages: [
    `${imageLink}/v1785262924/02_wv4bkn.webp`,
    `${imageLink}/v1785262924/03_cti8f2.webp`,
    `${imageLink}/v1785262924/01_eim26n.webp`,
    `${imageLink}/v1785262925/05_kjjbbh.webp`,
    // `${imageLink}/v1785262927/06_b2xyh2.webp`,
    // `${imageLink}/v1785262926/04_hqwwbx.webp`,
  ],
  contacts: {
    title: "Контакты",
    text: "Напишите, чтобы обсудить съёмку.",
    image: `${imageLink}/v1785088079/IMG_5004_ttahnl.png`,
  },
} as const;

import { imageLink } from "./projects";

export const SOCIAL_LINKS = [
  // {
  //   label: "instagram",
  //   href: "https://www.instagram.com/lizok.a.ph",
  // },
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
  about: {
    title: "Обо мне",
    text: "Привет! Меня зовут Лиза. По образованию я психолог, и, наверное, именно поэтому для меня фотография — это прежде всего про людей и настоящие эмоции. Я не стремлюсь создавать идеально постановочные кадры. Мне гораздо важнее поймать момент, когда человек расслабляется, забывает о камере и остается собой. Именно тогда появляются фотографии, к которым хочется возвращаться спустя годы. Мне близка кинематографичная обработка, естественный свет и спокойные, благородные оттенки. Я люблю создавать фотографии с атмосферой, которые не теряют своей ценности со временем.",
  },
  favoriteImages: [
    `${imageLink}/v1785083034/11_tzbff8.webp`,
    `${imageLink}/v1783330779/11_vedzhl.webp`,
    `${imageLink}/v1785084883/IMG_5646_n4nq6g.jpg`,
    `${imageLink}/v1785083002/16_gopcvv.webp`,
    `${imageLink}/v1785084917/IMG_6117_dqcwuu.jpg`,
    `${imageLink}/v1783330390/09_n2z3sd.webp`,
  ],
  contacts: {
    title: "Контакты",
    text: "Напишите, чтобы обсудить съёмку.",
    image: `${imageLink}/v1785088079/IMG_5004_ttahnl.png`,
  },
} as const;

export const siteURL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://lizok-a-ph.ru",
);
export const siteOrigin = siteURL.origin;

export const APP_INFO = {
  APP_DEFAULT_TITLE: "Lizok Photos — фотограф Елизавета Акимова | Тверь",
  APP_TITLE_TEMPLATE: "%s",
  APP_DESCRIPTION:
    "Елизавета Акимова — фотограф в Твери. Индивидуальные, семейные и репортажные съёмки. Живые кадры и кинематографичная обработка.",
  APP_KEYWORDS:
    "фотограф Тверь, фотограф Тверская область, Елизавета Акимова, Lizok Photos, индивидуальная фотосессия Тверь, семейная фотосессия Тверь",
  APP_DEFAULT_THEME: "#2A2E1F",
  APP_SITE_URL_ORIGIN: siteOrigin,
  APP_BASE_URL: siteURL,
  APP_DOMAIN: siteURL.hostname,
  APP_DEFAULT_OG: "/og-1200x630.jpg",
};

export type AppInfoType = typeof APP_INFO;

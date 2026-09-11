import { imageLink } from "./projects";

export type Review = {
  id: string;
  name: string;
  text: string;
  type: string;
  images: string[];
};

export const REVIEWS: Review[] = [
  {
    id: "alina",
    name: "Алина",
    type: "Индивидуальная фотосессия",
    text: "Было очень спокойно и по-настоящему. Лиза мягко направляет, и на фото я узнаю себя — без напряжения и лишней постановки. К кадрам хочется возвращаться.",
    images: [
      `${imageLink}/v1785082992/05_gqvgzf.webp`,
      `${imageLink}/v1785082994/06_jxs7cu.webp`,
      `${imageLink}/v1785262924/01_eim26n.webp`,
    ],
  },
  {
    id: "sara-yana",
    name: "Сара и Яна",
    type: "Семейная фотосессия",
    text: "С детьми получилось легко: без гонки и стресса. Получили тёплые живые кадры семьи — именно то, что хотели сохранить.",
    images: [`${imageLink}/v1783330777/10_d4yprq.webp`],
  },
  {
    id: "danya",
    name: "Даня",
    type: "Индивидуальная фотосессия",
    text: "Атмосфера на съёмке была спокойной, обработка — кинематографичная. Результат превзошёл ожидания, уже планируем следующую встречу.",
    images: [`${imageLink}/v1785083025/01_kplwcp.webp`],
  },
  {
    id: "kupala",
    name: "Екатерина",
    type: "Мероприятие",
    text: "На празднике Лиза ловила моменты, которые мы сами бы пропустили. Репортаж получился живым и очень «нашим».",
    images: [
      `${imageLink}/v1785084848/IMG_5381_ezysls.jpg`,
      `${imageLink}/v1785084843/IMG_5332_sreumi.jpg`,
      `${imageLink}/v1785262924/03_cti8f2.webp`,
    ],
  },
];

import { typografDeep } from "@/shared/utils/typograf";

export const imageLink = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_PROJECTS_ID}/image/upload`;

export type ProjectImage = {
  url: string;
};

export type Project = {
  slug: string;
  name: string;
  date: string;
  mainImage: string;
  images?: ProjectImage[];
};

export type ProjectType = {
  slug: string;
  name: string;
  mainImage: string;
  projects: Project[];
};

/** Проект вместе с типом — удобно для ссылок и плоских списков */
export type ProjectWithType = Project & {
  type: string;
};

export const getProjectTypeHref = (projectsType: string) =>
  `/portfolio/${projectsType}`;

export const getProjectHref = (projectsType: string, slug: string) =>
  `/portfolio/${projectsType}/${slug}`;

export const getProjectsByType = (projectsType: string): Project[] => {
  return (
    projectTypes.find((item) => item.slug === projectsType)?.projects ?? []
  );
};

export const findProject = (
  projectsType: string,
  slug: string,
): ProjectWithType | undefined => {
  const type = projectTypes.find((item) => item.slug === projectsType);
  const project = type?.projects.find((item) => item.slug === slug);

  if (!type || !project) return undefined;

  return { ...project, type: type.slug };
};

export const getAllProjects = (): ProjectWithType[] => {
  return projectTypes.flatMap((type) =>
    type.projects.map((project) => ({
      ...project,
      type: type.slug,
    })),
  );
};

export const projectTypes: ProjectType[] = typografDeep([
  {
    slug: "individual",
    name: "Индивидуальная",
    mainImage: `${imageLink}/v1789377977/00020_xzzxlc.webp`,
    projects: [
      {
        slug: "danya",
        name: "Даня",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1785083025/01_kplwcp.webp`,
      },
      {
        slug: "alina",
        name: "Алина",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1785082992/05_gqvgzf.webp`,
      },
      {
        slug: "maksim",
        name: "Максим",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1789374189/00001_f7noew.webp`,
      },
      {
        slug: "karina_field",
        name: "Карина",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1789374789/00007_lq3l2h.webp`,
      },
      {
        slug: "karina_city",
        name: "Карина",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1789377718/00000_nxqsll.webp`,
      },
      {
        slug: "katya_lake",
        name: "Катя",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1789377845/00006_bt3xyu.webp`,
      },
      {
        slug: "katya_work",
        name: "Катя",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1789386094/00000_rlywjk.webp`,
      },
      {
        slug: "dasha_sunset",
        name: "Даша",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1789377969/00012_gfppif.webp`,
      },
      {
        slug: "anya",
        name: "Аня",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1789378100/00013_it6hpz.webp`,
      },
    ],
  },
  {
    slug: "family",
    name: "Семейная",
    mainImage: `${imageLink}/v1789374354/00009_efwni4.webp`,
    projects: [
      {
        slug: "shablino",
        name: "Матвей и Даня",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1783330387/03_ffz5qb.webp`,
      },
      {
        slug: "sara_and_yana",
        name: "Сара и Яна",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1783330777/10_d4yprq.webp`,
      },
      {
        slug: "chickens_field",
        name: "",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1789374353/00002_hnua7m.webp`,
      },
    ],
  },
  {
    slug: "love",
    name: "Love",
    mainImage: `${imageLink}/v1789385704/00001_frylyf.webp`,
    projects: [
      {
        slug: "suzanna-fadi",
        name: "Сюзанна и Фади",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1789385712/00003_hciudc.webp`,
      },
    ],
  },
  {
    slug: "pregnant",
    name: "Беременяшки",
    mainImage: `${imageLink}/v1789378300/00013_rwr2fz.webp`,
    projects: [
      {
        slug: "firts",
        name: "Саша и Полина",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1789378296/00010_czc10w.webp`,
      },
      {
        slug: "nastya-lesha",
        name: "Настя и Леша",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1789385894/00002_owfzos.webp`,
      },
    ],
  },
  {
    slug: "events",
    name: "Мероприятия",
    mainImage: `${imageLink}/v1789373894/00031_cl3yej.webp`,
    projects: [
      {
        slug: "ivana_kupala",
        name: "Ивана Купала",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1785084848/IMG_5381_ezysls.jpg`,
      },
      {
        slug: "novofon",
        name: "корпоратив novofon",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1789373894/00031_cl3yej.webp`,
      },
      {
        slug: "kolokol_fest",
        name: "Колокол Фест",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1789374543/00025_fd5lkv.webp`,
      },
    ],
  },
  // {
  //   slug: "with-pets",
  //   name: "Фотосессия с животными",
  //   mainImage: `${imageLink}/v1783330777/10_d4yprq.webp`,
  //   projects: [],
  // },
]);

/** Плоский список всех проектов (для hero, превью и т.п.) */
export const projects = getAllProjects();

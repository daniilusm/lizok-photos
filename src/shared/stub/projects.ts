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
    name: "Индивидуальная фотосессия",
    mainImage: `${imageLink}/v1785082994/06_jxs7cu.webp`,
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
    ],
  },
  {
    slug: "family",
    name: "Семейные фото",
    mainImage: `${imageLink}/v1783330777/10_d4yprq.webp`,
    projects: [
      {
        slug: "shablino",
        name: "Шаблино",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1783330387/03_ffz5qb.webp`,
      },
      {
        slug: "sara_and_yana",
        name: "Сара и Яна",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1783330777/10_d4yprq.webp`,
      },
    ],
  },
  // {
  //   slug: "love",
  //   name: "Love story",
  //   mainImage: `${imageLink}/v1783330777/10_d4yprq.webp`,
  //   projects: [],
  // },
  {
    slug: "events",
    name: "Мероприятия",
    mainImage: `${imageLink}/v1785084848/IMG_5381_ezysls.jpg`,
    projects: [
      {
        slug: "ivana_kupala",
        name: "Ивана Купала",
        date: "01.01.2020",
        mainImage: `${imageLink}/v1785084848/IMG_5381_ezysls.jpg`,
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

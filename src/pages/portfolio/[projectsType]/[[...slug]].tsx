import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";

import { InnerPage } from "@/_pages/inner-page/ui";
import { ProjectsPage } from "@/_pages/projects-page/ui";
import { getInnerProjectImages } from "@/shared/api/cloudinary";
import {
  getProjectSeo,
  getProjectTypeSeo,
  withCmsSeo,
} from "@/shared/seo";
import {
  findProject,
  getProjectsByType,
  type Project,
  type ProjectWithType,
  projectTypes,
} from "@/shared/stub/projects";
import type { Seo } from "@/shared/types/strapi-components/widgets";

type PortfolioTypeRouteProps = {
  mode: "type";
  projectsType: string;
  currentProjects: Project[];
  currentProject: null;
};

type PortfolioProjectRouteProps = {
  mode: "project";
  projectsType: string;
  currentProjects: null;
  currentProject: ProjectWithType;
};

export type PortfolioNestedPageProps =
  | PortfolioTypeRouteProps
  | PortfolioProjectRouteProps;

type PortfolioPageProps = PortfolioNestedPageProps & {
  cms: {
    commonData: { seo: Seo };
    pageSeoData: Seo;
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const typePaths = projectTypes.map((projectType) => ({
    params: {
      projectsType: projectType.slug,
      slug: [] as string[],
    },
  }));

  const projectPaths = projectTypes.flatMap((projectType) =>
    projectType.projects.map((project) => ({
      params: {
        projectsType: projectType.slug,
        slug: [project.slug],
      },
    })),
  );

  return {
    paths: [...typePaths, ...projectPaths],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PortfolioPageProps> = async (
  context,
) => {
  const projectsType = String(context.params?.projectsType ?? "");
  const slugParam = context.params?.slug;
  const slugParts = Array.isArray(slugParam)
    ? slugParam
    : slugParam
      ? [String(slugParam)]
      : [];

  const projectType = projectTypes.find((item) => item.slug === projectsType);

  if (!projectType) {
    return { notFound: true };
  }

  if (slugParts.length === 0) {
    return {
      props: {
        mode: "type",
        projectsType,
        currentProjects: getProjectsByType(projectsType),
        currentProject: null,
        ...withCmsSeo(getProjectTypeSeo(projectType)),
      },
    };
  }

  if (slugParts.length === 1) {
    const slug = slugParts[0];
    const stubProject = findProject(projectsType, slug);

    if (!stubProject) {
      return { notFound: true };
    }

    const cloudinaryImages = await getInnerProjectImages(projectsType, slug);

    const currentProject: ProjectWithType = {
      ...stubProject,
      images: cloudinaryImages.length > 0 ? cloudinaryImages : [],
      mainImage: cloudinaryImages[0]?.url ?? stubProject.mainImage,
    };

    return {
      props: {
        mode: "project",
        projectsType,
        currentProjects: null,
        currentProject,
        ...withCmsSeo(
          getProjectSeo(currentProject, projectsType, projectType.name),
        ),
      },
    };
  }

  return { notFound: true };
};

const Page = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  if (props.mode === "project" && props.currentProject) {
    return <InnerPage project={props.currentProject} />;
  }

  return (
    <ProjectsPage
      projectsType={props.projectsType}
      currentProjects={props.currentProjects ?? []}
    />
  );
};

export default Page;

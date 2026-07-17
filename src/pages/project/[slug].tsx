import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";

import { InnerPage } from "@/_pages/inner-page/ui";
import { type Project, projects } from "@/shared/stub/projects";

type ProjectPageProps = {
  currentProject: Project;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: projects.map((project) => ({
      params: { slug: project.slug },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ProjectPageProps> = async (
  context,
) => {
  const slug = String(context.params?.slug ?? "");
  const currentProject = projects.find((item) => item.slug === slug);

  if (!currentProject) {
    return { notFound: true };
  }

  return {
    props: { currentProject },
  };
};

const Page = ({
  currentProject,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <InnerPage project={currentProject} />;
};

export default Page;

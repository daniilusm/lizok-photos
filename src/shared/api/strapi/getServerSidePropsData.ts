import type { GetServerSidePropsContext } from "next";

/**
 * DEPLOY (static Vercel): не используется — страницы без getServerSideProps.
 * Оставлено для будущего подключения Strapi CMS.
 */
type RequestFunction = (options?: {
  status?: "draft" | "published";
}) => Promise<unknown>;

export const getServerSidePropsData = async <
  T extends Record<string, RequestFunction>,
>(
  additionalRequests?: T,
  options?: { isDraftMode?: boolean },
) => {
  // DEPLOY: Strapi fetch отключён для static export
  console.warn(
    "[getServerSidePropsData] Strapi disabled for static deploy. Returning empty data.",
  );

  return {
    commonData: null,
    ...(additionalRequests &&
      Object.keys(additionalRequests).reduce(
        (acc, key) => {
          acc[key] = null;
          return acc;
        },
        {} as Record<string, unknown>,
      )),
  };
};

export type { GetServerSidePropsContext };

// DEPLOY: Strapi API — не используется при static export.
// Раскомментировать после подключения CMS.

import { strapiClient } from "@shared/api/strapi";

export const getHomePage = async (_options?: {
  status?: "draft" | "published";
}) => {
  if (!strapiClient) {
    return null;
  }

  const homepage = strapiClient.single("home-page");
  const response = await homepage.find();

  return response.data;
};

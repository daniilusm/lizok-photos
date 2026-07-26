import type { ProjectImage } from "@/shared/stub/projects";

type CloudinaryResource = {
  secure_url: string;
  public_id: string;
  folder?: string;
};

type CloudinarySearchResponse = {
  resources: CloudinaryResource[];
  next_cursor?: string;
  total_count?: number;
};

const getCloudinaryAuthHeader = () => {
  const apiKey =
    process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !apiSecret) {
    return null;
  }

  const token = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  return `Basic ${token}`;
};

/**
 * Изображения inner project из Media Library.
 *
 * В UI корень называется Home, но путь папки в API без Home:
 * individual/danya  (не Home/individual/danya)
 *
 * public_id у ассетов без префикса папки (например 16_i0nu0l),
 * поэтому Admin API ?prefix=... ничего не находит — нужен Search API по folder.
 */
export const getInnerProjectImages = async (
  projectsType: string,
  slug: string,
): Promise<ProjectImage[]> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_PROJECTS_ID;
  const authorization = getCloudinaryAuthHeader();

  if (!cloudName || !authorization) {
    console.warn(
      "[cloudinary] Missing NEXT_PUBLIC_CLOUDINARY_PROJECTS_ID, CLOUDINARY_API_KEY (или NEXT_PUBLIC_CLOUDINARY_KEY) или CLOUDINARY_API_SECRET",
    );
    return [];
  }

  const folderPath = `${projectsType}/${slug}`;
  const expression = `folder="${folderPath}"`;
  const resources: CloudinaryResource[] = [];
  let nextCursor: string | undefined;

  do {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
      {
        method: "POST",
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression,
          max_results: 500,
          next_cursor: nextCursor,
          sort_by: [{ public_id: "asc" }],
        }),
      },
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `[cloudinary] Search failed for ${folderPath}: ${response.status} ${body}`,
      );
    }

    const data = (await response.json()) as CloudinarySearchResponse;
    resources.push(...(data.resources ?? []));
    nextCursor = data.next_cursor;
  } while (nextCursor);

  console.info(
    `[cloudinary] ${folderPath}: ${resources.length} image(s)`,
  );

  return resources.map((item) => ({ url: item.secure_url }));
};

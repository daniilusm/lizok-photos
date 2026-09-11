const CLOUDINARY_HOST = "res.cloudinary.com";
const CLOUDINARY_UPLOAD_PREFIX =
  /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video)\/upload\/)(.+)$/i;

/** Роль → базовая ширина и набор для srcSet */
export const CLOUDINARY_IMAGE_ROLES = {
  thumb: { width: 400, widths: [240, 400, 560] },
  card: { width: 800, widths: [400, 800, 1200] },
  preview: { width: 1400, widths: [800, 1200, 1600] },
  hero: { width: 1600, widths: [800, 1200, 1600, 2000] },
  full: { width: 2000, widths: [1200, 1600, 2000, 2400] },
} as const;

export type CloudinaryImageRole = keyof typeof CLOUDINARY_IMAGE_ROLES;

export type OptimizeCloudinaryImageOptions = {
  /** Готовый пресет */
  role?: CloudinaryImageRole;
  /** Явная ширина (приоритетнее role.width) */
  width?: number;
  height?: number;
  /** c_fill | c_limit | c_fit — по умолчанию limit (без кропа) */
  crop?: "fill" | "limit" | "fit";
  quality?: "auto" | number;
  format?: "auto";
};

const isTransformSegment = (segment: string) => {
  if (/^v\d+$/.test(segment)) return false;
  // Cloudinary transforms: w_400, q_auto, c_fill, f_auto, …
  return /(?:^|,)[a-z]+_/i.test(segment);
};

/** Убирает уже вставленные transforms между /upload/ и public_id / vN/ */
export const stripCloudinaryTransforms = (pathAfterUpload: string): string => {
  const parts = pathAfterUpload.split("/");
  let index = 0;

  while (index < parts.length && isTransformSegment(parts[index] ?? "")) {
    index += 1;
  }

  return parts.slice(index).join("/");
};

export const isCloudinaryUrl = (url: string): boolean => {
  try {
    return new URL(url).hostname === CLOUDINARY_HOST;
  } catch {
    return url.includes(CLOUDINARY_HOST);
  }
};

/**
 * Вставляет (или заменяет) Cloudinary transforms после /upload/.
 * Не-Cloudinary URL возвращает без изменений.
 */
export const getCloudinaryImageUrl = (
  url: string,
  transforms: string,
): string => {
  const match = url.match(CLOUDINARY_UPLOAD_PREFIX);
  if (!match) return url;

  const [, prefix, rest = ""] = match;
  const cleanPath = stripCloudinaryTransforms(rest);

  if (!transforms) {
    return `${prefix}${cleanPath}`;
  }

  return `${prefix}${transforms}/${cleanPath}`;
};

const buildTransformString = (
  options: OptimizeCloudinaryImageOptions = {},
): string => {
  const role = options.role ?? "card";
  const roleConfig = CLOUDINARY_IMAGE_ROLES[role];
  const width = options.width ?? roleConfig.width;
  const crop = options.crop ?? (options.height ? "fill" : "limit");
  const quality = options.quality ?? "auto";
  const format = options.format ?? "auto";

  const parts = [`c_${crop}`, `w_${width}`];

  if (options.height) {
    parts.push(`h_${options.height}`);
  }

  parts.push(`q_${quality}`, `f_${format}`);

  return parts.join(",");
};

/** Оптимизированный URL под роль / ширину */
export const optimizeCloudinaryImage = (
  url: string,
  options: OptimizeCloudinaryImageOptions = {},
): string => {
  if (!isCloudinaryUrl(url)) return url;

  return getCloudinaryImageUrl(url, buildTransformString(options));
};

/** srcSet для responsive (static export / unoptimized Next Image) */
export const getCloudinarySrcSet = (
  url: string,
  options: OptimizeCloudinaryImageOptions = {},
): string | undefined => {
  if (!isCloudinaryUrl(url)) return undefined;

  const role = options.role ?? "card";
  const widths = CLOUDINARY_IMAGE_ROLES[role].widths;
  const baseWidth = options.width ?? CLOUDINARY_IMAGE_ROLES[role].width;
  const baseHeight = options.height;

  return widths
    .map((width) => {
      const height = baseHeight
        ? Math.round((baseHeight / baseWidth) * width)
        : undefined;
      const src = optimizeCloudinaryImage(url, {
        ...options,
        role,
        width,
        height,
      });
      return `${src} ${width}w`;
    })
    .join(", ");
};

export const getCloudinaryThumbnailUrl = (url: string, width = 400) =>
  optimizeCloudinaryImage(url, {
    role: "thumb",
    width,
    height: Math.round(width * 0.75),
    crop: "fill",
  });

export const getCloudinaryPreviewUrl = (url: string, width = 1400) =>
  optimizeCloudinaryImage(url, { role: "preview", width, crop: "limit" });

export const getCloudinaryHeroUrl = (url: string, width = 1600) =>
  optimizeCloudinaryImage(url, { role: "hero", width, crop: "limit" });

export const getCloudinaryCardUrl = (url: string, width = 800) =>
  optimizeCloudinaryImage(url, { role: "card", width, crop: "limit" });

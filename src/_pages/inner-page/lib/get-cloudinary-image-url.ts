const CLOUDINARY_UPLOAD_SEGMENT = "/upload/";

export const getCloudinaryImageUrl = (
  url: string,
  transforms: string,
): string => {
  if (!url.includes(CLOUDINARY_UPLOAD_SEGMENT)) {
    return url;
  }

  return url.replace(CLOUDINARY_UPLOAD_SEGMENT, `${CLOUDINARY_UPLOAD_SEGMENT}${transforms}/`);
};

export const getCloudinaryThumbnailUrl = (url: string, width = 360) =>
  getCloudinaryImageUrl(url, `w_${width},h_${Math.round(width * 0.75)},c_fill,q_auto,f_auto`);

export const getCloudinaryPreviewUrl = (url: string, width = 1400) =>
  getCloudinaryImageUrl(url, `w_${width},q_auto,f_auto`);

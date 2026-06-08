import { isServer } from "./vars";

export type StrapiConfigType = {
    strapiUrl: string;
    strapiNetworkUrl: string;
    strapiApiToken: string;
    previewSecret?: string;
};

export const STRAPI_CONFIG: StrapiConfigType = {
    strapiUrl: process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337",
    strapiNetworkUrl:
        (isServer
            ? process.env.NEXT_PUBLIC_NETWORK_STRAPI_URL
            : process.env.NEXT_PUBLIC_STRAPI_URL) || "",
    strapiApiToken: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "",
    previewSecret: process.env.PREVIEW_SECRET,
};

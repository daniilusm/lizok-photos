export type StrapiConfigType = {
	strapiUrl: string;
	strapiNetworkUrl: string;
	strapiApiToken: string;
	previewSecret?: string;
};

export const STRAPI_CONFIG: StrapiConfigType = {
	strapiUrl: "http://localhost:1337",
	strapiNetworkUrl: "",
	strapiApiToken: "",
	previewSecret: "",
};

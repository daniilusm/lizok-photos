import type { NextConfig } from "next";

import path from "node:path";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  sassOptions: {
    includePaths: [
      path.join(__dirname, "src", "shared", "ui"),
      path.join(__dirname, "src", "shared", "styles"),
    ],
    prependData: `@use 'helpers' as *;`,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            prettier: false,
            svgo: true,
            ref: true,
            svgoConfig: {
              plugins: [
                "prefixIds",
                // { name: "convertStyleToAttrs" },
                { name: "removeAttrs", params: { attrs: ["fill"] } },
              ],
            },
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;

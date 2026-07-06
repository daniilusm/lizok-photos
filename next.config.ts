import type { NextConfig } from "next";

import path from "node:path";

/**
 * Static deploy (Vercel / CDN)
 *
 * `output: "export"` — полностью статическая сборка без Node.js runtime.
 * Не работает с:
 * - getServerSideProps (используй getStaticProps или client-only)
 * - API routes (`pages/api/*`)
 * - Strapi preview / draft mode
 * - imgproxy на сервере (нужен отдельный сервис или прямые URL из /public)
 * - ISR / middleware / dynamic routes без getStaticPaths
 */
const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "export",
  trailingSlash: true,
  images: {
    // Обязательно для static export — Next Image Optimization требует сервер
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
    ],
  },
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

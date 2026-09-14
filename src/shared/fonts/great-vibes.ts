import { Great_Vibes } from "next/font/google";

export const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["cyrillic", "latin"],
  display: "swap",
  variable: "--font-great-vibes",
  adjustFontFallback: false,
  preload: true,
});

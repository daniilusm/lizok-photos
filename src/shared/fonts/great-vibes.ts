import { Great_Vibes } from "next/font/google";

export const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"],
  display: "swap",
  variable: "--font-great-vibes",
  adjustFontFallback: false,
});

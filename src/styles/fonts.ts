import { DM_Sans, Inter, JetBrains_Mono } from "next/font/google";

// Using Google Fonts as fallback until Clash Display + Satoshi woff2 are self-hosted
// To upgrade: download from fontshare.com → public/fonts/ → switch to localFont

export const clashDisplay = DM_Sans({
  subsets: ["latin"],
  variable: "--font-clash-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const satoshi = Inter({
  subsets: ["latin"],
  variable: "--font-satoshi",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

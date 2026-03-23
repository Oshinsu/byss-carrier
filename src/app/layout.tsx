import type { Metadata, Viewport } from "next";
import { clashDisplay, satoshi, jetbrainsMono } from "@/styles/fonts";
import { initSentry } from "@/lib/sentry";
import "./globals.css";

initSentry();

export const metadata: Metadata = {
  title: "BYSS GROUP — Premier Studio IA de la Martinique",
  description:
    "BYSS GROUP est le premier studio IA de la Martinique. Nous concevons des solutions d'intelligence artificielle sur mesure pour transformer votre activite et accelerer votre croissance.",
  metadataBase: new URL("https://byssgroup.fr"),
  icons: {
    icon: "/favicon.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "BYSS GROUP — Premier Studio IA de la Martinique",
    description:
      "Studio IA base en Martinique. Solutions d'intelligence artificielle sur mesure pour les entreprises.",
    url: "https://byssgroup.fr",
    siteName: "BYSS GROUP",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BYSS GROUP — Premier Studio IA de la Martinique",
    description:
      "Studio IA base en Martinique. Solutions d'intelligence artificielle sur mesure.",
  },
  other: {
    "theme-color": "#00B4D8",
    "msapplication-TileColor": "#0A0A0F",
  },
};

export const viewport: Viewport = {
  themeColor: "#00B4D8",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`dark ${clashDisplay.variable} ${satoshi.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#0A0A0F] font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}

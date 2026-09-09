import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { authorName, repoUrl, siteUrl } from "@/lib/i18n";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const description =
  "Open hardware: a three-stage water pre-treatment column that turns volcanic regolith and pyrolysis biochar into a gravity-fed filter, built on a bench and measured from photographs.";

export const viewport: Viewport = {
  themeColor: "#0c0b0b",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Regolith Water Loop — open hardware water pre-treatment column",
    template: "%s · Regolith Water Loop",
  },
  description,
  applicationName: "Regolith Water Loop",
  authors: [{ name: authorName, url: siteUrl }],
  creator: authorName,
  publisher: authorName,
  keywords: [
    "water pre-treatment",
    "open hardware",
    "biochar",
    "regolith",
    "filtration column",
    "turbidity measurement",
    "bioremediation",
    "pyrolysis",
    "slow sand filter",
    "appropriate technology",
  ],
  category: "technology",
  alternates: {
    canonical: "/",
    languages: { en: "/", es: "/es/", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Regolith Water Loop",
    title: "Regolith Water Loop",
    description,
    locale: "en",
    alternateLocale: ["es"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Regolith Water Loop",
    description,
    creator: authorName,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: "Regolith Water Loop",
  description,
  url: siteUrl,
  codeRepository: repoUrl,
  programmingLanguage: ["Python", "TypeScript"],
  license: "https://opensource.org/licenses/MIT",
  author: { "@type": "Person", name: authorName, url: siteUrl },
  keywords:
    "water treatment, open hardware, biochar, filtration, turbidity, bioremediation",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

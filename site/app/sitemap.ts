import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/i18n";

export const dynamic = "force-static";

const slugs = ["", "system", "drawings", "materials", "method", "protocol", "results"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      priority: 1,
      changeFrequency: "weekly",
      alternates: { languages: { en: `${siteUrl}/`, es: `${siteUrl}/es/` } },
    },
    { url: `${siteUrl}/es/`, priority: 0.9, changeFrequency: "weekly" },
  ];

  for (const slug of slugs) {
    const en = `${siteUrl}/docs/${slug ? `${slug}/` : ""}`;
    const es = `${siteUrl}/es/docs/${slug ? `${slug}/` : ""}`;
    entries.push({
      url: en,
      priority: 0.8,
      changeFrequency: "weekly",
      alternates: { languages: { en, es } },
    });
    entries.push({ url: es, priority: 0.7, changeFrequency: "weekly" });
  }

  return entries;
}

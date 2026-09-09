export type Locale = "en" | "es";

export const siteUrl = "https://rwl.leonardosalas.dev";
export const repoUrl = "https://github.com/leonardosalasd/regolith-water-loop";
export const authorEmail = "leonardo.salas01@outlook.com";
export const authorName = "Leonardo Salas";

export type NavGroup = {
  title: string;
  items: { slug: string; label: string; note?: string }[];
};

const groups: Record<Locale, NavGroup[]> = {
  en: [
    {
      title: "Overview",
      items: [
        { slug: "", label: "Introduction" },
        { slug: "system", label: "The system" },
      ],
    },
    {
      title: "Reference",
      items: [
        { slug: "drawings", label: "Drawings" },
        { slug: "materials", label: "Materials" },
      ],
    },
    {
      title: "Measuring",
      items: [
        { slug: "method", label: "Method" },
        { slug: "protocol", label: "Run protocol" },
        { slug: "results", label: "Results", note: "pending" },
      ],
    },
  ],
  es: [
    {
      title: "General",
      items: [
        { slug: "", label: "Introducción" },
        { slug: "system", label: "El sistema" },
      ],
    },
    {
      title: "Referencia",
      items: [
        { slug: "drawings", label: "Planos" },
        { slug: "materials", label: "Materiales" },
      ],
    },
    {
      title: "Medición",
      items: [
        { slug: "method", label: "Método" },
        { slug: "protocol", label: "Protocolo" },
        { slug: "results", label: "Resultados", note: "pendiente" },
      ],
    },
  ],
};

export function docsBase(locale: Locale) {
  return locale === "en" ? "/docs" : "/es/docs";
}

export function homeHref(locale: Locale) {
  return locale === "en" ? "/" : "/es/";
}

export function navFor(locale: Locale) {
  const base = docsBase(locale);
  return groups[locale].map((g) => ({
    title: g.title,
    items: g.items.map((i) => ({
      ...i,
      href: i.slug ? `${base}/${i.slug}/` : `${base}/`,
    })),
  }));
}

export const ui: Record<Locale, Record<string, string>> = {
  en: {
    menu: "Menu",
    close: "Close",
    tagline: "Water pre-treatment",
    openFull: "open full size",
    otherLocale: "Español",
    licence: "Code MIT · Docs CC BY 4.0",
    backHome: "Home",
  },
  es: {
    menu: "Menú",
    close: "Cerrar",
    tagline: "Pretratamiento de agua",
    openFull: "ver en grande",
    otherLocale: "English",
    licence: "Código MIT · Docs CC BY 4.0",
    backHome: "Inicio",
  },
};

export function otherLocaleHref(locale: Locale, pathname: string) {
  if (locale === "en") {
    return pathname === "/" ? "/es/" : `/es${pathname}`;
  }
  const stripped = pathname.replace(/^\/es/, "");
  return stripped === "" || stripped === "/" ? "/" : stripped;
}

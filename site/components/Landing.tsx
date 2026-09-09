import type { ReactNode } from "react";
import Link from "next/link";
import { BookMark, GitHubMark, Logo } from "./Logo";
import {
  authorEmail,
  authorName,
  docsBase,
  otherLocaleHref,
  repoUrl,
  type Locale,
} from "@/lib/i18n";

const copy = {
  en: {
    lede: "A three-stage water pre-treatment column: bioremediated regolith, pyrolysis biochar, and a gravity feed. Built on a bench and measured from photographs.",
    docsTitle: "Documentation",
    docsBody: "The system, dimensioned drawings, materials, and the measurement method.",
    repoTitle: "Source code",
    repoBody: "Analysis code, drawings and build documentation. MIT and CC BY 4.0.",
    contact: "Get in touch",
    other: "Español",
    safety:
      "This is a pre-treatment stage. It does not remove bacteria, viruses or parasites, and it does not make water safe to drink.",
  },
  es: {
    lede: "Una columna de pretratamiento de agua en tres etapas: regolito biorremediado, biochar de pirólisis y alimentación por gravedad. Construida en banco y medida con fotografías.",
    docsTitle: "Documentación",
    docsBody: "El sistema, los planos acotados, los materiales y el método de medición.",
    repoTitle: "Código fuente",
    repoBody: "Código de análisis, planos y documentación de armado. MIT y CC BY 4.0.",
    contact: "Contacto",
    other: "English",
    safety:
      "Esto es una etapa de pretratamiento. No elimina bacterias, virus ni parásitos, y no vuelve el agua apta para beber.",
  },
} as const;

function Card({
  href,
  external,
  icon,
  title,
  body,
}: {
  href: string;
  external?: boolean;
  icon: ReactNode;
  title: string;
  body: string;
}) {
  const inner = (
    <>
      <span className="text-accent">{icon}</span>
      <span className="mt-4 block font-display text-lg font-semibold tracking-tight">
        {title}
      </span>
      <span className="mt-1.5 block text-[15px] leading-relaxed text-muted">
        {body}
      </span>
      <span className="mt-auto block pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
        {external ? "open ↗" : "→"}
      </span>
    </>
  );

  const className =
    "group flex flex-col border border-line bg-surface p-7 transition-colors hover:border-accent hover:bg-raised";

  return external ? (
    <a href={href} className={className}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

export function Landing({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col justify-center px-6 py-20 sm:px-8">
      <header>
        <div className="flex items-start justify-between gap-6">
          <Logo className="h-14 w-14 text-accent" />
          <Link
            href={otherLocaleHref(locale, locale === "en" ? "/" : "/es/")}
            className="border border-line px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {t.other}
          </Link>
        </div>
        <h1 className="mt-7 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl">
          Regolith Water Loop
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">{t.lede}</p>
      </header>

      <div className="mt-11 grid gap-px bg-line sm:grid-cols-2">
        <Card
          href={`${docsBase(locale)}/`}
          icon={<BookMark className="h-5 w-5" />}
          title={t.docsTitle}
          body={t.docsBody}
        />
        <Card
          href={repoUrl}
          external
          icon={<GitHubMark className="h-5 w-5" />}
          title={t.repoTitle}
          body={t.repoBody}
        />
      </div>

      <p className="mt-8 border-l-2 border-l-accent bg-accent-wash py-3 pl-5 pr-4 text-[14px] leading-relaxed text-ink/85">
        {t.safety}
      </p>

      <footer className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-7 font-mono text-[12px]">
        <a
          href={`mailto:${authorEmail}`}
          className="text-ink underline-offset-4 hover:text-accent hover:underline"
        >
          {authorName}
        </a>
        <a
          href={`mailto:${authorEmail}`}
          className="text-faint underline-offset-4 hover:text-accent hover:underline"
        >
          {t.contact}
        </a>
      </footer>
    </main>
  );
}

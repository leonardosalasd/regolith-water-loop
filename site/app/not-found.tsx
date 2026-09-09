import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { authorEmail, authorName, repoUrl } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page does not exist.",
  robots: { index: false, follow: true },
};

const links = [
  { href: "/", label: "Home", sub: "Inicio" },
  { href: "/docs/", label: "Documentation", sub: "Documentación" },
];

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col justify-center px-6 py-20 sm:px-8">
      <Logo className="h-12 w-12 text-accent" />

      <p className="mt-8 font-mono text-[64px] leading-none font-medium tracking-tight text-accent tabular-nums sm:text-[88px]">
        404
      </p>

      <h1 className="mt-5 font-display text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl">
        This page does not exist
      </h1>
      <p className="mt-2 font-display text-2xl leading-tight font-semibold tracking-tight text-muted sm:text-3xl">
        Esta página no existe
      </p>

      <p className="mt-6 max-w-lg leading-relaxed text-muted">
        The address may be mistyped, or the page may have been moved while the
        project was reorganised.{" "}
        <span className="text-faint">
          Puede que la dirección esté mal escrita, o que la página se haya movido.
        </span>
      </p>

      <nav className="mt-10 flex flex-col gap-px bg-line sm:flex-row">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex-1 border border-line bg-surface px-6 py-5 transition-colors hover:border-accent hover:bg-raised"
          >
            <span className="block font-display text-base font-semibold">
              {l.label}
            </span>
            <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
              {l.sub}
            </span>
          </Link>
        ))}
      </nav>

      <footer className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-7 font-mono text-[12px]">
        <a
          href={`mailto:${authorEmail}`}
          className="text-ink underline-offset-4 hover:text-accent hover:underline"
        >
          {authorName}
        </a>
        <a
          href={repoUrl}
          className="text-faint underline-offset-4 hover:text-accent hover:underline"
        >
          GitHub
        </a>
      </footer>
    </main>
  );
}

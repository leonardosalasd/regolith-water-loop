"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GitHubMark, Logo } from "./Logo";
import {
  authorEmail,
  authorName,
  homeHref,
  navFor,
  otherLocaleHref,
  repoUrl,
  ui,
  type Locale,
} from "@/lib/i18n";

function NavLinks({
  locale,
  onNavigate,
}: {
  locale: Locale;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const normalise = (p: string) => (p.endsWith("/") ? p : `${p}/`);
  const here = normalise(pathname);

  return (
    <nav className="flex flex-col gap-7">
      {navFor(locale).map((group) => (
        <div key={group.title}>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
            {group.title}
          </p>
          <ul className="mt-3 flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = here === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-baseline gap-2 border-l-2 py-1.5 pl-3 text-[15px] transition-colors ${
                      active
                        ? "border-l-accent text-accent"
                        : "border-l-line-soft text-muted hover:border-l-faint hover:text-ink"
                    }`}
                  >
                    {item.label}
                    {item.note ? (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
                        {item.note}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function LocaleToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  return (
    <Link
      href={otherLocaleHref(locale, pathname)}
      className="block w-fit border border-line px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {ui[locale].otherLocale}
    </Link>
  );
}

function Wordmark({ locale }: { locale: Locale }) {
  return (
    <Link href={homeHref(locale)} className="flex items-center gap-3">
      <Logo className="h-8 w-8 shrink-0 text-accent" />
      <span>
        <span className="block font-display text-[15px] leading-tight font-bold tracking-tight">
          Regolith Water Loop
        </span>
        <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
          {ui[locale].tagline}
        </span>
      </span>
    </Link>
  );
}

function Foot({ locale }: { locale: Locale }) {
  return (
    <div className="flex flex-col gap-3 pt-10">
      <a
        href={repoUrl}
        className="flex w-fit items-center gap-2 font-mono text-[11px] text-muted transition-colors hover:text-accent"
      >
        <GitHubMark className="h-3.5 w-3.5" />
        GitHub
      </a>
      <p className="font-mono text-[10.5px] leading-relaxed text-faint">
        <a
          href={`mailto:${authorEmail}`}
          className="underline-offset-4 hover:text-accent hover:underline"
        >
          {authorName}
        </a>
        <br />
        {ui[locale].licence}
      </p>
    </div>
  );
}

export function Sidebar({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-ground/95 px-5 py-3 backdrop-blur lg:hidden">
        <Wordmark locale={locale} />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted"
        >
          {open ? ui[locale].close : ui[locale].menu}
        </button>
      </div>

      {open ? (
        <div className="border-b border-line bg-surface px-5 py-6 lg:hidden">
          <div className="mb-6">
            <LocaleToggle locale={locale} />
          </div>
          <NavLinks locale={locale} onNavigate={() => setOpen(false)} />
          <Foot locale={locale} />
        </div>
      ) : null}

      <aside className="fixed inset-y-0 left-0 hidden w-[268px] flex-col justify-between overflow-y-auto border-r border-line px-7 py-9 lg:flex">
        <div>
          <Wordmark locale={locale} />
          <div className="mt-6">
            <LocaleToggle locale={locale} />
          </div>
          <div className="mt-9">
            <NavLinks locale={locale} />
          </div>
        </div>
        <Foot locale={locale} />
      </aside>
    </>
  );
}

import type { ReactNode } from "react";
import { authorEmail, authorName, ui, type Locale } from "@/lib/i18n";

export function DocsShell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <div className="lg:pl-[268px]">
      <main className="mx-auto max-w-3xl px-6 py-14 sm:px-10 lg:py-20">
        {children}
        <footer className="mt-24 border-t border-line pt-7 font-mono text-[11px] leading-relaxed text-faint">
          <a
            href={`mailto:${authorEmail}`}
            className="underline-offset-4 hover:text-accent hover:underline"
          >
            {authorName}
          </a>
          {" · "}
          {ui[locale].licence}
        </footer>
      </main>
    </div>
  );
}

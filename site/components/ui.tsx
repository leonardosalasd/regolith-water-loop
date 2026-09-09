import type { ReactNode } from "react";

export function PageHeader({ title, lede }: { title: string; lede?: string }) {
  return (
    <header className="mb-12 border-b border-line pb-8">
      <h1 className="font-display text-4xl leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl">
        {title}
      </h1>
      {lede ? (
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{lede}</p>
      ) : null}
    </header>
  );
}

export function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-14 first:mt-0">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-balance">
        {title}
      </h2>
      <div className="mt-4 space-y-4 leading-[1.75] text-ink/90">{children}</div>
    </section>
  );
}

export function Callout({
  tone = "note",
  title,
  children,
}: {
  tone?: "note" | "warn" | "safety";
  title: string;
  children: ReactNode;
}) {
  const border = tone === "note" ? "border-l-line" : "border-l-accent";
  const label = tone === "note" ? "text-faint" : "text-accent";
  return (
    <div
      className={`my-6 border-l-2 ${border} ${
        tone === "safety" ? "bg-accent-wash" : ""
      } py-3 pl-5 pr-4`}
    >
      <p className={`font-mono text-[11px] uppercase tracking-[0.14em] ${label}`}>
        {title}
      </p>
      <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-ink/90">
        {children}
      </div>
    </div>
  );
}

export function Sheet({
  src,
  alt,
  caption,
  drawing,
  label = "open full size",
}: {
  src: string;
  alt: string;
  caption: string;
  drawing: string;
  label?: string;
}) {
  return (
    <figure className="my-8">
      <div className="overflow-x-auto rounded-sm border border-line bg-white p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="block h-auto w-full min-w-[560px]" />
      </div>
      <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-muted">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
          {drawing}
        </span>
        <span className="flex-1">{caption}</span>
        <a
          href={src}
          className="font-mono text-[11px] text-faint underline-offset-4 hover:text-accent hover:underline"
        >
          {label}
        </a>
      </figcaption>
    </figure>
  );
}

export function Table({
  head,
  rows,
  mono,
}: {
  head: string[];
  rows: ReactNode[][];
  mono?: number[];
}) {
  const isMono = (i: number) => mono?.includes(i);
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-[15px]">
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="border-b border-line pb-2 pr-5 text-left font-display text-[11px] font-semibold uppercase tracking-[0.1em] text-faint"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td
                  key={c}
                  className={`border-b border-line-soft py-2.5 pr-5 align-top ${
                    isMono(c) ? "font-mono tabular-nums whitespace-nowrap text-muted" : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Steps({ items }: { items: { title: string; body: ReactNode }[] }) {
  return (
    <ol className="my-6 space-y-6">
      {items.map((s, i) => (
        <li key={i} className="grid grid-cols-[2rem_1fr] gap-x-4">
          <span className="font-mono text-lg leading-tight text-accent">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="font-display text-base font-semibold">{s.title}</h3>
            <div className="mt-1.5 space-y-2 text-[15px] leading-relaxed text-ink/85">
              {s.body}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Code({ children }: { children: string }) {
  return (
    <pre className="my-6 overflow-x-auto rounded-sm border border-line bg-surface p-4 font-mono text-[13px] leading-relaxed text-ink/85">
      <code>{children}</code>
    </pre>
  );
}

export function Term({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[0.9em] text-accent">{children}</span>;
}

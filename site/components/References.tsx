import type { Locale } from "@/lib/i18n";
import { references } from "@/lib/references";
import { Section } from "./ui";

export function References({ locale }: { locale: Locale }) {
  return (
    <>
      {references.map((group) => (
        <Section key={group.title.en} title={group.title[locale]}>
          <dl className="divide-y divide-line-soft border-y border-line-soft">
            {group.items.map((ref) => (
              <div key={ref.key} className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[9rem_1fr]">
                <dt className="font-mono text-[12px] uppercase tracking-[0.08em] text-accent">
                  {ref.key}
                </dt>
                <dd className="min-w-0 space-y-1.5 text-[15px] leading-relaxed">
                  <p>
                    {ref.citation}{" "}
                    <a
                      href={ref.href}
                      className="font-mono text-[13px] break-all text-muted underline-offset-4 hover:text-accent hover:underline"
                      rel="noopener"
                    >
                      {ref.link}
                    </a>
                  </p>
                  <p className="text-sm text-muted">{ref.use[locale]}</p>
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      ))}
    </>
  );
}

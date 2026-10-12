import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { Simulator } from "@/components/Simulator";

export const metadata: Metadata = {
  title: "Sizing simulator",
  description: "Size the three-stage system for any crew, live: filter cartridges, retort heat, char and why Stage 1 is not an oxygen source.",
  alternates: {
    canonical: "/docs/simulator/",
    languages: { en: "/docs/simulator/", es: "/es/docs/simulator/" },
  },
};

const link = "text-accent underline-offset-4 hover:underline";

export default function Page() {
  return (
    <>
      <PageHeader
        title="Sizing simulator"
        lede="Move the crew, the base and the perchlorate load. Every number is recomputed from the same sourced constants as the rwl package."
      />
      <Simulator locale="en" />
      <p className="text-sm text-muted">
        Derivations and sources are on{" "}
        <Link href="/docs/mars/" className={link}>
          Operating on Mars
        </Link>
        ; the same numbers in a terminal with <span className="font-mono text-accent">rwl size --explain</span>.
      </p>
    </>
  );
}

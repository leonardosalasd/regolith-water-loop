import type { Metadata } from "next";
import Link from "next/link";
import { Callout, PageHeader, Section, Table } from "@/components/ui";

export const metadata: Metadata = {
  title: "Introduction",
  description:
    "Why a Mars habitat cannot solve toxic soil, daily waste and water recycling separately, and how one three-stage column answers all three.",
  alternates: { canonical: "/docs/", languages: { en: "/docs/", es: "/es/docs/" } },
};

export default function Home() {
  return (
    <>
      <PageHeader
        title="A filter made from the soil it has to clean"
        lede="Three problems a Mars habitat cannot solve separately — toxic soil, daily waste, and water that has to be recycled — answered by one machine where each stage feeds the others."
      />

      <Section title="The problem">
        <p>
          Martian regolith contains perchlorate before anyone lands on it. It is
          not contamination the mission caused; it is how the planet is. While
          the soil is like that, nothing can grow in it and nothing can safely be
          built on it.
        </p>
        <p>
          Meanwhile six crew produce greywater, food residue and packaging every
          day, and all of it ends up in that same soil. And water is far too
          valuable to use once, so it has to be recycled — the habitat already
          has a reverse osmosis unit, but used water reaches it heavily loaded.
        </p>
        <Callout tone="warn" title="One system, not three">
          <p>
            These are not three solutions. They are{" "}
            <strong>one system in which each part helps the others</strong>. What
            matters is the coupling between stages, not the stages themselves.
          </p>
        </Callout>
      </Section>

      <Section title="The answer, in one paragraph">
        <p>
          Bacteria in a sealed chamber respire the perchlorate out of the
          regolith and leave inert chloride. An oxygen-free furnace chars the
          crew&apos;s waste into biochar. The cleaned regolith and that biochar are
          layered into a column, and greywater percolates down through it,
          reaching the reverse osmosis unit far cleaner than it left.
        </p>
        <p>
          What ties it together: the furnace runs at 450 °C, and the bacteria
          need to sit at 20–35 °C on a planet averaging −63 °C. The furnace heats
          them. It also feeds them — perchlorate-reducing bacteria need a carbon
          source to respire at all, and that comes from processing the same
          waste. Remove the furnace and the bioreactor freezes and starves.
        </p>
        <p>
          <Link
            href="/docs/system/"
            className="text-accent underline-offset-4 hover:underline"
          >
            Read the full system →
          </Link>
        </p>
      </Section>

      <Section title="What is actually built">
        <p>
          Stage 2, the filtration column, is built on a bench and measured.
          Stages 1 and 3 are supported by published work. Perchlorates are strong
          oxidising salts and are not handled in this project.
        </p>
        <Table
          head={["Stage", "Status", "Evidence"]}
          rows={[
            ["1 · Bioremediation", "Modelled", "Published literature"],
            ["2 · Filtration column", "Built and measured", "Bench data, this site"],
            ["3 · Pyrolysis", "Partially built", "Biochar produced from agricultural residue"],
          ]}
        />
        <p>
          The bench column substitutes Earth materials for the Martian ones.{" "}
          <strong>Volcanic scoria</strong>, a basaltic rock, stands in for
          regolith. The biochar is not a substitute at all — it is real biochar,
          made from fibrous agricultural residue such as sugarcane
          bagasse, coconut husk or rice husk.
        </p>
      </Section>

      <Section title="Why it matters on Earth">
        <p>
          The same column, built from local volcanic rock and agricultural
          residue char, works as decentralised passive pre-treatment for
          household water storage. In many places piped water does not arrive
          clean and households store it before use. That is not an analogy drawn
          after the fact — it is the same hardware.
        </p>
        <Callout tone="safety" title="This is not a drinking water system">
          <p>
            The column is a pre-treatment stage. It reduces turbidity, suspended
            solids and part of the chemical load. It does <strong>not</strong>{" "}
            remove bacteria, viruses or parasites, and it does{" "}
            <strong>not</strong> make water safe to drink. Water leaving this
            column still requires proper disinfection.
          </p>
        </Callout>
      </Section>
    </>
  );
}

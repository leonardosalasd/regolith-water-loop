import type { Metadata } from "next";
import { Callout, PageHeader, Section, Table, Term } from "@/components/ui";

export const metadata: Metadata = { title: "The system" };

export default function SystemPage() {
  return (
    <>
      <PageHeader
        title="The system"
        lede="Three stages and two couplings. The couplings are the point; without them this is three separate inventions rather than one machine."
      />

      <Section id="stage-1" title="Stage 1 — Bioremediation">
        <p>
          Regolith enters a sealed, humid, anaerobic chamber inoculated with
          perchlorate-reducing bacteria. They use perchlorate as terminal
          electron acceptor and leave inert chloride behind:
        </p>
        <p className="font-mono text-sm text-muted">
          ClO₄⁻ → ClO₃⁻ → ClO₂⁻ → Cl⁻ + O₂
        </p>
        <p>
          The route runs through perchlorate reductase and chlorite dismutase.
          The strains are <Term>Azospira suillum</Term> (PS) and{" "}
          <Term>Dechloromonas aromatica</Term> (RCB). Neither is exotic or
          engineered — both occur in ordinary river sediment and soil.
        </p>
        <Callout tone="warn" title="Do not oversell the oxygen">
          <p>
            The O₂ in that equation is an intermediate the same organisms
            consume. Net export to life support is close to zero. The benefit of
            this stage is detoxification, not oxygen production.
          </p>
        </Callout>
      </Section>

      <Section id="stage-2" title="Stage 2 — Filtration column">
        <p>
          Treated regolith and biochar are layered in a column. Greywater is
          applied at the top and percolates down under gravity. The biochar
          adsorbs metals and dissolved organic load; the regolith retains
          suspended solids.
        </p>
        <Table
          head={["Layer", "Depth", "Function"]}
          mono={[1]}
          rows={[
            ["Coarse regolith", "50 mm", "distributes flow, prevents channelling"],
            ["Fine regolith", "200 mm", "retains suspended solids"],
            ["Biochar", "120 mm", "adsorbs metals and dissolved organics"],
            ["Support gravel", "50 mm", "drainage"],
          ]}
        />
        <p>
          The effluent reaches reverse osmosis with reduced load, so the machine
          works less and its membranes last longer. This is the stage built and
          measured on the bench.
        </p>
      </Section>

      <Section id="stage-3" title="Stage 3 — Pyrolysis">
        <p>
          Organic waste and cellulosic packaging are heated to roughly 450 °C
          without oxygen. The material does not burn, it chars: pathogens are
          destroyed, volatile gases driven off, and what remains is biochar —
          porous, with high cation exchange capacity.
        </p>
      </Section>

      <Section id="couplings" title="What makes it one system">
        <p>Stage 3 supplies two things Stage 1 cannot operate without on Mars.</p>
        <Table
          head={["Coupling", "Why it is needed"]}
          rows={[
            [
              "Waste heat",
              "The furnace runs at 450 °C. The bacteria need 20–35 °C and the Martian surface averages −63 °C. Placing the furnace at the bottom lets that heat rise.",
            ],
            [
              "Electron donor",
              "The bacteria need a carbon source to respire perchlorate at all. Volatile fatty acids from processing the same waste supply it.",
            ],
          ]}
        />
        <p>
          Remove Stage 3 and Stage 1 freezes and starves. Remove Stage 1 and the
          regolith stays toxic and cannot serve as filter medium.
        </p>
      </Section>

      <Section id="open-question" title="Open design question">
        <p>With the stages stacked, gravity helps twice and hinders once:</p>
        <ul className="ml-5 list-disc space-y-1.5 marker:text-faint">
          <li>Treated regolith falls from Stage 1 into Stage 2</li>
          <li>Water percolates down through Stage 2</li>
          <li>
            <strong>Biochar has to travel up</strong> from Stage 3 into Stage 2
          </li>
        </ul>
        <p>
          Options under consideration: move the furnace alongside rather than
          below; treat biochar as a periodic manual recharge rather than a
          continuous flow; or invert the stack and accept a conductive heat path
          instead of convection. Unresolved, and documented as unresolved.
        </p>
      </Section>

      <Section id="contamination" title="Contamination control">
        <p>
          Two things in this challenge are invisible and both contaminate.
          Perchlorate is one. Dust is the other: a system that moves regolith
          inside a habitat is itself a source of respirable dust. The design
          limit is <Term>0.1 mg/m³</Term> as a 24-hour time-weighted average,
          stricter than the 0.3 mg/m³ general figure in NASA-STD-3001.
        </p>
        <p>
          Introducing terrestrial bacteria to Mars is a planetary protection
          question under COSPAR. Stage 1 is a fully contained reactor.
        </p>
      </Section>
    </>
  );
}

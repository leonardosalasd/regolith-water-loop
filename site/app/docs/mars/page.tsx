import type { Metadata } from "next";
import Link from "next/link";
import { Callout, Code, PageHeader, Section, Table, Term } from "@/components/ui";

export const metadata: Metadata = {
  title: "Operating on Mars",
  description:
    "What the Martian environment forces on the design, the system sized for six crew, and the NASA-STD-3001 requirements it answers.",
  alternates: {
    canonical: "/docs/mars/",
    languages: { en: "/docs/mars/", es: "/es/docs/mars/" },
  },
};

const link = "text-accent underline-offset-4 hover:underline";

export default function Page() {
  return (
    <>
      <PageHeader
        title="Operating on Mars"
        lede="What the environment forces on the design, the system sized for a crew of six, and the habitat requirements it has to meet."
      />

      <Section title="Conditions and what they decide">
        <Table
          head={["Condition", "Value", "Design consequence"]}
          rows={[
            ["Liquid water", "Not stable at surface pressure and temperature", "Every wet stage runs inside the pressurised habitat"],
            ["Gravity", "3.7 m/s², 0.37 g", "Flow through a bed scales with g at a fixed head: 2.65× the filter area, or a taller head"],
            ["Temperature", "About 20 °C down to −153 °C", "Heated, insulated bioreactor; the reference strain is grown at 37 °C"],
            ["Perchlorate", "0.4–0.6 % at Phoenix; 0.5–1 % in soils generally; also at Gale Crater", "Raw regolith is never filter medium; it passes Stage 1 first"],
            ["Regolith", "Basaltic", "Basaltic volcanic scoria as the bench analogue"],
            ["Dust", "0.1 mg/m³, 24-hour average, below 10 µm", "Regolith handling sealed from cabin air and the water path"],
            ["Water source", "Shallow ground ice", "The habitat mines ice; this system treats water after use"],
            ["Planetary protection", "COSPAR policy", "Stage 1 is closed; nothing living is vented or discharged"],
          ]}
        />
        <p>
          Sources for every row are on the{" "}
          <Link href="/docs/references/" className={link}>
            references
          </Link>{" "}
          page.
        </p>
      </Section>

      <Section title="Sized for six crew">
        <p>Reproducible with the package:</p>
        <Code>{`rwl size --crew 6 --base early`}</Code>
        <Table
          head={["Quantity", "Early base", "Mature base"]}
          mono={[1, 2]}
          rows={[
            ["Hygiene greywater", "33.2 L/day", "61.0 L/day"],
            ["Continuous flow", "1.38 L/h", "2.54 L/h"],
            ["Filter area, Earth g", "0.0035–0.014 m²", "0.0064–0.025 m²"],
            ["Filter area, Mars g", "0.009–0.037 m²", "0.017–0.067 m²"],
            ["Bench-size columns, Mars g", "2–8", "4–15"],
            ["Bed volume, Mars g", "4–15 L", "7–28 L"],
            ["Trash", "8.3 kg/day", "8.3 kg/day"],
            ["Char, upper estimate", "1.0 kg/day", "1.0 kg/day"],
          ]}
        />
        <p>
          Greywater and trash rates come from NASA&apos;s Life Support Baseline
          Values document; filter rates are those of slow sand filtration,
          0.1–0.4 m/h; char assumes food and paper are 47.5 % of trash and slow
          pyrolysis leaves 25 % of it as char.
        </p>
        <p>
          The filter is small. A six-person base needs two to eight columns the
          size of the bench build, in parallel. That argues for modules:
          identical sealed cartridges swapped when spent, instead of one large bed
          dug out by hand.
        </p>
      </Section>

      <Section title="Oxygen is a side product">
        <p>Full reduction, with acetate as electron donor:</p>
        <p className="font-mono text-sm text-muted">
          ClO₄⁻ + CH₃COO⁻ + H⁺ → Cl⁻ + 2 CO₂ + 2 H₂O
        </p>
        <Table
          head={["Per tonne of regolith", "0.4 % perchlorate", "1 % perchlorate"]}
          mono={[1, 2]}
          rows={[
            ["Perchlorate", "4.0 kg", "10.0 kg"],
            ["Acetate, full reduction", "2.4 kg", "5.9 kg"],
            ["O₂ if every molecule were captured", "1.3 kg", "3.2 kg"],
          ]}
        />
        <Callout tone="warn" title="Why the design does not count on it">
          <p>
            The bacteria respire that oxygen themselves. Six crew breathe{" "}
            <Term>5.37 kg</Term> of O₂ a day; even perfect capture would take
            1.7–4.2 tonnes of regolith treated daily. Stage 1 exists to detoxify.
          </p>
        </Callout>
      </Section>

      <Section title="The stages at mission scale">
        <p>
          <strong>Stage 1, bioreactor.</strong> Closed, heated and anaerobic,
          treating regolith in batches with <Term>Azospira suillum</Term> PS and{" "}
          <Term>Dechloromonas aromatica</Term> RCB. The donor is supplied as
          acetate or lactate until a waste-derived donor is shown to work.
          Treated regolith is rinsed of chloride.
        </p>
        <p>
          <strong>Stage 2, filter modules.</strong> Sealed cartridges with the
          RWL-001 layering, in parallel under gravity. Effluent goes to the main
          water processor, never straight to the crew.
        </p>
        <p>
          <strong>Stage 3, pyrolysis.</strong> A closed retort for food and paper.
          Char goes to Stage 2, off-gas is scrubbed, and retort heat warms the
          Stage 1 jacket.
        </p>
        <p>
          Flows are drawn in RWL-003 and placement in RWL-004, on the{" "}
          <Link href="/docs/drawings/" className={link}>
            drawings
          </Link>{" "}
          page.
        </p>
      </Section>

      <Section title="Habitat requirements">
        <p>NASA-STD-3001 Volume 2, Revision E.</p>
        <Table
          head={["Requirement", "Asks for", "Response"]}
          rows={[
            ["V2 6026 Potable Water Quality", "Safe potable water at the point of use", "Not claimed: this is pre-treatment, potability is the main processor's job"],
            ["V2 6046 Water Quality Monitoring", "Monitor water and alert crew", "Photographic turbidity as a low-cost trend check, not a certified sensor"],
            ["V2 6051 Water Contamination Control", "Keep water free of contamination, including dust", "Regolith handling and water path physically separate"],
            ["V2 6052 Particulate Matter", "Total dust < 3 mg/m³, respirable < 1 mg/m³", "Closed regolith transfer; cartridges never opened in the cabin"],
            ["V2 6153 Celestial Dust Monitoring", "Monitor Martian dust and alert crew", "Dust monitor at the handling glovebox"],
            ["V2 6053 Lunar Dust Contamination", "Lunar dust < 0.3 mg/m³", "Lunar only; the stricter 0.1 mg/m³ Martian limit is used"],
            ["V2 6050 Atmosphere Contamination Limit", "Gases below maximum allowable concentrations", "Retort off-gas scrubbed and sent to life support"],
            ["V2 6004 Carbon Dioxide Levels", "ppCO₂ ≤ 3 mmHg, one-hour average", "Bioreactor and retort CO₂ ducted to life support"],
          ]}
        />
      </Section>

      <Section title="Open questions">
        <ul className="ml-5 list-disc space-y-2 marker:text-faint">
          <li>Retort energy, and whether its waste heat really covers the Stage 1 jacket</li>
          <li>Whether the pyrolysis liquid can serve as electron donor</li>
          <li>Chloride left in treated regolith: rinse volume and where the brine goes</li>
          <li>Filtration with real Martian fines at 0.37 g, which is modelled, not measured</li>
        </ul>
      </Section>
    </>
  );
}

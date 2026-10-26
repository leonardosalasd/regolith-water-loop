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
        <p>
          Reproducible with{" "}
          <a href="https://pypi.org/project/rwl/" className={link}>
            rwl
          </a>
          :
        </p>
        <Code>{`pipx install rwl
rwl size --crew 6 --base early --explain`}</Code>
        <p>
          Or move the crew and base live in the{" "}
          <Link href="/docs/simulator/" className={link}>
            sizing simulator
          </Link>
          .
        </p>
        <Table
          head={["Quantity", "Early base", "Mature base"]}
          mono={[1, 2]}
          rows={[
            ["Hygiene greywater", "33.2 L/day", "61.0 L/day"],
            ["Continuous flow", "1.38 L/h", "2.54 L/h"],
            ["Filter area, Earth g", "0.0035–0.014 m²", "0.0064–0.025 m²"],
            ["Filter area, Mars g", "0.009–0.037 m²", "0.017–0.067 m²"],
            ["Bench-size columns, Mars g", "2.5–9.8", "4.5–18.0"],
            ["Bed volume, Mars g", "4–15 L", "7–28 L"],
            ["Trash", "8.3 kg/day", "8.3 kg/day"],
            ["Char, dry basis", "0.82 kg/day", "0.82 kg/day"],
            ["Retort heat", "5.0–7.6 MJ/day", "5.0–7.6 MJ/day"],
          ]}
        />
        <p>
          Greywater and trash rates come from NASA&apos;s Life Support Baseline
          Values document; filter rates are those of slow sand filtration,
          0.1–0.4 m/h; char assumes food and paper are 47.5 % of trash and slow
          pyrolysis leaves 25 % of its dry mass as char.
        </p>
        <p>
          The filter is small. A six-person base needs the area of 2.5 to 9.8
          columns the size of the bench build, so three to ten of them in
          parallel. That argues for modules:
          identical sealed cartridges swapped when spent, instead of one large bed
          dug out by hand.
        </p>
      </Section>

      <Section title="Gravity: area or head">
        <p>
          Flow through a packed bed follows Darcy&apos;s law, and the bed&apos;s
          hydraulic conductivity is proportional to g. At 0.37 g the same column
          passes 37.7 % of its Earth flow. There are two ways back:
        </p>
        <Table
          head={["", "Earth", "Mars, same flow"]}
          mono={[1, 2]}
          rows={[
            ["More area, same head", "1 column", "2.65 columns"],
            ["Same area, more head", "0.20 m of water over the bed", "1.22 m of water over the bed"],
          ]}
        />
        <p>
          With a free-draining outlet the driving gradient is (standing water +
          bed) ÷ bed, so the whole of it has to grow 2.65×, not just the water on
          top. A 1.2 m water column per cartridge is impractical inside a
          habitat; parallel cartridges are not. That is why the design adds area.
          The bench column&apos;s own conductivity, and the same bed at 0.37 g,
          come out of a timed run with{" "}
          <span className="font-mono text-accent">rwl permeability</span>.
        </p>
      </Section>

      <Section title="Retort heat">
        <Table
          head={["Six crew, per day", "Amount", "Basis"]}
          mono={[1]}
          rows={[
            ["Feed, food and paper", "3.96 kg", "47.5 % of 8.34 kg trash"],
            ["Moisture in the feed", "0.69 kg", "Plate waste 70 %, paper 10.2 %, unopened food 0.2 %"],
            ["Pyrolysing the dry feed", "2.6–5.2 MJ", "0.8–1.6 MJ/kg near 500 °C"],
            ["Water to steam at 500 °C", "2.3 MJ", "3.40 MJ/kg from 20 °C at 1 atm"],
            ["Total", "5.0–7.6 MJ", "57–88 W averaged over a day"],
          ]}
        />
        <p>
          Moisture is from BVAD Table 4-28, pyrolysis energy from Daugaard and
          Brown, steam from NIST. The pyrolysis figures are for wood and crop
          residues in a fast reactor, not mixed food waste in a slow retort; they
          set the order of magnitude, not a design value, and wall losses are not
          included. Either way it is tens of watts on average, run as a batch.
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

      <Section title="Chloride">
        <p>
          Every perchlorate reduced leaves one chloride ion behind:{" "}
          <Term>1.43–3.56 kg</Term> per tonne of regolith. Diluting that to the
          250 mg/L taste limit for chloride would take 5.7–14.3 m³ of water per
          tonne. Dilution is not an option on Mars, so the rinse is kept small and
          the brine goes to a brine processor of the kind already demonstrated on
          the ISS for urine brine.
        </p>
      </Section>

      <Section title="What Mars supplies, what Earth supplies">
        <p>
          One bench-size cartridge, taking the RWL-001 media schedule and counting
          every mineral layer as treated regolith:
        </p>
        <Code>{`rwl cartridge --crew 6`}</Code>
        <Table
          head={["Item", "Amount", "Comes from"]}
          mono={[1]}
          rows={[
            ["Treated regolith", "1.46 kg", "Mars, Stage 1"],
            ["Char", "0.14 kg", "Mars, Stage 3; a day of trash makes enough for 6–7 cartridges"],
            ["Acetate to detoxify the regolith", "3.5–8.7 g", "Earth, until a waste-derived donor works"],
            ["Cartridge shell", "1", "Earth, refilled on site"],
            ["Chloride left to rinse", "2.1–5.2 g", "Brine processor"],
          ]}
        />
        <p>
          The acetate is the stoichiometric minimum; bacteria also spend some
          donor on growth. For scale, the ISS water processor relies on
          expendable multifiltration beds that need about 472 kg of resupply a
          year. This design does not replace those beds and does not claim to
          extend their life by any measured amount. Its own media, by mass, is
          made on Mars.
        </p>
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
          RWL-001 layering, filled by an automated station in the dirty zone,
          in parallel under gravity. Effluent goes to the main
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
          <li>Whether the retort&apos;s rejected heat covers the Stage 1 jacket, which depends on a reactor not yet designed</li>
          <li>Whether the pyrolysis liquid can serve as electron donor</li>
          <li>The rinse volume that gets chloride out of the regolith pores, which is not measured</li>
          <li>Filtration with real Martian fines at 0.37 g, which is modelled, not measured</li>
          <li>How regolith and char move between units: sealed containers or a screw conveyor, not designed</li>
          <li>How crew reach the dirty zone for hands-on work without breaking containment</li>
        </ul>
      </Section>
    </>
  );
}

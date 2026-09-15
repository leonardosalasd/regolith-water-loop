import type { Metadata } from "next";
import { PageHeader, Section, Sheet } from "@/components/ui";

export const metadata: Metadata = {
  title: "Drawings",
  description:
    "Dimensioned drawings of the filtration column and photometric rig, and schematics of the system's process flow and habitat integration.",
  alternates: {
    canonical: "/docs/drawings/",
    languages: { en: "/docs/drawings/", es: "/es/docs/drawings/" },
  },
};

export default function DrawingsPage() {
  return (
    <>
      <PageHeader
        title="Drawings"
        lede="Dimensioned drawings for the bench build, then schematics of the full system on Mars. Millimetres throughout, not to scale on screen."
      />

      <Section title="RWL-001 — Filtration column">
        <p>
          Vertical section through the column: four media layers, the water
          charge above them, the screen and valve below. The media schedule gives
          depth, volume and an indicative mass for each layer.
        </p>
        <Sheet
          src="/drawings/column-section.svg"
          alt="Vertical section of the filtration column showing four media layers with dimensions"
          drawing="RWL-001 REV E"
          caption="Fill by depth, not by mass. Layer depths are the specification; masses depend on the bore of the pipe actually used."
        />
      </Section>

      <Section title="RWL-002 — Photometric rig">
        <p>
          Plan view of the photographic setup used to measure turbidity, plus a
          diagram of the frame the camera should produce. Distances matter less
          than the fact that nothing moves once a session starts.
        </p>
        <Sheet
          src="/drawings/photometric-rig.svg"
          alt="Plan view of the photographic rig with camera, sample jar, target card and white reference card"
          drawing="RWL-002 REV A"
          caption="The white card cancels exposure differences between shots. Without it, a cloudier sample and a darker room are indistinguishable."
        />
      </Section>

      <Section title="RWL-003 — System process flow">
        <p>
          All three stages inside the pressurised habitat, with every stream
          between them: regolith, water, char, heat and gas. Rates are for six
          crew at an early base, from the sizing on the Mars page.
        </p>
        <Sheet
          src="/drawings/process-flow.svg"
          alt="Process flow diagram linking the bioreactor, filter modules, pyrolysis retort, main water processor and crew"
          drawing="RWL-003 REV A"
          caption="Grey dashed streams are proposed, not demonstrated. The oxygen from Stage 1 is not drawn as a product because the bacteria respire it."
        />
      </Section>

      <Section title="RWL-004 — Habitat integration">
        <p>
          Where each stage sits in a habitat module. Regolith stays in a dirty
          zone behind a sealed bulkhead, and cartridges cross it already sealed.
        </p>
        <Sheet
          src="/drawings/habitat-integration.svg"
          alt="Plan schematic of a habitat module split into dirty, service, wet and crew zones"
          drawing="RWL-004 REV A"
          caption="The retort and the bioreactor share the bulkhead so the retort's heat reaches the reactor jacket. Zone sizes are not derived."
        />
      </Section>
    </>
  );
}

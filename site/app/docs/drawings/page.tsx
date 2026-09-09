import type { Metadata } from "next";
import { PageHeader, Section, Sheet } from "@/components/ui";

export const metadata: Metadata = { title: "Drawings" };

export default function DrawingsPage() {
  return (
    <>
      <PageHeader
        title="Drawings"
        lede="Dimensioned drawings for the bench build. Millimetres throughout, not to scale on screen."
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
          drawing="RWL-001 REV A"
          caption="Fill by depth, not by mass. If the body is stacked PET bottles rather than a 75 mm tube, the bore changes and the masses in the schedule no longer apply."
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
    </>
  );
}

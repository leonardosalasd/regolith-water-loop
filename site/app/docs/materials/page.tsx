import type { Metadata } from "next";
import { Callout, PageHeader, Section, Table } from "@/components/ui";

export const metadata: Metadata = { title: "Materials" };

export default function MaterialsPage() {
  return (
    <>
      <PageHeader
        title="Materials"
        lede="Everything here was chosen to be buyable in an ordinary Mexican hardware store, aquarium shop or garden centre. No laboratory equipment is required."
      />

      <Section title="Column">
        <Table
          head={["Item", "Quantity", "Where"]}
          mono={[1]}
          rows={[
            ["Transparent acrylic tube, 3 in bore", "700 mm", "acrylic supplier"],
            ["Volcanic scoria (lava rock), raw", "3 kg", "garden centre"],
            ["Granular activated carbon", "500 g", "aquarium shop"],
            ["Aquarium gravel", "1 kg", "aquarium shop"],
            ["Transparent hose, ½ in", "1 m", "hardware store"],
            ["Plastic stopcock, ½ in", "1", "hardware store"],
            ["Plastic insect mesh", "30 × 30 cm", "hardware store"],
            ["Transparent silicone", "1 tube", "hardware store"],
          ]}
        />
        <p>
          Transparency is not cosmetic. The layers have to be visible for the
          column to explain itself in a photograph, which is most of what the
          build is for.
        </p>
      </Section>

      <Section title="Measurement">
        <Table
          head={["Item", "Quantity", "Note"]}
          mono={[1]}
          rows={[
            ["Identical glass jars", "6", "straight-sided, clear, no embossing"],
            ["Syringes, no needle", "3 × 20 ml", "for the dilution series"],
            ["Kitchen measuring jug", "1 L", "replaces a graduated cylinder"],
            ["Blue food colouring", "1", "strong, not pale"],
            ["Neutral liquid soap", "1", "surfactant load"],
            ["White card", "80 × 80 mm", "exposure reference"],
            ["Printed checker target", "100 × 100 mm", "contrast target"],
            ["Constant lamp", "1", "any fixed light source"],
          ]}
        />
        <Callout tone="note" title="Why the jars must be identical">
          <p>
            Every sample is photographed through glass. Different thickness or
            curvature changes what the camera sees, and the series stops
            comparing anything. Six matching jam jars work as well as six bought
            ones.
          </p>
        </Callout>
        <p>
          Blue is not an arbitrary choice. The methylene blue number is the
          standard industrial test for the adsorption capacity of activated
          carbon, so a blue tracer mirrors the real assay — and blue reads as
          dark grey once the photograph is converted, which is what the contrast
          measurement needs. Yellow reads almost white and is nearly invisible to
          the method.
        </p>
      </Section>

      <Section title="Deliberately not required">
        <Table
          head={["Not needed", "Instead"]}
          rows={[
            ["Laboratory sieve stack", "Insect mesh as a single cut, aperture measured and reported"],
            ["Precision balance", "Media placed by depth; volumes recorded rather than masses"],
            ["Geotextile", "Discs cut from the same insect mesh"],
            ["Graduated cylinder", "Kitchen measuring jug"],
            ["Clamps and stand", "A cardboard box with a hole cut in the top"],
            ["Nephelometer", "Photographs and the analysis code"],
          ]}
        />
        <p>
          The box is worth a word. The column passes through a hole in the lid,
          the outlet and collecting jar sit hidden inside, and on camera the
          result reads as a column standing on a plinth rather than a tube
          strapped to a chair.
        </p>
      </Section>

      <Section title="Not handled">
        <Callout tone="safety" title="No perchlorates">
          <p>
            Perchlorate salts are strong oxidisers. They are not used, not
            bought, and not required. Stage 1 is supported by published work;
            what the bench demonstrates is filtration and adsorption, measured
            with synthetic greywater mixed to a written recipe.
          </p>
        </Callout>
      </Section>
    </>
  );
}

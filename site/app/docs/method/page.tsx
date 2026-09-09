import type { Metadata } from "next";
import { Callout, Code, PageHeader, Section, Term } from "@/components/ui";

export const metadata: Metadata = { title: "Method" };

export default function MethodPage() {
  return (
    <>
      <PageHeader
        title="Turbidity from photographs"
        lede="A phone camera is available and free; a nephelometer is not. Suspended solids wash out a printed target seen through the sample, and that loss of contrast is the measurement."
      />

      <Section title="Principle">
        <p>
          A vessel of water sits in front of a printed high-contrast target. As
          turbidity rises, the target seen through the sample loses contrast.
          Contrast falls roughly exponentially with concentration, so the
          calibration is fitted linearly in log-contrast.
        </p>
        <p>
          A white card in the same frame cancels exposure and white balance
          differences between shots. Without it a cloudier photograph and a
          darker room look identical to the code.
        </p>
        <Callout tone="warn" title="Relative, not NTU">
          <p>
            Every result is a percentage of the influent. Calibrating to a real
            turbidity standard needs formazin, which this project does not have,
            so the output is never reported in NTU. For a pre-treatment stage the
            percentage removed is the number that matters anyway.
          </p>
        </Callout>
      </Section>

      <Section title="Workflow">
        <p>
          Three commands. The first reads contrast off each photograph, the
          second fits the dilution series, the third compares influent to
          effluent.
        </p>
        <Code>{`rwl measure photos/*.jpg --setup setup.json --out readings.csv
rwl calibrate --readings readings.csv --levels levels.csv --out calibration.json
rwl report --readings readings.csv --calibration calibration.json \\
    --before influent --after effluent`}</Code>
        <p>
          <Term>setup.json</Term> holds the two regions of interest, read once off
          any frame in the session and reused for all of it:
        </p>
        <Code>{`{
  "target": [820, 540, 300, 300],
  "white":  [180, 160, 120, 120]
}`}</Code>
        <p>
          Both are <Term>[x, y, width, height]</Term> in pixels. The calibration
          prints an R²; below 0.9 the light drifted during the series and the
          photographs have to be retaken.
        </p>
      </Section>

      <Section title="Limitations">
        <ul className="ml-5 list-disc space-y-2 marker:text-faint">
          <li>
            Relative to the stock, not traceable to a turbidity standard.
          </li>
          <li>
            Only suspended load is measured. Dissolved contaminants that do not
            scatter light are invisible to this method.
          </li>
          <li>
            Saturated highlights break the contrast estimate. Underexpose
            slightly rather than clipping the white card.
          </li>
          <li>
            Valid only within the calibrated range. An effluent clearer than the
            lowest calibration point should be reported as such, not
            extrapolated.
          </li>
        </ul>
      </Section>
    </>
  );
}

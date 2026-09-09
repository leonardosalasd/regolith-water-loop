import type { Metadata } from "next";
import { Callout, PageHeader, Section, Steps, Table } from "@/components/ui";

export const metadata: Metadata = { title: "Run protocol" };

export default function ProtocolPage() {
  return (
    <>
      <PageHeader
        title="Run protocol"
        lede="One session, start to finish. Split it across two days and the light changes, which invalidates the calibration."
      />

      <Section title="Synthetic greywater">
        <p>Stock, 5 litres. Enough for a calibration series and three column charges.</p>
        <Table
          head={["Component", "Quantity", "Purpose"]}
          mono={[1]}
          rows={[
            ["Tap water", "5 L", "—"],
            ["Fine soil, sieved", "15 g", "suspended solids"],
            ["Neutral liquid soap", "5 ml", "surfactant load"],
            ["Blue food colouring", "20 drops", "adsorption tracer"],
          ]}
        />
        <p>
          Stir again immediately before drawing every sample. Solids settle in
          minutes, and settled stock reads as clean water.
        </p>
        <Callout tone="warn" title="Check this before going further">
          <p>
            With the jar full of undiluted stock, the target card behind it must
            still be <strong>faintly visible</strong>. If it disappears
            completely the contrast measurement saturates and the calibration is
            worthless. Too opaque, add water; too clear, add soil 5 g at a time.
          </p>
        </Callout>
      </Section>

      <Section title="Grading the scoria">
        <p>
          Laboratory sieves give the cleanest result but are not required.
          Whatever the method, report it plainly and give numbers actually
          measured rather than a nominal mesh size.
        </p>
        <Table
          head={["Method", "What to report"]}
          rows={[
            ["Laboratory sieves", "D10 and uniformity coefficient"],
            ["Kitchen or insect mesh", "Aperture measured by counting wires per centimetre"],
            ["Sedimentation", "Settling times and mass recovered per fraction"],
          ]}
        />
        <p>
          Sedimentation needs no equipment at all: crush the scoria, shake it
          in a tall bottle of water and let it settle. Coarse grains reach the
          bottom first and fines last, so decanting at timed intervals separates
          the fractions. It is settling-velocity separation, the same principle
          as the hydrometer analysis used in soil mechanics.
        </p>
      </Section>

      <Section title="Calibration series">
        <p>Five levels, 200 ml each.</p>
        <Table
          head={["Sample", "Stock", "Clean water"]}
          mono={[0, 1, 2]}
          rows={[
            ["cal0", "0 ml", "200 ml"],
            ["cal1", "50 ml", "150 ml"],
            ["cal2", "100 ml", "100 ml"],
            ["cal3", "150 ml", "50 ml"],
            ["cal4", "200 ml", "0 ml"],
          ]}
        />
        <p>
          Photograph each in the same jar, washing and drying it between levels.
        </p>
      </Section>

      <Section title="The run">
        <Steps
          items={[
            {
              title: "Photograph the influent",
              body: <p>Stir the stock, fill the jar, shoot it as <code className="font-mono text-accent">influent</code>.</p>,
            },
            {
              title: "Charge the column",
              body: <p>Close the valve and pour 884 ml of stock in at the top.</p>,
            },
            {
              title: "Open the valve and start the timer",
              body: <p>Collect the effluent in the measuring jug.</p>,
            },
            {
              title: "Record the flow rate",
              body: <p>Time how long 500 ml takes to pass.</p>,
            },
            {
              title: "Photograph the effluent",
              body: <p>Same jar, same fill level, same position.</p>,
            },
            {
              title: "Repeat, at least three charges",
              body: (
                <p>
                  The first charge reads best and removal drops as the bed loads.
                  That curve is the useful result, not the single first number.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section title="What to write down at the time">
        <ul className="ml-5 list-disc space-y-2 marker:text-faint">
          <li>Depth and volume of each medium as placed, and the graded yield from the raw scoria</li>
          <li>The grading method and its measured aperture or settling times</li>
          <li>The greywater recipe actually used, not the one planned</li>
          <li>Flow rate and removal percentage per charge</li>
          <li>Room temperature</li>
        </ul>
        <p>
          Photograph the build at every stage, including the versions that did
          not work, the graded fractions side by side, the five calibration jars
          as a gradient, and influent next to effluent.
        </p>
      </Section>
    </>
  );
}

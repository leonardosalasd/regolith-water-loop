import type { Metadata } from "next";
import { Callout, PageHeader, Photo, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Results",
  description:
    "First runs of the filtration column, judged by eye: suspended solids held back, dissolved dye passed through.",
  alternates: {
    canonical: "/docs/results/",
    languages: { en: "/docs/results/", es: "/es/docs/results/" },
  },
};

export default function ResultsPage() {
  return (
    <>
      <PageHeader
        title="Results"
        lede="First runs, judged by eye. The photometric method was not used for them, so there is no removal percentage."
      />

      <Section title="Run 1 — dyed water">
        <p>
          Water strongly dyed with blue food colouring was poured through the
          loaded column. The blue came through. The bed was then rinsed with
          clean water until the effluent ran almost clear.
        </p>
      </Section>

      <Section title="Run 2 — muddy water">
        <p>
          Three jars of muddy water were poured into the column after the
          standing water had drained. Effluent started 5–10 seconds after
          pouring. It came out without the brown suspended solids, but tinted
          blue. A second jarful came out the same.
        </p>
        <Photo
          src="/build/10-run-2.webp"
          alt="Three jars of cloudy brown water beside one jar of clear, blue-tinted effluent"
          width={1600}
          height={578}
          caption="Left, the three jars poured in. Right, the effluent."
        />
      </Section>

      <Section title="What the runs show">
        <ul className="ml-5 list-disc space-y-2 marker:text-faint">
          <li>
            <strong>Suspended solids are held back.</strong> Cloudy brown water
            in, clear water out.
          </li>
          <li>
            <strong>Dissolved colour is not.</strong> Food colouring is dissolved,
            not suspended, so a sand bed cannot strain it out. The charcoal is
            lump charcoal, not activated carbon, and the water spends little time
            in contact with it.
          </li>
          <li>
            <strong>The blue in Run 2 most likely came from Run 1.</strong> Dye
            held in the bed washed out with the new water. This was not tested.
          </li>
        </ul>
      </Section>

      <Section title="Not done">
        <ul className="ml-5 list-disc space-y-2 marker:text-faint">
          <li>Photometric measurement with the target sheet and a calibration series</li>
          <li>Three charges with a measured flow rate</li>
          <li>Greywater mixed to the written recipe</li>
        </ul>
      </Section>

      <Section title="Next">
        <ul className="ml-5 list-disc space-y-2 marker:text-faint">
          <li>Rinse the bed until the effluent is colourless before any new run</li>
          <li>Throttle the valve to slow the flow and lengthen contact time</li>
          <li>Measure influent and effluent with the photometric method</li>
        </ul>
        <Callout tone="note" title="On honesty">
          <p>
            Removal is reported relative to the influent, never in NTU. A number
            that cannot be defended is worse than a number that was never
            claimed.
          </p>
        </Callout>
      </Section>
    </>
  );
}

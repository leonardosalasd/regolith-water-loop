import type { Metadata } from "next";
import { Callout, PageHeader, Section } from "@/components/ui";

export const metadata: Metadata = { title: "Results" };

export default function ResultsPage() {
  return (
    <>
      <PageHeader
        title="Results"
        lede="Nothing here yet. This page fills in once the column is built and the first runs are measured."
      />

      <Section title="What will land here">
        <ul className="ml-5 list-disc space-y-2 marker:text-faint">
          <li>The graded fractions recovered from the raw scoria, and the method used to grade them</li>
          <li>The calibration curve and its R², with the dilution photographs</li>
          <li>Turbidity removal per charge, across at least three charges</li>
          <li>Flow rate, and how it changes as the bed loads</li>
        </ul>
        <Callout tone="note" title="On honesty">
          <p>
            Removal is reported relative to the influent, not in NTU. Calibrating
            to a turbidity standard needs formazin, which this project does not
            have. A number that cannot be defended is worse than a number that
            was never claimed.
          </p>
        </Callout>
      </Section>
    </>
  );
}

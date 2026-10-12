import type { Metadata } from "next";
import Link from "next/link";
import { Callout, PageHeader } from "@/components/ui";
import { Measure } from "@/components/Measure";

export const metadata: Metadata = {
  title: "Measure in the browser",
  description: "The photographic turbidity method without installing anything: photographs or a live camera, a dilution fit and the removal per charge.",
  alternates: {
    canonical: "/docs/measure/",
    languages: { en: "/docs/measure/", es: "/es/docs/measure/" },
  },
};

const link = "text-accent underline-offset-4 hover:underline";

export default function Page() {
  return (
    <>
      <PageHeader
        title="Measure in the browser"
        lede="The same contrast measurement, fit and report as the rwl package, running on this page. Files it downloads work with the command line and the other way round."
      />
      <Callout title="Before shooting">
        <p>
          Set up the rig as in{" "}
          <Link href="/docs/method/" className={link}>
            Method
          </Link>{" "}
          and the{" "}
          <Link href="/docs/protocol/" className={link}>
            run protocol
          </Link>
          : fixed camera, one constant light, the printed target behind the jar
          and the white card in frame. Results are relative to the influent,
          never NTU.
        </p>
      </Callout>
      <Measure locale="en" />
    </>
  );
}

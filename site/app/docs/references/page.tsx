import type { Metadata } from "next";
import { References } from "@/components/References";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "References",
  description:
    "Every source behind the Mars figures and design decisions, each checked against the claim it supports.",
  alternates: {
    canonical: "/docs/references/",
    languages: { en: "/docs/references/", es: "/es/docs/references/" },
  },
};

export default function Page() {
  return (
    <>
      <PageHeader
        title="References"
        lede="Every source below was opened and checked against the claim it supports. Figures taken from a table cite the table."
      />
      <References locale="en" />
    </>
  );
}

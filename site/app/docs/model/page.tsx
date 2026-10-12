import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { Model3D } from "@/components/Model3D";

export const metadata: Metadata = {
  title: "3D model",
  description: "The habitat layout of RWL-004 and the filtration column of RWL-001 in 3D, with every flow between the three stages.",
  alternates: {
    canonical: "/docs/model/",
    languages: { en: "/docs/model/", es: "/es/docs/model/" },
  },
};

const link = "text-accent underline-offset-4 hover:underline";

export default function Page() {
  return (
    <>
      <PageHeader
        title="3D model"
        lede="The drawings, in three dimensions: where each stage sits inside the habitat and what moves between them, and the bench column layer by layer."
      />
      <Model3D locale="en" />
      <p className="text-sm text-muted">
        Source drawings and their notes are on{" "}
        <Link href="/docs/drawings/" className={link}>
          Drawings
        </Link>
        .
      </p>
    </>
  );
}

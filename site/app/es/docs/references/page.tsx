import type { Metadata } from "next";
import { References } from "@/components/References";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Referencias",
  description:
    "Todas las fuentes detrás de las cifras de Marte y las decisiones de diseño, cada una revisada contra lo que respalda.",
  alternates: {
    canonical: "/es/docs/references/",
    languages: { en: "/docs/references/", es: "/es/docs/references/" },
  },
};

export default function Page() {
  return (
    <>
      <PageHeader
        title="Referencias"
        lede="Cada fuente se abrió y se revisó contra la afirmación que respalda. Las cifras tomadas de una tabla citan la tabla. Las citas se dejan en su idioma original."
      />
      <References locale="es" />
    </>
  );
}

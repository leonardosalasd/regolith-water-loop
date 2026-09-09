import type { Metadata } from "next";
import { Callout, PageHeader, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Resultados",
  description:
    "Mediciones de remoción de turbidez de la columna. Pendiente hasta que se construya y se corra la primera sesión.",
  alternates: {
    canonical: "/es/docs/results/",
    languages: { en: "/docs/results/", es: "/es/docs/results/" },
  },
};

export default function Page() {
  return (
    <>
      <PageHeader
        title="Resultados"
        lede="Todavía no hay nada aquí. Esta página se llena cuando la columna esté armada y se midan las primeras corridas."
      />

      <Section title="Qué va a aterrizar aquí">
        <ul className="ml-5 list-disc space-y-2 marker:text-faint">
          <li>Las fracciones recuperadas de la escoria en bruto y el método usado para clasificarlas</li>
          <li>La curva de calibración y su R², con las fotografías de las diluciones</li>
          <li>Remoción de turbidez por carga, en al menos tres cargas</li>
          <li>Caudal, y cómo cambia conforme el lecho se satura</li>
        </ul>
        <Callout tone="note" title="Sobre la honestidad">
          <p>
            La remoción se reporta relativa al influente, no en NTU. Calibrar
            contra un patrón de turbidez requiere formazina, que este proyecto no
            tiene. Un número que no se puede defender es peor que un número que
            nunca se afirmó.
          </p>
        </Callout>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { Simulator } from "@/components/Simulator";

export const metadata: Metadata = {
  title: "Simulador de dimensionado",
  description: "Dimensiona el sistema de tres etapas para cualquier tripulación, en vivo: cartuchos de filtro, calor de la retorta, carbón y por qué la etapa 1 no es fuente de oxígeno.",
  alternates: {
    canonical: "/es/docs/simulator/",
    languages: { en: "/docs/simulator/", es: "/es/docs/simulator/" },
  },
};

const link = "text-accent underline-offset-4 hover:underline";

export default function Page() {
  return (
    <>
      <PageHeader
        title="Simulador de dimensionado"
        lede="Mueve la tripulación, la base y la carga de perclorato. Cada número se recalcula con las mismas constantes con fuente que el paquete rwl."
      />
      <Simulator locale="es" />
      <p className="text-sm text-muted">
        Las derivaciones y fuentes están en{" "}
        <Link href="/es/docs/mars/" className={link}>
          Operación en Marte
        </Link>
        ; los mismos números en terminal con <span className="font-mono text-accent">rwl size --explain</span>.
      </p>
    </>
  );
}

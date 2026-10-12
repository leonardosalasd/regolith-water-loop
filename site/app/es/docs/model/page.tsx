import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { Model3D } from "@/components/Model3D";

export const metadata: Metadata = {
  title: "Modelo 3D",
  description: "La distribución del hábitat de RWL-004 y la columna de filtración de RWL-001 en 3D, con cada flujo entre las tres etapas.",
  alternates: {
    canonical: "/es/docs/model/",
    languages: { en: "/docs/model/", es: "/es/docs/model/" },
  },
};

const link = "text-accent underline-offset-4 hover:underline";

export default function Page() {
  return (
    <>
      <PageHeader
        title="Modelo 3D"
        lede="Los planos en tres dimensiones: dónde va cada etapa dentro del hábitat y qué se mueve entre ellas, y la columna de banco capa por capa."
      />
      <Model3D locale="es" />
      <p className="text-sm text-muted">
        Los planos originales y sus notas están en{" "}
        <Link href="/es/docs/drawings/" className={link}>
          Planos
        </Link>
        .
      </p>
    </>
  );
}

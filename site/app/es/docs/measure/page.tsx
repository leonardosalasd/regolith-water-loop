import type { Metadata } from "next";
import Link from "next/link";
import { Callout, PageHeader } from "@/components/ui";
import { Measure } from "@/components/Measure";

export const metadata: Metadata = {
  title: "Medir en el navegador",
  description: "El método fotográfico de turbidez sin instalar nada: fotos o cámara en vivo, el ajuste de diluciones y lo removido por carga.",
  alternates: {
    canonical: "/es/docs/measure/",
    languages: { en: "/docs/measure/", es: "/es/docs/measure/" },
  },
};

const link = "text-accent underline-offset-4 hover:underline";

export default function Page() {
  return (
    <>
      <PageHeader
        title="Medir en el navegador"
        lede="La misma medición de contraste, ajuste y reporte que el paquete rwl, corriendo en esta página. Lo que descarga funciona con la línea de comandos y al revés."
      />
      <Callout title="Antes de tomar fotos">
        <p>
          Arma el montaje como en{" "}
          <Link href="/es/docs/method/" className={link}>
            Método
          </Link>{" "}
          y el{" "}
          <Link href="/es/docs/protocol/" className={link}>
            protocolo
          </Link>
          : cámara fija, una sola luz constante, el objetivo impreso detrás del
          frasco y la tarjeta blanca en cuadro. Los resultados son relativos al
          influente, nunca NTU.
        </p>
      </Callout>
      <Measure locale="es" />
    </>
  );
}

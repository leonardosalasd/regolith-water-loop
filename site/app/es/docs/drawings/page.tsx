import type { Metadata } from "next";
import { PageHeader, Section, Sheet } from "@/components/ui";

export const metadata: Metadata = {
  title: "Planos",
  description:
    "Planos acotados de la columna de filtración y del montaje fotométrico para medir turbidez.",
  alternates: {
    canonical: "/es/docs/drawings/",
    languages: { en: "/docs/drawings/", es: "/es/docs/drawings/" },
  },
};

export default function Page() {
  return (
    <>
      <PageHeader
        title="Planos"
        lede="Planos acotados para el armado en banco. Milímetros en todo, sin escala en pantalla."
      />

      <Section title="RWL-001 — Columna de filtración">
        <p>
          Corte vertical de la columna: cuatro capas de medio filtrante, la carga
          de agua encima, la malla y la válvula abajo. El cuadro de materiales da
          espesor, volumen y una masa indicativa por capa.
        </p>
        <Sheet
          src="/drawings/column-section.svg"
          alt="Corte vertical de la columna de filtración con cuatro capas y cotas"
          drawing="RWL-001 REV A"
          label="ver en grande"
          caption="Llena por espesor, no por masa. Si el cuerpo son botellas PET apiladas en vez de un tubo de 75 mm, el diámetro cambia y las masas del cuadro dejan de aplicar."
        />
      </Section>

      <Section title="RWL-002 — Montaje fotométrico">
        <p>
          Vista en planta del montaje fotográfico para medir turbidez, más un
          diagrama del encuadre que debe producir la cámara. Las distancias
          importan menos que el hecho de que nada se mueva una vez empezada la
          sesión.
        </p>
        <Sheet
          src="/drawings/photometric-rig.svg"
          alt="Vista en planta del montaje con cámara, frasco de muestra, tarjeta patrón y tarjeta blanca"
          drawing="RWL-002 REV A"
          label="ver en grande"
          caption="La tarjeta blanca cancela las diferencias de exposición entre tomas. Sin ella, una muestra más turbia y un cuarto más oscuro son indistinguibles."
        />
      </Section>
    </>
  );
}

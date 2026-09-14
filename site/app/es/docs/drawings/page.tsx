import type { Metadata } from "next";
import { PageHeader, Section, Sheet } from "@/components/ui";

export const metadata: Metadata = {
  title: "Planos",
  description:
    "Planos acotados de la columna de filtración y del montaje fotométrico, y esquemas del flujo de proceso y de la integración en el hábitat.",
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
        lede="Planos acotados para el armado en banco y después esquemas del sistema completo en Marte. Milímetros en todo, sin escala en pantalla."
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
          drawing="RWL-001 REV D"
          label="ver en grande"
          caption="Llena por espesor, no por masa. Los espesores son la especificación; las masas dependen del diámetro del tubo que realmente se use."
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

      <Section title="RWL-003 — Flujo de proceso del sistema">
        <p>
          Las tres etapas dentro del hábitat presurizado, con todas las
          corrientes entre ellas: regolito, agua, carbón, calor y gases. Las
          tasas son para seis tripulantes en una base temprana, del dimensionado
          de la página de Marte.
        </p>
        <Sheet
          src="/drawings/process-flow.svg"
          alt="Diagrama de flujo que une el biorreactor, los módulos de filtro, la retorta de pirólisis, el procesador principal de agua y la tripulación"
          drawing="RWL-003 REV A"
          label="ver en grande"
          caption="Las corrientes grises punteadas son propuestas, no demostradas. El oxígeno de la etapa 1 no se dibuja como producto porque las bacterias lo respiran."
        />
      </Section>

      <Section title="RWL-004 — Integración en el hábitat">
        <p>
          Dónde va cada etapa en un módulo del hábitat. El regolito se queda en
          una zona sucia detrás de un mamparo sellado, y los cartuchos lo cruzan
          ya sellados.
        </p>
        <Sheet
          src="/drawings/habitat-integration.svg"
          alt="Esquema en planta de un módulo del hábitat dividido en zona sucia, de servicio, húmeda y de tripulación"
          drawing="RWL-004 REV A"
          label="ver en grande"
          caption="La retorta y el biorreactor comparten el mamparo para que el calor de la retorta llegue a la chaqueta del reactor. Los tamaños de zona no están calculados."
        />
      </Section>
    </>
  );
}

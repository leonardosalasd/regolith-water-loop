import type { Metadata } from "next";
import { Callout, Code, PageHeader, Section, Term } from "@/components/ui";

export const metadata: Metadata = {
  title: "Método",
  description:
    "Cómo se mide la turbidez a partir de fotografías: pérdida de contraste de un patrón impreso visto a través de la muestra, normalizada con una tarjeta blanca.",
  alternates: {
    canonical: "/es/docs/method/",
    languages: { en: "/docs/method/", es: "/es/docs/method/" },
  },
};

export default function Page() {
  return (
    <>
      <PageHeader
        title="Turbidez a partir de fotografías"
        lede="La cámara de un teléfono está disponible y es gratis; un turbidímetro no. Los sólidos en suspensión difuminan un patrón impreso visto a través de la muestra, y esa pérdida de contraste es la medición."
      />

      <Section title="Principio">
        <p>
          Un recipiente con agua se coloca frente a un patrón impreso de alto
          contraste. Conforme sube la turbidez, el patrón visto a través de la
          muestra pierde contraste. El contraste cae de forma aproximadamente
          exponencial con la concentración, así que la calibración se ajusta
          linealmente en logaritmo del contraste.
        </p>
        <p>
          Una tarjeta blanca en el mismo encuadre cancela las diferencias de
          exposición y balance de blancos entre tomas. Sin ella, una fotografía
          más turbia y un cuarto más oscuro se ven idénticos para el código.
        </p>
        <Callout tone="warn" title="Relativo, no NTU">
          <p>
            Todo resultado es un porcentaje del influente. Calibrar contra un
            patrón de turbidez real requiere formazina, que este proyecto no
            tiene, así que la salida nunca se reporta en NTU. Para una etapa de
            pretratamiento, el porcentaje removido es de todos modos el número
            que importa.
          </p>
        </Callout>
      </Section>

      <Section title="Flujo de trabajo">
        <p>
          Tres comandos. El primero lee el contraste de cada fotografía, el
          segundo ajusta la serie de diluciones, el tercero compara influente
          contra efluente.
        </p>
        <Code>{`rwl measure fotos/*.jpg --setup setup.json --out readings.csv
rwl calibrate --readings readings.csv --levels levels.csv --out calibration.json
rwl report --readings readings.csv --calibration calibration.json \\
    --before influent --after effluent`}</Code>
        <p>
          <Term>setup.json</Term> guarda las dos regiones de interés, leídas una
          sola vez de cualquier encuadre de la sesión y reutilizadas para toda
          ella:
        </p>
        <Code>{`{
  "target": [820, 540, 300, 300],
  "white":  [180, 160, 120, 120]
}`}</Code>
        <p>
          Las dos son <Term>[x, y, ancho, alto]</Term> en píxeles. La calibración
          imprime un R²; por debajo de 0.9 la luz se movió durante la serie y hay
          que volver a tomar las fotografías.
        </p>
      </Section>

      <Section title="Limitaciones">
        <ul className="ml-5 list-disc space-y-2 marker:text-faint">
          <li>Relativo al patrón preparado, sin trazabilidad a un estándar de turbidez.</li>
          <li>
            Solo mide carga en suspensión. Los contaminantes disueltos que no
            dispersan luz son invisibles para este método.
          </li>
          <li>
            Los altos saturados rompen la estimación de contraste. Subexpón
            ligeramente en vez de quemar la tarjeta blanca.
          </li>
          <li>
            Válido solo dentro del rango calibrado. Un efluente más limpio que el
            punto de calibración más bajo debe reportarse como tal, no
            extrapolarse.
          </li>
        </ul>
      </Section>
    </>
  );
}

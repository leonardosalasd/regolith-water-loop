import type { Metadata } from "next";
import Link from "next/link";
import { Callout, Code, PageHeader, Section, Table, Term } from "@/components/ui";

export const metadata: Metadata = {
  title: "Operación en Marte",
  description:
    "Lo que el entorno marciano le impone al diseño, el sistema dimensionado para seis tripulantes y los requisitos de NASA-STD-3001 que atiende.",
  alternates: {
    canonical: "/es/docs/mars/",
    languages: { en: "/docs/mars/", es: "/es/docs/mars/" },
  },
};

const link = "text-accent underline-offset-4 hover:underline";

export default function Page() {
  return (
    <>
      <PageHeader
        title="Operación en Marte"
        lede="Lo que el entorno le impone al diseño, el sistema dimensionado para seis tripulantes y los requisitos del hábitat que tiene que cumplir."
      />

      <Section title="Condiciones y lo que deciden">
        <Table
          head={["Condición", "Valor", "Consecuencia de diseño"]}
          rows={[
            ["Agua líquida", "No es estable a la presión y temperatura de superficie", "Toda etapa con agua opera dentro del hábitat presurizado"],
            ["Gravedad", "3.7 m/s², 0.37 g", "El flujo por un lecho escala con g a la misma carga: 2.65× el área de filtro, o más carga hidráulica"],
            ["Temperatura", "De unos 20 °C hasta −153 °C", "Biorreactor calentado y aislado; la cepa de referencia se cultiva a 37 °C"],
            ["Perclorato", "0.4–0.6 % en Phoenix; 0.5–1 % en suelos en general; también en el cráter Gale", "El regolito crudo nunca es medio filtrante; primero pasa por la etapa 1"],
            ["Regolito", "Basáltico", "Escoria volcánica basáltica como análogo en banco"],
            ["Polvo", "0.1 mg/m³, promedio de 24 h, menor a 10 µm", "El manejo de regolito va sellado respecto al aire de cabina y al agua"],
            ["Fuente de agua", "Hielo somero", "El hábitat extrae hielo; este sistema trata el agua ya usada"],
            ["Protección planetaria", "Política de COSPAR", "La etapa 1 es cerrada; nada vivo se ventila ni se descarga"],
          ]}
        />
        <p>
          Las fuentes de cada fila están en la página de{" "}
          <Link href="/es/docs/references/" className={link}>
            referencias
          </Link>
          .
        </p>
      </Section>

      <Section title="Dimensionado para seis tripulantes">
        <p>Se reproduce con el paquete:</p>
        <Code>{`rwl size --crew 6 --base early`}</Code>
        <Table
          head={["Cantidad", "Base temprana", "Base madura"]}
          mono={[1, 2]}
          rows={[
            ["Agua gris de higiene", "33.2 L/día", "61.0 L/día"],
            ["Flujo continuo", "1.38 L/h", "2.54 L/h"],
            ["Área de filtro, g Tierra", "0.0035–0.014 m²", "0.0064–0.025 m²"],
            ["Área de filtro, g Marte", "0.009–0.037 m²", "0.017–0.067 m²"],
            ["Columnas tamaño banco, g Marte", "2–8", "4–15"],
            ["Volumen de lecho, g Marte", "4–15 L", "7–28 L"],
            ["Basura", "8.3 kg/día", "8.3 kg/día"],
            ["Carbón, estimado alto", "1.0 kg/día", "1.0 kg/día"],
          ]}
        />
        <p>
          Las tasas de agua gris y basura vienen del documento de valores base de
          soporte vital de la NASA; las de filtración son las de filtración lenta
          en arena, 0.1–0.4 m/h; el carbón supone que comida y papel son el
          47.5 % de la basura y que la pirólisis lenta deja el 25 % como carbón.
        </p>
        <p>
          El filtro es chico. Una base de seis personas necesita de dos a ocho
          columnas del tamaño de la de banco, en paralelo. Eso apunta a módulos:
          cartuchos sellados iguales que se cambian al gastarse, en vez de un
          lecho grande que hay que sacar a mano.
        </p>
      </Section>

      <Section title="El oxígeno es un subproducto">
        <p>Reducción completa, con acetato como donador de electrones:</p>
        <p className="font-mono text-sm text-muted">
          ClO₄⁻ + CH₃COO⁻ + H⁺ → Cl⁻ + 2 CO₂ + 2 H₂O
        </p>
        <Table
          head={["Por tonelada de regolito", "0.4 % perclorato", "1 % perclorato"]}
          mono={[1, 2]}
          rows={[
            ["Perclorato", "4.0 kg", "10.0 kg"],
            ["Acetato, reducción completa", "2.4 kg", "5.9 kg"],
            ["O₂ si se capturara todo", "1.3 kg", "3.2 kg"],
          ]}
        />
        <Callout tone="warn" title="Por qué el diseño no cuenta con él">
          <p>
            Las bacterias respiran ese oxígeno. Seis tripulantes respiran{" "}
            <Term>5.37 kg</Term> de O₂ al día; aun capturándolo todo habría que
            tratar 1.7–4.2 toneladas de regolito diarias. La etapa 1 existe para
            destoxificar.
          </p>
        </Callout>
      </Section>

      <Section title="Las etapas a escala de misión">
        <p>
          <strong>Etapa 1, biorreactor.</strong> Cerrado, calentado y anaerobio,
          trata el regolito por lotes con <Term>Azospira suillum</Term> PS y{" "}
          <Term>Dechloromonas aromatica</Term> RCB. El donador se suministra como
          acetato o lactato hasta que se demuestre uno sacado de los residuos. El
          regolito tratado se enjuaga para quitarle el cloruro.
        </p>
        <p>
          <strong>Etapa 2, módulos de filtro.</strong> Cartuchos sellados con las
          capas de RWL-001, en paralelo y por gravedad. El efluente va al
          procesador principal de agua, nunca directo a la tripulación.
        </p>
        <p>
          <strong>Etapa 3, pirólisis.</strong> Una retorta cerrada para comida y
          papel. El carbón va a la etapa 2, los gases se lavan y el calor de la
          retorta calienta la chaqueta de la etapa 1.
        </p>
        <p>
          Los flujos están en RWL-003 y la ubicación en RWL-004, en la página de{" "}
          <Link href="/es/docs/drawings/" className={link}>
            planos
          </Link>
          .
        </p>
      </Section>

      <Section title="Requisitos del hábitat">
        <p>NASA-STD-3001 Volumen 2, Revisión E.</p>
        <Table
          head={["Requisito", "Pide", "Respuesta"]}
          rows={[
            ["V2 6026 Calidad de agua potable", "Agua potable segura en el punto de uso", "No se afirma: esto es pretratamiento, la potabilidad le toca al procesador principal"],
            ["V2 6046 Monitoreo de calidad de agua", "Vigilar el agua y alertar a la tripulación", "Turbidez por fotografía como revisión de tendencia barata, no sensor certificado"],
            ["V2 6051 Control de contaminación del agua", "Agua libre de contaminación, incluido el polvo", "Manejo de regolito y ruta del agua físicamente separados"],
            ["V2 6052 Material particulado", "Polvo total < 3 mg/m³, respirable < 1 mg/m³", "Traslado cerrado del regolito; los cartuchos no se abren en la cabina"],
            ["V2 6153 Monitoreo de polvo celeste", "Vigilar el polvo marciano y alertar", "Monitor de polvo en la caja de guantes de manejo"],
            ["V2 6053 Contaminación por polvo lunar", "Polvo lunar < 0.3 mg/m³", "Solo lunar; se usa el límite marciano, más estricto, de 0.1 mg/m³"],
            ["V2 6050 Límite de contaminación atmosférica", "Gases bajo las concentraciones máximas permitidas", "Gases de la retorta lavados y enviados a soporte vital"],
            ["V2 6004 Niveles de dióxido de carbono", "ppCO₂ ≤ 3 mmHg, promedio de una hora", "El CO₂ del biorreactor y la retorta va por ducto a soporte vital"],
          ]}
        />
      </Section>

      <Section title="Preguntas abiertas">
        <ul className="ml-5 list-disc space-y-2 marker:text-faint">
          <li>La energía de la retorta, y si su calor residual de verdad cubre la chaqueta de la etapa 1</li>
          <li>Si el líquido de la pirólisis puede servir como donador de electrones</li>
          <li>El cloruro que queda en el regolito tratado: cuánta agua de enjuague y a dónde va la salmuera</li>
          <li>La filtración con finos marcianos reales a 0.37 g, que está modelada, no medida</li>
        </ul>
      </Section>
    </>
  );
}

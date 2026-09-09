import type { Metadata } from "next";
import { Callout, PageHeader, Section, Table, Term } from "@/components/ui";

export const metadata: Metadata = {
  title: "El sistema",
  description:
    "Las tres etapas del sistema y los dos acoplamientos que las convierten en una sola máquina: calor residual y donador de electrones.",
  alternates: {
    canonical: "/es/docs/system/",
    languages: { en: "/docs/system/", es: "/es/docs/system/" },
  },
};

export default function Page() {
  return (
    <>
      <PageHeader
        title="El sistema"
        lede="Tres etapas y dos acoplamientos. Los acoplamientos son el punto: sin ellos esto son tres inventos separados en vez de una máquina."
      />

      <Section id="etapa-1" title="Etapa 1 — Biorremediación">
        <p>
          El regolito entra a una cámara sellada, húmeda y anaerobia, inoculada
          con bacterias reductoras de perclorato. Usan el perclorato como aceptor
          final de electrones y dejan cloruro inerte:
        </p>
        <p className="font-mono text-sm text-muted">
          ClO₄⁻ → ClO₃⁻ → ClO₂⁻ → Cl⁻ + O₂
        </p>
        <p>
          La ruta pasa por la perclorato reductasa y la clorito dismutasa. Las
          cepas son <Term>Azospira suillum</Term> (PS) y{" "}
          <Term>Dechloromonas aromatica</Term> (RCB). Ninguna es exótica ni
          modificada: las dos se encuentran en sedimento de río y suelo comunes.
        </p>
        <Callout tone="warn" title="No exagerar con el oxígeno">
          <p>
            El O₂ de esa ecuación es un intermediario que los mismos organismos
            consumen. La exportación neta al soporte vital es cercana a cero. El
            beneficio de esta etapa es la destoxificación, no producir oxígeno.
          </p>
        </Callout>
      </Section>

      <Section id="etapa-2" title="Etapa 2 — Columna de filtración">
        <p>
          El regolito tratado y el biochar se acomodan por capas en una columna.
          Las aguas grises se aplican arriba y percolan hacia abajo por gravedad.
          El biochar adsorbe metales y carga orgánica disuelta; el regolito
          retiene los sólidos en suspensión.
        </p>
        <Table
          head={["Capa", "Espesor", "Función"]}
          mono={[1]}
          rows={[
            ["Regolito grueso", "50 mm", "reparte el flujo, evita canalización"],
            ["Regolito fino", "200 mm", "retiene sólidos en suspensión"],
            ["Biochar", "120 mm", "adsorbe metales y orgánicos disueltos"],
            ["Grava de soporte", "50 mm", "drenaje"],
          ]}
        />
        <p>
          El efluente llega a la ósmosis inversa con menos carga, así que la
          máquina trabaja menos y sus membranas duran más. Esta es la etapa que
          se construye y se mide en banco.
        </p>
      </Section>

      <Section id="etapa-3" title="Etapa 3 — Pirólisis">
        <p>
          Los residuos orgánicos y los empaques celulósicos se calientan a unos
          450 °C sin oxígeno. El material no se quema, se carboniza: los
          patógenos se destruyen, los gases volátiles se van, y lo que queda es
          biochar — poroso, con alta capacidad de intercambio catiónico.
        </p>
      </Section>

      <Section id="acoplamientos" title="Qué lo vuelve un solo sistema">
        <p>
          La etapa 3 le da dos cosas a la etapa 1 sin las cuales no puede operar
          en Marte.
        </p>
        <Table
          head={["Acoplamiento", "Por qué hace falta"]}
          rows={[
            [
              "Calor residual",
              "El horno trabaja a 450 °C. Las bacterias necesitan 20–35 °C y la superficie marciana promedia −63 °C. Poner el horno abajo deja que ese calor suba.",
            ],
            [
              "Donador de electrones",
              "Las bacterias necesitan una fuente de carbono para poder respirar el perclorato. Los ácidos grasos volátiles de procesar los mismos residuos se la dan.",
            ],
          ]}
        />
        <p>
          Quita la etapa 3 y la etapa 1 se congela y se muere de hambre. Quita la
          etapa 1 y el regolito sigue tóxico y no puede servir de medio
          filtrante.
        </p>
      </Section>

      <Section id="pregunta-abierta" title="Pregunta de diseño abierta">
        <p>Con las etapas apiladas, la gravedad ayuda dos veces y estorba una:</p>
        <ul className="ml-5 list-disc space-y-1.5 marker:text-faint">
          <li>El regolito tratado cae de la etapa 1 a la etapa 2</li>
          <li>El agua percola hacia abajo por la etapa 2</li>
          <li>
            <strong>El biochar tiene que subir</strong> de la etapa 3 a la etapa 2
          </li>
        </ul>
        <p>
          Opciones en consideración: mover el horno a un costado en vez de abajo;
          tratar el biochar como recarga manual periódica en vez de flujo
          continuo; o invertir la pila y aceptar una ruta de calor por conducción
          en lugar de convección. Sin resolver, y documentado como sin resolver.
        </p>
      </Section>

      <Section id="contaminacion" title="Control de contaminación">
        <p>
          Dos cosas en este reto son invisibles y las dos contaminan. El
          perclorato es una. El polvo es la otra: un sistema que mueve regolito
          dentro de un hábitat es en sí mismo una fuente de polvo respirable. El
          límite de diseño es <Term>0.1 mg/m³</Term> como promedio ponderado en
          24 horas, más estricto que la cifra general de 0.3 mg/m³ de la
          NASA-STD-3001.
        </p>
        <p>
          Introducir bacterias terrestres en Marte es una cuestión de protección
          planetaria bajo COSPAR. La etapa 1 es un reactor de contención total.
        </p>
      </Section>
    </>
  );
}

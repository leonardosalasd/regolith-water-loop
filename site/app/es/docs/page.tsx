import type { Metadata } from "next";
import Link from "next/link";
import { Callout, PageHeader, Section, Table } from "@/components/ui";

export const metadata: Metadata = {
  title: "Introducción",
  description:
    "Por qué un hábitat marciano no puede resolver por separado el suelo tóxico, los residuos diarios y el reciclaje de agua, y cómo una sola columna de tres etapas responde a los tres.",
  alternates: { canonical: "/es/docs/", languages: { en: "/docs/", es: "/es/docs/" } },
};

export default function Page() {
  return (
    <>
      <PageHeader
        title="Un filtro hecho del mismo suelo que tiene que limpiar"
        lede="Tres problemas que un hábitat marciano no puede resolver por separado — suelo tóxico, residuos diarios y agua que hay que reciclar — resueltos por una sola máquina donde cada etapa alimenta a las otras."
      />

      <Section title="El problema">
        <p>
          El regolito marciano contiene perclorato desde antes de que alguien
          aterrice. No es contaminación que causara la misión: así es el planeta.
          Mientras el suelo esté así, es un riesgo químico para la tripulación.
        </p>
        <p>
          Al mismo tiempo, seis tripulantes producen aguas grises, restos de
          comida y empaques todos los días. Y el agua es demasiado valiosa para
          usarse una sola vez, así que hay que reciclarla: se supone que el
          hábitat tiene un procesador principal de agua, como ósmosis inversa,
          pero el agua usada le llega muy cargada.
        </p>
        <Callout tone="warn" title="Un sistema, no tres">
          <p>
            No son tres soluciones. Son{" "}
            <strong>un solo sistema donde cada parte ayuda a las demás</strong>.
            Lo que importa es el acoplamiento entre etapas, no las etapas por
            separado.
          </p>
        </Callout>
      </Section>

      <Section title="La respuesta, en un párrafo">
        <p>
          Unas bacterias en una cámara sellada respiran el perclorato del
          regolito y dejan cloruro inerte. Un horno sin oxígeno convierte los
          residuos de la tripulación en biochar. El regolito ya limpio y ese
          biochar se acomodan por capas en una columna, y las aguas grises
          percolan hacia abajo, llegando a la ósmosis inversa mucho más limpias
          de lo que salieron.
        </p>
        <p>
          Lo que amarra todo: el horno trabaja cerca de 500 °C y las bacterias se
          cultivan a 37 °C en un planeta cuya superficie baja hasta unos −153 °C.
          El horno las calienta. La meta es que también las alimente: las
          bacterias reductoras de perclorato necesitan un donador orgánico, como
          acetato, y los mismos residuos podrían darlo.
        </p>
        <p>
          <Link
            href="/es/docs/system/"
            className="text-accent underline-offset-4 hover:underline"
          >
            Leer el sistema completo →
          </Link>
        </p>
      </Section>

      <Section title="Qué se construye realmente">
        <p>
          La etapa 2, la columna de filtración, se construye en banco y se mide.
          Las etapas 1 y 3 se respaldan con literatura publicada. Los percloratos
          son sales oxidantes fuertes y no se manejan en este proyecto.
        </p>
        <Table
          head={["Etapa", "Estado", "Evidencia"]}
          rows={[
            ["1 · Biorremediación", "Modelada", "Literatura publicada"],
            ["2 · Columna de filtración", "En curso", "Bitácora de armado, en este sitio"],
            ["3 · Pirólisis", "Modelada", "Carbón comercial en lugar de su producto"],
          ]}
        />
        <p>
          La columna de banco sustituye los materiales marcianos por terrestres.
          La <strong>escoria volcánica</strong>, una roca basáltica, hace de
          regolito en las capas gruesas, y arena sílica fina hace de su fracción
          fina, que no se pudo obtener machacando escoria a mano. La capa de
          biochar es carbón vegetal comercial: madera carbonizada por pirólisis,
          el mismo producto que haría la etapa 3 con los residuos de la
          tripulación, pero no producido por este proyecto.
        </p>
      </Section>

      <Section title="Por qué importa en la Tierra">
        <p>
          La misma columna, hecha de roca volcánica local y carbón de residuo
          agrícola, funciona como pretratamiento pasivo descentralizado para el
          agua almacenada en casa. En muchos lugares el agua entubada no llega
          limpia y los hogares la almacenan antes de usarla. No es una analogía
          hecha después: es el mismo hardware.
        </p>
        <Callout tone="safety" title="Esto no potabiliza agua">
          <p>
            La columna es una etapa de pretratamiento. Reduce turbidez, sólidos
            en suspensión y parte de la carga química. <strong>No</strong>{" "}
            elimina bacterias, virus ni parásitos, y <strong>no</strong> vuelve
            el agua apta para beber. El agua que sale de aquí todavía necesita
            desinfección.
          </p>
        </Callout>
      </Section>
    </>
  );
}

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
          Mientras el suelo esté así, nada crece en él y nada puede construirse
          encima con seguridad.
        </p>
        <p>
          Al mismo tiempo, seis tripulantes producen aguas grises, restos de
          comida y empaques todos los días, y todo termina en ese mismo suelo. Y
          el agua es demasiado valiosa para usarse una sola vez, así que hay que
          reciclarla: el hábitat ya tiene una unidad de ósmosis inversa, pero el
          agua usada le llega muy cargada.
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
          Lo que amarra todo: el horno trabaja a 450 °C y las bacterias necesitan
          estar entre 20 y 35 °C en un planeta que promedia −63 °C. El horno las
          calienta. También las alimenta: las bacterias reductoras de perclorato
          necesitan una fuente de carbono para poder respirar, y esa sale de
          procesar los mismos residuos. Quita el horno y el biorreactor se
          congela y se muere de hambre.
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
            ["2 · Columna de filtración", "Construida y medida", "Datos de banco, en este sitio"],
            ["3 · Pirólisis", "Parcialmente construida", "Biochar producido de residuo agrícola"],
          ]}
        />
        <p>
          La columna de banco sustituye los materiales marcianos por terrestres.
          La <strong>escoria volcánica</strong>, una roca basáltica, hace de
          regolito. El biochar no es sustituto de nada: es biochar de verdad,
          hecho de residuo fibroso agrícola: bagazo de caña, fibra de coco o
          cascarilla de arroz.
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

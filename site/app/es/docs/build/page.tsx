import type { Metadata } from "next";
import { Callout, PageHeader, Photo, Section, Table } from "@/components/ui";

export const metadata: Metadata = {
  title: "Bitácora de armado",
  description:
    "El armado de la columna de filtración tal como ocurrió: tubo, salida, separadores de capa, carbón y escoria, con volúmenes medidos y lo que no salió como se planeó.",
  alternates: {
    canonical: "/es/docs/build/",
    languages: { en: "/docs/build/", es: "/es/docs/build/" },
  },
};

export default function Page() {
  return (
    <>
      <PageHeader
        title="Bitácora de armado"
        lede="El armado tal como ocurrió, incluido lo que no salió como se planeó. No se usó báscula: los volúmenes se midieron con frascos de 200 ml."
      />

      <Section title="Cuerpo de la columna">
        <p>
          Tubo de PVC de 3 pulgadas nominales, cortado a 750 mm. Es opaco, así que
          cada capa se fotografía desde arriba conforme se carga, no a través de la
          pared.
        </p>
        <Photo
          src="/build/02-column-body.webp"
          alt="Tubo de PVC blanco con una cinta métrica que marca 75 cm"
          width={1600}
          height={1066}
          caption="Cortado a 750 mm."
        />
      </Section>

      <Section title="Salida">
        <p>
          Un barreno en una tapa de PVC de 3 pulgadas lleva un tramo de manguera
          transparente de ½ pulgada hasta una válvula de esfera de ½ pulgada. La
          tapa entra en el tubo sobre cinta teflón, sin cementar, para poder
          desarmar la columna.
        </p>
        <Photo
          src="/build/01-outlet.webp"
          alt="Tapa de PVC con manguera transparente que atraviesa el centro hacia una válvula"
          width={982}
          height={1308}
          caption="Tapa, manguera y válvula."
        />
        <Callout tone="warn" title="Sin prueba de fugas todavía">
          <p>
            La unión de la salida espera una prueba de fugas con el tubo lleno hasta
            arriba. No entra nada a la columna hasta que aguante.
          </p>
        </Callout>
      </Section>

      <Section title="Separadores de capa">
        <p>
          Cinco discos cortados de malla mosquitera de plástico: uno debajo de la
          capa de soporte y uno entre cada par de capas.
        </p>
        <Photo
          src="/build/03-mesh-discs.webp"
          alt="Cinco discos más o menos circulares de malla mosquitera oscura"
          width={1600}
          height={1178}
          caption="Cinco discos de malla."
        />
      </Section>

      <Section title="Carbón">
        <p>
          Carbón vegetal en trozos, machacado a mano dentro de bolsas. Se conservó
          la fracción que se queda sobre la malla mosquitera y se descartó el
          polvo.
        </p>
        <Photo
          src="/build/04-charcoal-crushed.webp"
          alt="Tres frascos de vidrio con carbón machacado"
          width={1600}
          height={1183}
          caption="Machacado y seco, antes de lavar."
        />
        <Table
          head={["Etapa", "Volumen"]}
          mono={[1]}
          rows={[
            ["Machacado, seco", "≈ 500 ml"],
            ["Tras completar", "≈ 550–600 ml"],
          ]}
        />
        <p>
          Enjuagado y remojado toda la noche para que se hunda en vez de flotar a
          través de la capa de arriba. Algunos pedazos no bajaron de tamaño grava,
          así que se carga como capa graduada: grueso abajo y fino arriba.
        </p>
        <Photo
          src="/build/05-charcoal-soaked.webp"
          alt="Recipiente con gránulos de carbón lavado y húmedo"
          width={1600}
          height={1181}
          caption="Lavado y remojado."
        />
      </Section>

      <Section title="Escoria">
        <p>Separada con la malla mosquitera y a mano en dos fracciones.</p>
        <Photo
          src="/build/06-scoria-fractions.webp"
          alt="Dos recipientes con escoria volcánica roja, una más fina que la otra"
          width={1600}
          height={1185}
          caption="Fracción más fina a la izquierda, más gruesa a la derecha."
        />
        <Table
          head={["Fracción", "Volumen", "Destino"]}
          mono={[1]}
          rows={[
            ["Más gruesa", "≈ 300 ml", "Capa 1, soporte"],
            ["Más fina", "≈ 500 ml", "Capa 4, capa gruesa superior"],
          ]}
        />
        <Callout tone="warn" title="Falta la capa 3">
          <p>
            El machacado a mano se quedó en tamaño grava. La capa 3 necesita granos
            lo bastante chicos para pasar la malla mosquitera, y ninguna de las dos
            fracciones lo es, así que su material está pendiente.
          </p>
        </Callout>
      </Section>

      <Section title="Pendiente">
        <ul className="ml-5 list-disc space-y-2 marker:text-faint">
          <li>Prueba de fugas de la salida con el tubo lleno</li>
          <li>Conseguir una fracción tamaño arena para la capa 3</li>
          <li>Cargar la columna y lavar el lecho hasta que el efluente salga claro</li>
          <li>Armar el montaje fotométrico y tomar la serie de calibración</li>
        </ul>
      </Section>
    </>
  );
}

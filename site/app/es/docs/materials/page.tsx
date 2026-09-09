import type { Metadata } from "next";
import { Callout, PageHeader, Section, Table } from "@/components/ui";

export const metadata: Metadata = {
  title: "Materiales",
  description:
    "Lista de materiales para armar la columna y medirla, elegida para conseguirse en ferretería, acuario o vivero, sin equipo de laboratorio.",
  alternates: {
    canonical: "/es/docs/materials/",
    languages: { en: "/docs/materials/", es: "/es/docs/materials/" },
  },
};

export default function Page() {
  return (
    <>
      <PageHeader
        title="Materiales"
        lede="Todo lo de aquí se eligió para conseguirse en una ferretería, un acuario o un vivero comunes. No hace falta equipo de laboratorio."
      />

      <Section title="Columna">
        <Table
          head={["Artículo", "Cantidad", "Dónde"]}
          mono={[1]}
          rows={[
            ["Tubo de acrílico transparente, 3 pulg", "700 mm", "acrílicos"],
            ["Escoria volcánica en bruto", "3 kg", "vivero"],
            ["Carbón activado granular", "500 g", "acuario"],
            ["Grava de acuario", "1 kg", "acuario"],
            ["Manguera transparente, ½ pulg", "1 m", "ferretería"],
            ["Llave de paso de plástico, ½ pulg", "1", "ferretería"],
            ["Malla mosquitera de plástico", "30 × 30 cm", "ferretería"],
            ["Silicón transparente", "1 tubo", "ferretería"],
          ]}
        />
        <p>
          La transparencia no es estética. Las capas tienen que verse para que la
          columna se explique sola en una fotografía, que es para lo que sirve la
          mayor parte del armado.
        </p>
      </Section>

      <Section title="Medición">
        <Table
          head={["Artículo", "Cantidad", "Nota"]}
          mono={[1]}
          rows={[
            ["Frascos de vidrio idénticos", "6", "de pared recta, lisos, sin relieve"],
            ["Jeringas sin aguja", "3 × 20 ml", "para la serie de diluciones"],
            ["Vaso medidor de cocina", "1 L", "sustituye a la probeta"],
            ["Colorante vegetal azul", "1", "fuerte, no claro"],
            ["Jabón neutro líquido", "1", "carga de surfactante"],
            ["Cartulina blanca", "80 × 80 mm", "referencia de exposición"],
            ["Patrón de ajedrez impreso", "100 × 100 mm", "objetivo de contraste"],
            ["Lámpara constante", "1", "cualquier fuente de luz fija"],
          ]}
        />
        <Callout tone="note" title="Por qué los frascos deben ser idénticos">
          <p>
            Toda muestra se fotografía a través del vidrio. Un grosor o una
            curvatura distintos cambian lo que ve la cámara, y la serie deja de
            comparar nada. Seis frascos de mermelada iguales sirven tanto como
            seis comprados.
          </p>
        </Callout>
        <p>
          El azul no es una elección arbitraria. El índice de azul de metileno es
          la prueba industrial estándar de la capacidad de adsorción del carbón
          activado, así que un trazador azul imita el ensayo real — y el azul
          queda gris oscuro al convertir la fotografía, que es lo que necesita la
          medición de contraste. El amarillo queda casi blanco y es prácticamente
          invisible para el método.
        </p>
      </Section>

      <Section title="Deliberadamente innecesario">
        <Table
          head={["No hace falta", "En su lugar"]}
          rows={[
            ["Juego de tamices de laboratorio", "La malla mosquitera como un solo corte, con la abertura medida y reportada"],
            ["Balanza de precisión", "El medio se coloca por espesor; se registran volúmenes en vez de masas"],
            ["Geotextil", "Discos cortados de la misma malla mosquitera"],
            ["Probeta graduada", "Vaso medidor de cocina"],
            ["Prensas y soporte", "Una caja de cartón con un agujero en la tapa"],
            ["Turbidímetro", "Fotografías y el código de análisis"],
          ]}
        />
        <p>
          La caja merece una línea. La columna pasa por un agujero en la tapa, la
          salida y el frasco de recolección quedan escondidos dentro, y en cámara
          el resultado se lee como una columna sobre un pedestal en vez de un
          tubo amarrado a una silla.
        </p>
      </Section>

      <Section title="Lo que no se maneja">
        <Callout tone="safety" title="Sin percloratos">
          <p>
            Las sales de perclorato son oxidantes fuertes. No se usan, no se
            compran y no hacen falta. La etapa 1 se respalda con literatura
            publicada; lo que el banco demuestra es filtración y adsorción,
            medidas con agua gris sintética preparada con una receta escrita.
          </p>
        </Callout>
      </Section>
    </>
  );
}

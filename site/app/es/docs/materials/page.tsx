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
            ["Tubo de PVC, 3 pulg", "750 mm", "ferretería"],
            ["Escoria volcánica en bruto", "3 kg", "vivero"],
            ["Arena sílica fina para acuario", "~1.1 kg", "tienda de acuarios o mascotas"],
            ["Carbón vegetal en trozos, no briquetas", "~0.65 L machacado", "cualquier tienda"],
            ["Tapa de PVC, 3 pulg", "1", "ferretería"],
            ["Manguera transparente, ½ pulg", "1 m", "ferretería"],
            ["Válvula de esfera de plástico, ½ pulg", "1", "ferretería"],
            ["Malla mosquitera de plástico", "30 × 30 cm", "ferretería"],
            ["Epóxico de dos componentes", "1", "ferretería"],
          ]}
        />
        <p>
          El tubo es opaco, así que las capas no se ven una vez cargadas. Cada una
          se fotografía desde arriba conforme entra, y eso documenta el armado
          igual de bien. La arena sílica es inerte y no cambia la química del
          agua. El silicón caliente no aguanta sobre PVC mojado; la
          salida se sella con epóxico de dos componentes.
        </p>
      </Section>

      <Section title="Medición">
        <Table
          head={["Artículo", "Cantidad", "Nota"]}
          mono={[1]}
          rows={[
            ["Frasco de vidrio", "1", "de pared recta, liso, sin relieve; 5 más idénticos solo para la foto del degradado"],
            ["Jeringas sin aguja", "3 × 20 ml", "para la serie de diluciones"],
            ["Vaso medidor de cocina", "1 L", "sustituye a la probeta"],
            ["Colorante vegetal azul", "1", "fuerte, no claro"],
            ["Jabón neutro líquido", "1", "carga de surfactante"],
            ["Cartulina blanca", "80 × 80 mm", "revisión de saturación"],
            ["Patrón de ajedrez impreso", "100 × 100 mm", "objetivo de contraste"],
            ["Lámpara constante", "1", "cualquier fuente de luz fija"],
          ]}
        />
        <p>
          El patrón de ajedrez y la tarjeta blanca se imprimen juntos, a tamaño
          real, en una hoja A4.
        </p>
        <p>
          <a
            href="/print/target-sheet.pdf"
            className="inline-block border border-line px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-accent transition-colors hover:border-accent"
          >
            Descargar hoja de objetivos (PDF)
          </a>
        </p>
        <Callout tone="note" title="Por qué siempre el mismo frasco">
          <p>
            Toda muestra se fotografía a través del vidrio. Un grosor o una curvatura distintos cambian lo que ve la cámara, y la serie deja de comparar nada. Un frasco de mermelada limpio sirve tanto como uno comprado.
          </p>
        </Callout>
        <p>
          El azul es un trazador visual: muestra de un vistazo si el color disuelto pasa. La adsorción de azul de metileno es un indicador útil de la capacidad de adsorción del carbón activado, pero el colorante vegetal no es azul de metileno y esto no es ese ensayo.
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
            ["Prensas y soporte", "La columna amarrada con cinta a un trapeador recargado en la pared"],
            ["Turbidímetro", "Fotografías y el código de análisis"],
          ]}
        />
      </Section>

      <Section title="Lo que no se maneja">
        <Callout tone="safety" title="Sin percloratos">
          <p>
            Las sales de perclorato son oxidantes fuertes. No se usan, no se
            compran y no hacen falta. La etapa 1 se respalda con literatura
            publicada; lo que el banco prueba es filtración, con agua gris sintética preparada con una receta escrita. La adsorción no está demostrada: en las primeras corridas el colorante pasó.
          </p>
        </Callout>
      </Section>
    </>
  );
}

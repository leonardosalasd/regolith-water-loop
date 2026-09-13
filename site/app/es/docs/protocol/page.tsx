import type { Metadata } from "next";
import { Callout, PageHeader, Section, Steps, Table } from "@/components/ui";

export const metadata: Metadata = {
  title: "Protocolo",
  description:
    "Receta del agua gris sintética, clasificación del medio filtrante, serie de calibración y protocolo de corrida de la columna.",
  alternates: {
    canonical: "/es/docs/protocol/",
    languages: { en: "/docs/protocol/", es: "/es/docs/protocol/" },
  },
};

export default function Page() {
  return (
    <>
      <PageHeader
        title="Protocolo de corrida"
        lede="Una sola sesión, de principio a fin. Si la partes en dos días la luz cambia, y eso invalida la calibración."
      />

      <Section title="Agua gris sintética">
        <p>
          Patrón de 5 litros. Alcanza para una serie de calibración y tres cargas
          de la columna.
        </p>
        <Table
          head={["Componente", "Cantidad", "Para qué"]}
          mono={[1]}
          rows={[
            ["Agua de la llave", "5 L", "—"],
            ["Tierra fina, cribada", "15 g", "sólidos en suspensión"],
            ["Jabón neutro líquido", "5 ml", "carga de surfactante"],
            ["Colorante vegetal azul", "10 gotas", "trazador de adsorción"],
          ]}
        />
        <p>
          Vuelve a agitar justo antes de tomar cada muestra. Los sólidos se
          asientan en minutos, y un patrón asentado se lee como agua limpia.
        </p>
        <Callout tone="warn" title="Comprueba esto antes de seguir">
          <p>
            Con el frasco lleno del patrón sin diluir, la tarjeta con el patrón
            detrás todavía tiene que verse <strong>apenas</strong>. Si desaparece
            por completo, la medición de contraste se satura y la calibración no
            sirve. Muy opaco, agrega agua; muy claro, agrega tierra de 5 en 5
            gramos.
          </p>
        </Callout>
      </Section>

      <Section title="Clasificar la escoria">
        <p>
          Los tamices de laboratorio dan el resultado más limpio pero no son
          obligatorios. Sea cual sea el método, repórtalo con claridad y da
          números realmente medidos en vez de una malla nominal.
        </p>
        <Table
          head={["Método", "Qué reportar"]}
          rows={[
            ["Tamices de laboratorio", "D10 y coeficiente de uniformidad"],
            ["Colador de cocina o malla mosquitera", "Abertura medida contando hilos por centímetro"],
            ["Sedimentación", "Tiempos de asentamiento y masa recuperada por fracción"],
          ]}
        />
        <p>
          La sedimentación no necesita equipo: muele la escoria, agítala en una
          botella alta con agua y déjalo asentar. Los granos gruesos llegan al
          fondo primero y los finos al último, así que decantar a intervalos
          cronometrados separa las fracciones. Es separación por velocidad de
          sedimentación, el mismo principio del análisis con hidrómetro que se
          usa en mecánica de suelos.
        </p>
      </Section>

      <Section title="Preparar el carbón">
        <p>
          Carbón vegetal en trozos, nunca briquetas: las briquetas traen
          aglutinantes que se van al agua. Los pedazos deben verse como madera
          negra quebrada, no como pastillas uniformes.
        </p>
        <Steps
          items={[
            {
              title: "Machácalo con presión, no a golpes",
              body: <p>Dentro de dos bolsas, párate sobre una tabla encima o rueda una botella de vidrio.</p>,
            },
            {
              title: "Quédate con lo que no pasa la malla",
              body: <p>El polvo que atraviesa se iría con el agua y pondría negro el efluente.</p>,
            },
            {
              title: "Enjuaga hasta que el agua salga apenas gris",
              body: <p>Cambia el agua de la cubeta las veces que haga falta.</p>,
            },
            {
              title: "Remójalo toda la noche, hasta que se hunda",
              body: (
                <p>
                  El carbón seco está lleno de aire y flota a través de la capa de
                  arriba. Hervirlo 15 minutos en agua hace lo mismo más rápido.
                </p>
              ),
            },
          ]}
        />
        <Callout tone="note" title="Si no se deja machacar parejo">
          <p>
            Cárgalo como capa graduada: pedazos grandes abajo y fino arriba, para
            que el agua toque primero el material fino.
          </p>
        </Callout>
        <Callout tone="warn" title="Nada con sedimento al drenaje">
          <p>
            Deja asentar el agua de lavado, tira la parte clara y el sedimento a la
            basura. Los finos de escoria y el polvo de carbón tapan tuberías.
          </p>
        </Callout>
      </Section>

      <Section title="Hoja de objetivos">
        <p>
          El patrón de ajedrez y la tarjeta blanca de referencia para el montaje
          fotométrico, a tamaño real en una hoja A4. Imprímela al 100 % y
          comprueba la barra de 100 mm con una regla antes de recortar.
        </p>
        <p>
          <a
            href="/print/target-sheet.pdf"
            className="inline-block border border-line px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-accent transition-colors hover:border-accent"
          >
            Descargar hoja de objetivos (PDF)
          </a>
        </p>
        <p className="text-muted">
          O genérala con <code className="font-mono text-accent">rwl target</code>.
        </p>
      </Section>

      <Section title="Serie de calibración">
        <p>Cinco niveles, 200 ml cada uno.</p>
        <Table
          head={["Muestra", "Patrón", "Agua limpia"]}
          mono={[0, 1, 2]}
          rows={[
            ["cal0", "0 ml", "200 ml"],
            ["cal1", "50 ml", "150 ml"],
            ["cal2", "100 ml", "100 ml"],
            ["cal3", "150 ml", "50 ml"],
            ["cal4", "200 ml", "0 ml"],
          ]}
        />
        <p>
          Fotografía cada uno en el mismo frasco, lavándolo y secándolo entre
          niveles.
        </p>
      </Section>

      <Section title="La corrida">
        <Steps
          items={[
            {
              title: "Fotografía el influente",
              body: (
                <p>
                  Agita el patrón, llena el frasco y tómale la foto como{" "}
                  <code className="font-mono text-accent">influent</code>.
                </p>
              ),
            },
            {
              title: "Carga la columna",
              body: <p>Cierra la válvula y vierte 884 ml del patrón por arriba.</p>,
            },
            {
              title: "Abre la válvula y arranca el cronómetro",
              body: <p>Recoge el efluente en el vaso medidor.</p>,
            },
            {
              title: "Registra el caudal",
              body: <p>Cronometra cuánto tarda en pasar medio litro.</p>,
            },
            {
              title: "Fotografía el efluente",
              body: <p>Mismo frasco, mismo nivel de llenado, misma posición.</p>,
            },
            {
              title: "Repite, al menos tres cargas",
              body: (
                <p>
                  La primera carga da el mejor resultado y la remoción baja
                  conforme el lecho se satura. Esa curva es el resultado útil, no
                  el primer número suelto.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Qué anotar en el momento">
        <ul className="ml-5 list-disc space-y-2 marker:text-faint">
          <li>Espesor y volumen de cada medio colocado, y el rendimiento de la escoria en bruto</li>
          <li>El método de clasificación y su abertura medida o tiempos de sedimentación</li>
          <li>La receta de agua gris realmente usada, no la planeada</li>
          <li>Caudal y porcentaje de remoción por carga</li>
          <li>Temperatura ambiente</li>
        </ul>
        <p>
          Fotografía el armado en cada etapa, incluidas las versiones que no
          funcionaron, las fracciones clasificadas lado a lado, los cinco frascos
          de calibración como degradado, y el influente junto al efluente.
        </p>
      </Section>
    </>
  );
}

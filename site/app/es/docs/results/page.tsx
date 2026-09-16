import type { Metadata } from "next";
import { Callout, PageHeader, Photo, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Resultados",
  description:
    "Primeras corridas de la columna de filtración, a simple vista: los sólidos en suspensión se quedan, el colorante disuelto pasa.",
  alternates: {
    canonical: "/es/docs/results/",
    languages: { en: "/docs/results/", es: "/es/docs/results/" },
  },
};

export default function Page() {
  return (
    <>
      <PageHeader
        title="Resultados"
        lede="Primeras corridas, a simple vista. No se usó el método fotométrico, así que no hay porcentaje de remoción."
      />

      <Section title="Corrida 1 — agua con colorante">
        <p>
          Se pasó por la columna cargada agua muy teñida con colorante azul de
          alimentos. El azul salió. Después se enjuagó el lecho con agua limpia
          hasta que el efluente salió casi claro.
        </p>
      </Section>

      <Section title="Corrida 2 — agua con lodo">
        <p>
          Se echaron tres frascos de agua con lodo cuando ya había escurrido el
          agua estancada. El efluente empezó a salir 5–10 segundos después. Salió
          sin los sólidos cafés en suspensión, pero teñido de azul. Un segundo
          frasco salió igual.
        </p>
        <Photo
          src="/build/10-run-2.webp"
          alt="Tres frascos de agua turbia café junto a un frasco de efluente claro con tono azul"
          width={1600}
          height={578}
          caption="A la izquierda, los tres frascos que se echaron. A la derecha, el efluente."
        />
      </Section>

      <Section title="Qué muestran las corridas">
        <ul className="ml-5 list-disc space-y-2 marker:text-faint">
          <li>
            <strong>Los sólidos en suspensión se quedan.</strong> Entra agua café
            turbia y sale agua clara.
          </li>
          <li>
            <strong>El color disuelto no.</strong> El colorante está disuelto, no
            suspendido, así que un lecho de arena no lo cuela. El carbón es de
            leña, no activado, y el agua pasa poco tiempo en contacto con él.
          </li>
          <li>
            <strong>Lo azul de la corrida 2 muy probablemente venía de la 1.</strong>{" "}
            El colorante que se quedó en el lecho salió con el agua nueva. No se
            comprobó.
          </li>
        </ul>
      </Section>

      <Section title="Lo que no se hizo">
        <ul className="ml-5 list-disc space-y-2 marker:text-faint">
          <li>Medición fotométrica con la hoja de patrón y una serie de calibración</li>
          <li>Tres cargas con caudal medido</li>
          <li>Agua gris preparada con la receta escrita</li>
        </ul>
      </Section>

      <Section title="Siguiente">
        <ul className="ml-5 list-disc space-y-2 marker:text-faint">
          <li>Enjuagar el lecho hasta que el efluente salga sin color antes de otra corrida</li>
          <li>Cerrar un poco la llave para bajar el flujo y alargar el contacto</li>
          <li>Medir influente y efluente con el método fotométrico</li>
        </ul>
        <Callout tone="note" title="Sobre la honestidad">
          <p>
            La remoción se reporta relativa al influente, nunca en NTU. Un número
            que no se puede defender es peor que un número que nunca se afirmó.
          </p>
        </Callout>
      </Section>
    </>
  );
}

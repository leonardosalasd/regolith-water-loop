import type { Metadata } from "next";
import { Callout, PageHeader, Photo, Section, Table } from "@/components/ui";

export const metadata: Metadata = {
  title: "Build log",
  description:
    "Assembly of the filtration column as it happened: pipe, outlet, layer separators, charcoal and scoria, with measured volumes and what did not go to plan.",
  alternates: {
    canonical: "/docs/build/",
    languages: { en: "/docs/build/", es: "/es/docs/build/" },
  },
};

export default function Page() {
  return (
    <>
      <PageHeader
        title="Build log"
        lede="Assembly as it happened, including what did not go to plan. No scale was used: volumes were measured with 200 ml jars."
      />

      <Section title="Column body">
        <p>
          PVC pipe, 3 in nominal, cut to 750 mm. The pipe is opaque, so each layer
          is photographed from above as it goes in rather than through the wall.
        </p>
        <Photo
          src="/build/02-column-body.webp"
          alt="White PVC pipe with a tape measure along it reading 75 cm"
          width={1600}
          height={1066}
          caption="Cut to 750 mm."
        />
      </Section>

      <Section title="Outlet">
        <p>
          A bore through a 3 in PVC end cap carries a length of clear ½ in hose
          into a ½ in ball valve. The cap slides onto the pipe over PTFE tape
          rather than being cemented, so the column can be taken apart.
        </p>
        <p>
          The first seal was hot-melt glue, which does not hold on wet PVC. It was
          stripped out and replaced with two-part epoxy.
        </p>
        <Photo
          src="/build/01-outlet.webp"
          alt="PVC end cap with clear hose passing through its centre into a ball valve"
          width={982}
          height={1308}
          caption="End cap, hose and ball valve, with the first hot-melt seal."
        />
        <Callout tone="warn" title="Not yet leak-tested">
          <p>
            The outlet joint is waiting on a full-height leak test with the pipe
            filled to the top. Nothing goes into the column until it holds.
          </p>
        </Callout>
      </Section>

      <Section title="Layer separators">
        <p>
          Five discs cut from plastic insect mesh: one under the support layer
          and one between each pair of layers above it.
        </p>
        <Photo
          src="/build/03-mesh-discs.webp"
          alt="Five roughly circular discs of dark insect mesh"
          width={1600}
          height={1178}
          caption="Five mesh discs."
        />
      </Section>

      <Section title="Charcoal">
        <p>
          Lump charcoal, crushed by hand inside nested bags. The fraction held on
          the insect mesh was kept and the powder discarded.
        </p>
        <Photo
          src="/build/04-charcoal-crushed.webp"
          alt="Three glass jars holding crushed charcoal"
          width={1600}
          height={1183}
          caption="Crushed and dry, before washing."
        />
        <Table
          head={["Stage", "Volume"]}
          mono={[1]}
          rows={[
            ["Crushed, dry", "≈ 500 ml"],
            ["After topping up", "≈ 550–600 ml"],
          ]}
        />
        <p>
          Rinsed and soaked overnight so it sinks instead of floating up through
          the layer above. Some pieces would not crush below gravel size, so it is
          loaded as a graded layer: coarse at the bottom, fine on top.
        </p>
        <Photo
          src="/build/05-charcoal-soaked.webp"
          alt="Tub of wet, washed charcoal granules"
          width={1600}
          height={1181}
          caption="Washed and soaked."
        />
      </Section>

      <Section title="Scoria">
        <p>Sorted with the insect mesh and by hand into two fractions.</p>
        <Photo
          src="/build/06-scoria-fractions.webp"
          alt="Two containers of red volcanic scoria, one finer than the other"
          width={1600}
          height={1185}
          caption="Finer fraction on the left, coarser on the right."
        />
        <Table
          head={["Fraction", "Volume", "Destination"]}
          mono={[1]}
          rows={[
            ["Coarser", "≈ 300 ml", "Layer 1, support"],
            ["Finer", "≈ 500 ml", "Layer 4, coarse top layer"],
          ]}
        />
      </Section>

      <Section title="Fine sand">
        <p>
          Hand crushing stopped at gravel size, so neither scoria fraction is fine
          enough for layer 3. A fine carbonate sand already on hand was tried first
          and set aside: it kept releasing fines into the rinse water, and there
          was not enough of it.
        </p>
        <p>
          Layer 3 uses aquarium-grade fine silica sand instead. Quartz does not
          break down into fines the way carbonate does, and it leaves water
          chemistry unchanged. A 3 kg bag covers the ≈ 1.3 kg the layer needs and
          leaves enough to reload it.
        </p>
        <p>
          Before loading, it is rinsed until the water runs clear and checked for
          drainage in a perforated cup.
        </p>
      </Section>

      <Section title="Still to do">
        <ul className="ml-5 list-disc space-y-2 marker:text-faint">
          <li>Leak-test the outlet with the pipe full</li>
          <li>Rinse the silica sand and check its drainage</li>
          <li>Load the column and wash the bed until the effluent runs clear</li>
          <li>Build the photometric rig and shoot the calibration series</li>
        </ul>
      </Section>
    </>
  );
}

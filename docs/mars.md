<div align="center">

# Operating on Mars

What the Martian environment forces on the design, the system sized for a crew of six, and the habitat requirements it has to meet. Sources are listed in [references.md](references.md).

</div>

## Conditions and what they decide

| Condition | Value | Source | Design consequence |
| --- | --- | --- | --- |
| Liquid water | Not stable at present surface pressure and temperature | Haberle 2000 | Every wet stage runs inside the pressurised habitat. Nothing is exposed to the outside atmosphere. |
| Gravity | 3.7 m/s², 0.37 g | NASA Glenn | Flow through a packed bed scales with g at a fixed head. Filters need 2.65× the area or a taller head. |
| Surface temperature | From about 20 °C down to about −153 °C | NASA Science | The bioreactor needs an insulated, heated jacket. Its reference strain is grown at 37 °C (Mehta-Kolte 2017). |
| Perchlorate | 0.4–0.6 % by mass at Phoenix; 0.5–1 % in Martian soils generally; also detected at Gale Crater | Hecht 2009, Davila 2013, Glavin 2013 | Raw regolith is not used as filter medium. It passes through Stage 1 first. |
| Regolith type | Basaltic | Cannon 2019 | Basaltic volcanic scoria is the bench analogue. |
| Dust | Martian dust below 10 µm limited to 0.1 mg/m³, 24-hour average | NASA dust | Regolith handling is sealed from cabin air and from the water path. |
| Water source | Shallow ground ice; about 5 cm deep at Phoenix; northern mid-latitudes mapped as a resource | Hecht 2009, Morgan 2021 | The habitat mines ice for fresh water. This system treats water after use. |
| Planetary protection | Terrestrial organisms are governed by COSPAR policy | COSPAR | Stage 1 is a closed reactor. Nothing living is vented or discharged. |

## Sized for six crew

Reproducible with the package ([`rwl` on PyPI](https://pypi.org/project/rwl/)):

```bash
pipx install rwl
rwl size --crew 6 --base early --explain
```

| Quantity | Early base | Mature base | Basis |
| --- | --- | --- | --- |
| Hygiene greywater | 33.2 L/day | 61.0 L/day | BVAD Table 4-21, 5.53 and 10.17 kg per crew per day |
| Continuous flow | 1.38 L/h | 2.54 L/h | |
| Filter area, Earth gravity | 0.0035–0.014 m² | 0.0064–0.025 m² | 0.1–0.4 m/h, Emergency WASH |
| Filter area, Mars gravity, same head | 0.009–0.037 m² | 0.017–0.067 m² | Area ÷ 0.377 |
| Bench-size columns (69 mm bore), Mars | 2.5–9.8 | 4.5–18.0 | RWL-001 bore |
| Bed volume, Mars | 4–15 L | 7–28 L | 420 mm bed, RWL-001 |
| Trash | 8.3 kg/day | 8.3 kg/day | BVAD Table 4-29, 1.39 kg per crew per day |
| Char, dry basis | 0.82 kg/day | 0.82 kg/day | Food and paper 47.5 % of trash, less its moisture (Table 4-28), × 25 % char yield (Penn State) |
| Retort heat | 5.0–7.6 MJ/day | 5.0–7.6 MJ/day | See below |

The filter is small. A six-person base needs the area of 2.5 to 9.8 columns the size of the bench build, so three to ten of them run in parallel. That is the case for modules: identical sealed cartridges that are swapped when spent, instead of one large bed that has to be dug out.

## Gravity: area or head

Flow through a packed bed follows Darcy's law, and the bed's hydraulic conductivity is proportional to g. At 0.37 g the same column passes 37.7 % of its Earth flow. There are two ways back:

| | Earth | Mars, same flow |
| --- | --- | --- |
| More area, same head | 1 column | 2.65 columns |
| Same area, more head | 0.20 m of water over the 0.42 m bed | 1.22 m of water over the bed |

With a free-draining outlet the driving gradient is (standing water + bed) ÷ bed, so the whole of it has to grow by 2.65×, not just the water on top. A 1.2 m water column per cartridge is impractical inside a habitat; parallel cartridges are not. That is why the design adds area. `rwl cartridge` prints both. The scaling itself rests on Darcy's law; the bench column's own conductivity, and the same bed at 0.37 g, come out of a timed run with `rwl permeability`.

## Retort heat

The open question of what the pyrolysis retort costs, answered as a range:

| | Six crew, per day | Basis |
| --- | --- | --- |
| Feed, food and paper | 3.96 kg | 47.5 % of 8.34 kg trash (BVAD Table 4-28) |
| Moisture in the feed | 0.69 kg | Plate waste 70 %, paper 10.2 %, unopened food 0.2 % (Table 4-28) |
| Dry feed | 3.27 kg | |
| Pyrolysing the dry feed | 2.6–5.2 MJ | 0.8–1.6 MJ/kg near 500 °C (Daugaard 2003) |
| Water to steam at 500 °C | 2.3 MJ | 3.40 MJ/kg from 20 °C at 1 atm (NIST) |
| Total | 5.0–7.6 MJ | 57–88 W averaged over a day |

The Daugaard figures are for wood and crop residues in a fast-pyrolysis reactor, not mixed food waste in a slow retort; they set the order of magnitude, not a design value. Heat losses from the retort wall are not included. The point stands at either end of the range: tens of watts on average, run as a batch.

## Oxygen is a side product

Perchlorate carries oxygen, and Davila 2013 proposes recovering it biochemically. The numbers show why this design does not count on it.

Full reduction, with acetate as electron donor:

```
ClO4- + CH3COO- + H+  ->  Cl- + 2 CO2 + 2 H2O
```

Chlorite dismutase releases one O₂ per perchlorate, but the same cells respire it (Ettwig 2012). Capturing all of it would halve the acetate demand and give, per tonne of regolith:

| | 0.4 % perchlorate | 1 % perchlorate |
| --- | --- | --- |
| Perchlorate | 4.0 kg | 10.0 kg |
| Acetate, full reduction | 2.4 kg | 5.9 kg |
| O₂ if every molecule were captured | 1.3 kg | 3.2 kg |

Six crew consume 5.37 kg of O₂ a day (BVAD Table 3-31). Even with perfect capture, covering that would mean treating 1.7–4.2 tonnes of regolith every day. Stage 1 exists to detoxify, and any oxygen recovered is a bonus.

## Chloride

Every perchlorate reduced leaves one chloride ion behind: 1.43–3.56 kg per tonne of regolith. Diluting that to the 250 mg/L taste limit for chloride (US EPA secondary standard) would take 5.7–14.3 m³ of water per tonne. Dilution is not an option on Mars, so the rinse is kept small and the brine goes to a brine processor of the kind already demonstrated on the ISS for urine brine (BVAD, section 4.3.3).

## What Mars supplies, what Earth supplies

One bench-size cartridge, taking the RWL-001 media schedule and counting every mineral layer as treated regolith:

| Item | Amount | Comes from |
| --- | --- | --- |
| Treated regolith | 1.46 kg | Mars, Stage 1 |
| Char | 0.14 kg | Mars, Stage 3; one day of trash makes enough for 6–7 cartridges |
| Acetate to detoxify the regolith | 3.5–8.7 g | Earth, until a waste-derived donor works |
| Cartridge shell | 1 | Earth, refilled on site |
| Chloride left to rinse | 2.1–5.2 g | Goes to the brine processor |

The acetate is the stoichiometric minimum; bacteria also spend some donor on growth, so the real figure is higher. For scale: the ISS Water Processor Assembly relies on expendable multifiltration beds that need about 472 kg of resupply a year (BVAD, section 4.3.3). This design does not replace those beds and does not claim to extend their life by any measured amount. Its own media, by mass, is made on Mars.

## The stages at mission scale

**Stage 1 — bioreactor.** A closed, heated, anaerobic vessel. Regolith is treated in batches. The perchlorate-reducing strains *Azospira suillum* PS (Mehta-Kolte 2017) and *Dechloromonas aromatica* RCB (Salinero 2009) use the pathway through perchlorate reductase and chlorite dismutase (Coates 2004). The electron donor is supplied as acetate or lactate until a waste-derived donor is shown to work. Treated regolith is rinsed of chloride before it leaves.

**Stage 2 — filter modules.** Sealed cartridges of the RWL-001 layering, filled with treated regolith and char by an automated station in the dirty zone, run in parallel under gravity. Effluent goes to the habitat's main water processor, not to the crew. The bench build demonstrates this stage.

**Stage 3 — pyrolysis.** A closed retort for food and paper waste. Char goes to Stage 2 as sorbent (Ahmad 2014). Off-gas is scrubbed before it reaches cabin air. Retort heat keeps the Stage 1 jacket warm.

The flow between stages is drawn in RWL-003; placement inside the habitat in RWL-004.

## Habitat requirements

From NASA-STD-3001 Volume 2, Revision E.

| Requirement | What it asks | How the design responds |
| --- | --- | --- |
| V2 6026 Potable Water Quality | Potable water chemically and microbiologically safe at the point of use | Not claimed. This is pre-treatment; the main processor downstream is responsible for potability. |
| V2 6046 Water Quality Monitoring and Alerting | Monitor water quality and notify crew near limits | Photographic turbidity reading on influent and effluent as a low-cost trend check, not a replacement for certified sensors |
| V2 6051 Water Contamination Control | Prevent contamination of potable and hygiene water, including from dust | Regolith handling and water path physically separated; cartridges loaded sealed |
| V2 6052 Particulate Matter | Total dust below 3 mg/m³; respirable fraction below 2.5 µm below 1 mg/m³ | Regolith handled only in closed transfer; cartridges never opened in the cabin |
| V2 6153 Celestial Dust Monitoring and Alerting | Monitor celestial dust, including Martian, and alert crew | Dust monitoring at the regolith handling station |
| V2 6053 Lunar Dust Contamination | Lunar dust below 10 µm under 0.3 mg/m³ time-weighted average | Lunar requirement. The Martian dust limit of 0.1 mg/m³ (NASA dust) is stricter and is the one used. |
| V2 6050 Atmosphere Contamination Limit | Gaseous pollutants below spacecraft maximum allowable concentrations | Pyrolysis off-gas scrubbed and vented through life support, never released to cabin |
| V2 6004 Nominal Vehicle/Habitat Carbon Dioxide Levels | One-hour average ppCO₂ no more than 3 mmHg | CO₂ from the bioreactor and retort is ducted to life support, not to cabin air |

## Open questions

- **Retort waste heat.** The retort needs 5.0–7.6 MJ a day. Whether what it rejects covers the Stage 1 jacket depends on a reactor volume and insulation that are not designed yet.
- **Waste-derived electron donor.** Whether the pyrolysis liquid can feed Stage 1 is untested. Until then the donor is a consumable.
- **Char transport.** Char is made in Stage 3 and used in Stage 2. With cartridges this becomes a refill step, not a continuous flow.
- **Chloride rinse.** The chloride mass is known; the rinse volume that gets it out of the regolith pores is not measured.
- **Real regolith.** Scoria is a basaltic analogue. Filtration behaviour with Martian fines, and under 0.37 g, is modelled, not measured.
- **Moving solids.** Regolith and char cannot flow sideways between units by gravity. Sealed containers or a screw conveyor would carry them; neither is designed.
- **Access to the dirty zone.** The glovebox and the fill station need occasional hands-on work, and how crew reach the dirty zone without breaking containment is not designed.

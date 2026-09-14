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

Reproducible with the package:

```bash
rwl size --crew 6 --base early
```

| Quantity | Early base | Mature base | Basis |
| --- | --- | --- | --- |
| Hygiene greywater | 33.2 L/day | 61.0 L/day | BVAD Table 4-21, 5.53 and 10.17 kg per crew per day |
| Continuous flow | 1.38 L/h | 2.54 L/h | |
| Filter area, Earth gravity | 0.0035–0.014 m² | 0.0064–0.025 m² | 0.1–0.4 m/h, Emergency WASH |
| Filter area, Mars gravity, same head | 0.009–0.037 m² | 0.017–0.067 m² | Area ÷ 0.377 |
| Bench-size columns (Ø 75 mm), Mars | 2–8 | 4–15 | RWL-001 bore |
| Bed volume, Mars | 4–15 L | 7–28 L | 420 mm bed, RWL-001 |
| Trash | 8.3 kg/day | 8.3 kg/day | BVAD Table 4-29, 1.39 kg per crew per day |
| Char, upper estimate | 1.0 kg/day | 1.0 kg/day | Food and paper 47.5 % of trash (Table 4-28) × 25 % char yield (Penn State) |

The filter is small. A six-person base needs two to eight columns the size of the bench build, run in parallel. That is the case for modules: identical sealed cartridges that are swapped when spent, instead of one large bed that has to be dug out.

The char figure is an upper estimate: the 25 % yield is on dry feed, and trash is weighed wet.

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

## The stages at mission scale

**Stage 1 — bioreactor.** A closed, heated, anaerobic vessel. Regolith is treated in batches. The perchlorate-reducing strains *Azospira suillum* PS (Mehta-Kolte 2017) and *Dechloromonas aromatica* RCB (Salinero 2009) use the pathway through perchlorate reductase and chlorite dismutase (Coates 2004). The electron donor is supplied as acetate or lactate until a waste-derived donor is shown to work. Treated regolith is rinsed of chloride before it leaves.

**Stage 2 — filter modules.** Sealed cartridges of the RWL-001 layering, filled with treated regolith and char, run in parallel under gravity. Effluent goes to the habitat's main water processor, not to the crew. The bench build demonstrates this stage.

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

- **Pyrolysis energy.** The heat the retort needs, and whether its waste heat actually covers the Stage 1 jacket, has not been calculated.
- **Waste-derived electron donor.** Whether the pyrolysis liquid can feed Stage 1 is untested. Until then the donor is a consumable.
- **Char transport.** Char is made in Stage 3 and used in Stage 2. With cartridges this becomes a refill step, not a continuous flow.
- **Chloride.** Reduced perchlorate leaves chloride in the regolith. How much rinsing that takes, and where the brine goes, is not sized.
- **Real regolith.** Scoria is a basaltic analogue. Filtration behaviour with Martian fines, and under 0.37 g, is modelled, not measured.

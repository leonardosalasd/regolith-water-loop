<div align="center">

# The system

</div>

## The problem

A Mars habitat supporting six crew faces three linked problems:

1. **The soil is toxic on arrival.** Martian regolith contains perchlorate before anyone lands. The Phoenix lander measured 0.4–0.6% by mass in the northern plains (Hecht 2009). At those levels it is a chemical hazard to the crew (Davila 2013).
2. **The mission produces waste every day.** Greywater, food residue, paper and packaging, every day, with nowhere to send it.
3. **Water has to be recycled.** The habitat is assumed to mine subsurface ice and run a main water processor, such as reverse osmosis. The question is how used water can reach that machine in better condition.

The three are not solved separately. They are solved by one system in which each stage supplies something the others need.

Mission-scale sizing and habitat requirements are in [mars.md](mars.md). Sources are in [references.md](references.md).

## Three stages

Ordered by physical position, top to bottom.

### Stage 1 — Bioremediation

Regolith enters a sealed, humid, anaerobic chamber inoculated with perchlorate-reducing bacteria. They use perchlorate as terminal electron acceptor and leave inert chloride:

```
ClO4- -> ClO3- -> ClO2- -> Cl- + O2
```

via perchlorate reductase and chlorite dismutase (Coates 2004).

Strains: *Azospira suillum* PS (Mehta-Kolte 2017) and *Dechloromonas aromatica* RCB, a soil microbe (Salinero 2009). Neither is engineered.

The oxygen released is respired by the same cells (Ettwig 2012). Recovering it has been proposed (Davila 2013), but even perfect capture covers little of a crew's need; see [mars.md](mars.md). The benefit of this stage is detoxification.

### Stage 2 — Filtration column

Treated regolith and biochar are layered in a column. Greywater is applied at the top and percolates down under gravity.

| Layer | Function |
| --- | --- |
| Coarse regolith | distributes flow, prevents channelling |
| Fine regolith | retains suspended solids |
| Biochar | adsorbs metals and dissolved organic load |
| Support regolith | drainage |

The effluent reaches reverse osmosis with reduced load, so the machine works less and its membranes last longer.

This is the stage built and tested on the bench. See [results.md](results.md).

### Stage 3 — Pyrolysis

Food waste and paper are heated to around 500 °C without oxygen. The material does not burn, it chars. Slow pyrolysis leaves about a quarter of the feed as char (Penn State), and that char is a sorbent for metals and organics in water (Ahmad 2014).

## What makes it one system

Stage 3 supplies two things Stage 1 cannot operate without on Mars:

- **Waste heat.** The retort runs near 500 °C. The reference strain is grown at 37 °C (Mehta-Kolte 2017), and the Martian surface falls to about −153 °C (NASA Science). Retort heat keeps the bioreactor warm.
- **Electron donor.** The bacteria need an organic donor such as acetate or lactate to respire perchlorate (Mehta-Kolte 2017). Supplying it from the pyrolysis liquid is the target; until that is shown, the donor is a consumable.

Remove Stage 3 and Stage 1 loses its heat and, eventually, its donor. Remove Stage 1 and the regolith stays toxic and cannot serve as filter medium.

## Open design question

With the stages stacked as above, gravity helps twice and hinders once:

- Treated regolith falls from Stage 1 into Stage 2 ✓
- Water percolates down through Stage 2 ✓
- Biochar has to travel up from Stage 3 into Stage 2 ✗

Options under consideration: move the furnace alongside rather than below; treat biochar as a periodic manual recharge rather than a continuous flow; or invert the stack and accept a heat transfer path instead of convection.

## Bench analogues

The bench build substitutes Earth materials for the Martian ones.

| Mars | Bench | Simulated? |
| --- | --- | --- |
| Regolith, coarse fractions | Volcanic scoria, basaltic | Yes — analogous rock, not regolith |
| Regolith, fine fraction | Fine silica sand | Yes — sand-sized scoria could not be produced by hand |
| Biochar from crew waste | Commercial lump charcoal | Partly — real pyrolysis char, but from wood and not made by this project |
| Greywater | Synthetic mix to a written recipe | Yes |
| Perchlorate reduction | Not reproduced | Modelled from literature |

Perchlorates are strong oxidising salts and are not handled in this project. Stages 1 and 3 are supported by published work; Stage 2 is the stage built and tested on the bench.

## Contamination control

Two things here are invisible and both contaminate.

Perchlorate is one. Dust is the other: a system that moves regolith inside a habitat is itself a source of respirable dust. NASA's limit for Martian dust below 10 µm is **0.1 mg/m³ as a 24-hour time-weighted average**, stricter than the 0.3 mg/m³ set for lunar dust in NASA-STD-3001. Containment of the regolith handling path is part of the design, not an afterthought.

Introducing terrestrial bacteria to Mars is a planetary protection question under COSPAR policy. Stage 1 is a fully contained reactor.

## Return to Earth

The same column, built from local volcanic rock, sand and charcoal, works as decentralised passive pre-treatment for household water storage. In many places piped water does not arrive clean and households store it before use. This is not an analogy drawn after the fact — it is the same hardware.

Relevant Sustainable Development Goals: 6 (clean water and sanitation), 12 (responsible consumption and production), 9 (industry, innovation and infrastructure).

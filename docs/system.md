<div align="center">

# The system

</div>

## The problem

A Mars habitat supporting six crew faces three linked problems:

1. **The soil is toxic on arrival.** Martian regolith contains perchlorate before anyone lands. The Phoenix lander measured 0.4–0.6% by weight at Green Valley. Nothing grows in it and nothing can be built on it safely.
2. **The mission produces waste every day.** Greywater, food residue, packaging and technical waste, all of it ending up in that same soil.
3. **Water has to be recycled.** The habitat already extracts subsurface ice and purifies it by reverse osmosis. That part works. The question is how used water can reach that machine in better condition.

The three are not solved separately. They are solved by one system in which each stage supplies something the others need.

## Three stages

Ordered by physical position, top to bottom.

### Stage 1 — Bioremediation

Regolith enters a sealed, humid, anaerobic chamber inoculated with perchlorate-reducing bacteria. They use perchlorate as terminal electron acceptor and leave inert chloride:

```
ClO4- -> ClO3- -> ClO2- -> Cl- + O2
```

via perchlorate reductase and chlorite dismutase.

Strains: *Azospira suillum* (PS) and *Dechloromonas aromatica* (RCB). Neither is exotic or engineered; both occur in ordinary river sediment and soil.

The oxygen released is an intermediate the same organisms consume. Net export to life support is near zero. The benefit of this stage is detoxification, not oxygen production.

### Stage 2 — Filtration column

Treated regolith and biochar are layered in a column. Greywater is applied at the top and percolates down under gravity.

| Layer | Function |
| --- | --- |
| Coarse regolith | distributes flow, prevents channelling |
| Fine regolith | retains suspended solids |
| Biochar | adsorbs metals and dissolved organic load |
| Support gravel | drainage |

The effluent reaches reverse osmosis with reduced load, so the machine works less and its membranes last longer.

This is the stage built and measured on the bench. See [method.md](method.md).

### Stage 3 — Pyrolysis

Organic waste and cellulosic packaging are heated to roughly 450 °C without oxygen. The material does not burn, it chars: pathogens are destroyed, volatile gases driven off, and what remains is biochar — porous, with high cation exchange capacity.

## What makes it one system

Stage 3 supplies two things Stage 1 cannot operate without on Mars:

- **Waste heat.** The furnace runs at 450 °C. The bacteria need roughly 20–35 °C and the Martian surface averages −63 °C. Placing the furnace at the bottom lets that heat rise through the column.
- **Electron donor.** The bacteria need a carbon source to respire perchlorate at all. Volatile fatty acids from processing the same waste stream supply it.

Remove Stage 3 and Stage 1 freezes and starves. Remove Stage 1 and the regolith stays toxic and cannot serve as filter medium.

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
| Regolith | Volcanic scoria, basaltic | Yes — analogous rock, not regolith |
| Biochar from crew waste | Biochar from fibrous agricultural residue | No — this is real biochar |
| Greywater | Synthetic mix to a written recipe | Yes |
| Perchlorate reduction | Not reproduced | Modelled from literature |

Perchlorates are strong oxidising salts and are not handled in this project. Stage 1 is supported by published work; Stages 2 and 3 are built and measured.

## Contamination control

Two things in this challenge are invisible and both contaminate.

Perchlorate is one. Dust is the other: a system that moves regolith inside a habitat is itself a source of respirable dust. The design limit is **0.1 mg/m³ as a 24-hour time-weighted average**, stricter than the 0.3 mg/m³ general figure in NASA-STD-3001. Containment of the regolith handling path is part of the design, not an afterthought.

Introducing terrestrial bacteria to Mars is a planetary protection question under COSPAR. Stage 1 is a fully contained reactor.

## Return to Earth

The same column, built from local volcanic rock and agricultural residue char, works as decentralised passive pre-treatment for household water storage. In many places piped water does not arrive clean and households store it before use. This is not an analogy drawn after the fact — it is the same hardware.

Relevant Sustainable Development Goals: 6 (clean water and sanitation), 12 (responsible consumption and production), 9 (industry, innovation and infrastructure).

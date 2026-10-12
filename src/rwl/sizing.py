"""Mission-scale sizing for a crew. Every constant cites its source in docs/references.md."""

from __future__ import annotations

import math
from dataclasses import asdict, dataclass

# NASA BVAD REV2, Table 4-21, total hygiene wastewater load [kg/CM-d]
HYGIENE_WASTEWATER = {"early": 5.53, "mature": 10.17}
# NASA BVAD REV2, Table 4-29, Shuttle average trash [kg/CM-d]
TRASH = 1.39
# NASA BVAD REV2, Table 4-28, STS-51D trash: (fraction of total mass, moisture content)
PYROLYSABLE = {"plate waste": (0.098, 0.70), "uneaten food": (0.247, 0.002), "mixed paper": (0.130, 0.102)}
PYROLYSABLE_FRACTION = sum(share for share, _ in PYROLYSABLE.values())
# Daugaard & Brown 2003, energy to pyrolyse dry biomass near 500 °C [MJ/kg]
PYROLYSIS_ENERGY = (0.8, 1.6)
# NIST Chemistry WebBook, water at 1 atm: liquid at 20 °C (84.0 kJ/kg) to steam at 500 °C (3488.7 kJ/kg) [MJ/kg]
WATER_TO_STEAM = 3.4047
# NASA BVAD REV2, Table 3-31, nominal oxygen consumed [kg/CM-d]
CREW_OXYGEN = 0.895
# Penn State EGEE 439, slow pyrolysis near 500 °C: char share of feed mass
CHAR_YIELD = 0.25
# Emergency WASH, slow sand filtration rate [m/h]
FILTRATION_RATE = (0.1, 0.4)
# NASA Glenn Research Center, Mars surface gravity [m/s2]
MARS_GRAVITY = 3.7
EARTH_GRAVITY = 9.81
# Hecht et al. 2009 (Phoenix) and Davila et al. 2013, perchlorate mass fraction of regolith
PERCHLORATE_FRACTION = (0.004, 0.01)

# US EPA secondary drinking water standard for chloride [mg/L]
CHLORIDE_LIMIT = 250.0

# RWL-001: bench column bore, bed depth, standing charge above the bed, and media schedule [kg]
BENCH_BORE_M = 0.075
BED_DEPTH_M = 0.42
CHARGE_DEPTH_M = 0.20
BENCH_MEDIA = {"support scoria": 0.200, "charcoal": 0.160, "fine sand": 1.330, "coarse scoria": 0.200}
CHAR_MEDIA = ("charcoal",)

MOLAR_MASS = {"ClO4": 99.45, "O2": 32.00, "acetate": 59.04, "Cl": 35.45}
WATER_DENSITY = 1.0  # kg/L


@dataclass(frozen=True)
class Sizing:
    crew: int
    base: str
    greywater_l_per_day: float
    flow_l_per_h: float
    filter_area_m2: tuple[float, float]
    filter_area_mars_m2: tuple[float, float]
    bench_columns: tuple[float, float]
    bench_columns_mars: tuple[float, float]
    bed_volume_m3: tuple[float, float]
    trash_kg_per_day: float
    char_kg_per_day: float
    crew_oxygen_kg_per_day: float
    retort: Retort

    def as_dict(self) -> dict[str, object]:
        return asdict(self)


@dataclass(frozen=True)
class Perchlorate:
    regolith_kg: float
    perchlorate_kg: tuple[float, float]
    acetate_full_kg: tuple[float, float]
    oxygen_max_kg: tuple[float, float]
    chloride_kg: tuple[float, float]
    rinse_to_limit_m3: tuple[float, float]


@dataclass(frozen=True)
class Retort:
    feed_kg: float
    water_kg: float
    dry_kg: float
    char_dry_kg: float
    energy_mj: tuple[float, float]
    mean_power_w: tuple[float, float]


@dataclass(frozen=True)
class Cartridge:
    regolith_kg: float
    char_kg: float
    perchlorate_g: tuple[float, float]
    acetate_g: tuple[float, float]
    chloride_g: tuple[float, float]
    per_day_of_char: tuple[float, float]
    earth_head_m: float
    mars_head_m: float


def constants() -> dict[str, object]:
    """Every sourced constant, for ports of this model that must not drift from it."""
    return {
        "hygieneWastewater": HYGIENE_WASTEWATER,
        "trash": TRASH,
        "pyrolysable": {name: list(pair) for name, pair in PYROLYSABLE.items()},
        "pyrolysisEnergy": list(PYROLYSIS_ENERGY),
        "waterToSteam": WATER_TO_STEAM,
        "crewOxygen": CREW_OXYGEN,
        "charYield": CHAR_YIELD,
        "filtrationRate": list(FILTRATION_RATE),
        "marsGravity": MARS_GRAVITY,
        "earthGravity": EARTH_GRAVITY,
        "perchlorateFraction": list(PERCHLORATE_FRACTION),
        "chlorideLimit": CHLORIDE_LIMIT,
        "benchBore": BENCH_BORE_M,
        "bedDepth": BED_DEPTH_M,
        "chargeDepth": CHARGE_DEPTH_M,
        "benchMedia": BENCH_MEDIA,
        "charMedia": list(CHAR_MEDIA),
        "molarMass": MOLAR_MASS,
    }


def _scale(pair: tuple[float, float], factor: float) -> tuple[float, float]:
    return pair[0] * factor, pair[1] * factor


def gravity_factor() -> float:
    """Darcy flux scales with g at a fixed head, so a bed on Mars passes this share of its Earth flow."""
    return MARS_GRAVITY / EARTH_GRAVITY


def bench_area() -> float:
    return math.pi * (BENCH_BORE_M / 2) ** 2


def retort(trash_kg: float) -> Retort:
    """Daily heat for the pyrolysis retort: dry feed per Daugaard & Brown, plus boiling off its moisture."""
    feed = trash_kg * PYROLYSABLE_FRACTION
    water = trash_kg * sum(share * moisture for share, moisture in PYROLYSABLE.values())
    dry = feed - water
    energy = (dry * PYROLYSIS_ENERGY[0] + water * WATER_TO_STEAM, dry * PYROLYSIS_ENERGY[1] + water * WATER_TO_STEAM)
    return Retort(
        feed_kg=feed,
        water_kg=water,
        dry_kg=dry,
        char_dry_kg=dry * CHAR_YIELD,
        energy_mj=energy,
        mean_power_w=_scale(energy, 1e6 / 86400),
    )


def size(crew: int = 6, base: str = "early") -> Sizing:
    if crew < 1:
        raise ValueError("crew must be at least 1")
    if base not in HYGIENE_WASTEWATER:
        raise ValueError(f"base must be one of {sorted(HYGIENE_WASTEWATER)}")

    greywater = crew * HYGIENE_WASTEWATER[base] / WATER_DENSITY
    flow_m3_h = greywater / 1000 / 24
    slow, fast = FILTRATION_RATE
    area = (flow_m3_h / fast, flow_m3_h / slow)
    area_mars = _scale(area, 1 / gravity_factor())
    trash = crew * TRASH

    return Sizing(
        crew=crew,
        base=base,
        greywater_l_per_day=greywater,
        flow_l_per_h=greywater / 24,
        filter_area_m2=area,
        filter_area_mars_m2=area_mars,
        bench_columns=_scale(area, 1 / bench_area()),
        bench_columns_mars=_scale(area_mars, 1 / bench_area()),
        bed_volume_m3=_scale(area_mars, BED_DEPTH_M),
        trash_kg_per_day=trash,
        char_kg_per_day=trash * PYROLYSABLE_FRACTION * CHAR_YIELD,
        crew_oxygen_kg_per_day=crew * CREW_OXYGEN,
        retort=retort(trash),
    )


def perchlorate(regolith_kg: float = 1000.0) -> Perchlorate:
    """Stoichiometry of full microbial reduction, ClO4- + CH3COO- + H+ -> Cl- + 2 CO2 + 2 H2O.

    The upper bound on oxygen assumes every O2 from chlorite dismutase is captured
    instead of respired, which halves the acetate needed.
    """
    if regolith_kg <= 0:
        raise ValueError("regolith mass must be positive")

    def bound(fraction: float) -> tuple[float, float, float, float]:
        clo4 = regolith_kg * fraction
        mol = clo4 * 1000 / MOLAR_MASS["ClO4"]
        acetate = mol * MOLAR_MASS["acetate"] / 1000
        oxygen = mol * MOLAR_MASS["O2"] / 1000
        chloride = mol * MOLAR_MASS["Cl"] / 1000
        return clo4, acetate, oxygen, chloride

    low, high = (bound(f) for f in PERCHLORATE_FRACTION)
    chloride = (low[3], high[3])
    return Perchlorate(
        regolith_kg=regolith_kg,
        perchlorate_kg=(low[0], high[0]),
        acetate_full_kg=(low[1], high[1]),
        oxygen_max_kg=(low[2], high[2]),
        chloride_kg=chloride,
        rinse_to_limit_m3=_scale(chloride, 1e6 / CHLORIDE_LIMIT / 1000),
    )


def regolith_for_oxygen(oxygen_kg: float) -> tuple[float, float]:
    """Regolith mass [kg] whose perchlorate would release this much O2 if all of it were captured."""
    per_tonne = perchlorate(1000.0).oxygen_max_kg
    return oxygen_kg / per_tonne[1] * 1000, oxygen_kg / per_tonne[0] * 1000


def mars_head(earth_head_m: float = CHARGE_DEPTH_M, bed_m: float = BED_DEPTH_M) -> float:
    """Standing water above a free-draining bed that gives the same Darcy flux on Mars as earth_head_m on Earth.

    Flux is K * (head + bed) / bed with K proportional to g, so (head + bed) has to grow by 1 / gravity factor.
    """
    return (earth_head_m + bed_m) / gravity_factor() - bed_m


def cartridge(crew: int = 6, base: str = "early") -> Cartridge:
    """Mass balance of one bench-size cartridge: what is local, what has to come from Earth."""
    regolith = sum(kg for name, kg in BENCH_MEDIA.items() if name not in CHAR_MEDIA)
    char = sum(BENCH_MEDIA[name] for name in CHAR_MEDIA)
    chem = perchlorate(regolith)
    made = size(crew, base)
    char_per_day = (made.retort.char_dry_kg, made.char_kg_per_day)
    return Cartridge(
        regolith_kg=regolith,
        char_kg=char,
        perchlorate_g=_scale(chem.perchlorate_kg, 1000),
        acetate_g=_scale(chem.acetate_full_kg, 1000),
        chloride_g=_scale(chem.chloride_kg, 1000),
        per_day_of_char=_scale(char_per_day, 1 / char),
        earth_head_m=CHARGE_DEPTH_M,
        mars_head_m=mars_head(),
    )


@dataclass(frozen=True)
class Step:
    label: str
    formula: str
    result: str
    source: str


def explain(crew: int = 6, base: str = "early", regolith_kg: float = 1000.0) -> list[Step]:
    """The same numbers as size()/perchlorate(), as a formula-by-formula trail for --explain."""
    result = size(crew, base)
    chem = perchlorate(regolith_kg)
    g = gravity_factor()
    slow, fast = FILTRATION_RATE
    lo, hi = PERCHLORATE_FRACTION

    def rng(pair: tuple[float, float], digits: int = 4) -> str:
        return f"{pair[0]:.{digits}f} - {pair[1]:.{digits}f}"

    return [
        Step(
            "Greywater",
            f"{crew} crew x {HYGIENE_WASTEWATER[base]} kg/CM-d",
            f"{result.greywater_l_per_day:.1f} L/day",
            "NASA BVAD REV2, Table 4-21",
        ),
        Step(
            "Gravity factor",
            f"{MARS_GRAVITY} m/s2 / {EARTH_GRAVITY} m/s2",
            f"{g:.3f} (0.37 g)",
            "NASA Glenn Research Center",
        ),
        Step(
            "Filter area, Earth g",
            f"flow / {slow}-{fast} m/h",
            f"{rng(result.filter_area_m2)} m2",
            "Emergency WASH, slow sand filtration rate",
        ),
        Step(
            "Filter area, Mars g",
            "Earth-g area / gravity factor",
            f"{rng(result.filter_area_mars_m2)} m2",
            "Darcy's law: flux scales with g at a fixed head",
        ),
        Step(
            "Head for Earth flow on Mars",
            f"({CHARGE_DEPTH_M} m charge + {BED_DEPTH_M} m bed) / gravity factor - bed",
            f"{mars_head():.2f} m of standing water",
            "Darcy's law, free-draining outlet; RWL-001 charge depth",
        ),
        Step(
            "Bench columns needed",
            f"Mars-g area / column bore ({BENCH_BORE_M * 100:.1f} cm)",
            rng(result.bench_columns_mars, 1),
            "RWL-001 drawing",
        ),
        Step(
            "Trash",
            f"{crew} crew x {TRASH} kg/CM-d",
            f"{result.trash_kg_per_day:.2f} kg/day",
            "NASA BVAD REV2, Table 4-29",
        ),
        Step(
            "Char",
            f"trash x {PYROLYSABLE_FRACTION:.3f} (food+paper share) x {CHAR_YIELD} (char yield)",
            f"{result.char_kg_per_day:.2f} kg/day",
            "BVAD Table 4-28; Penn State EGEE 439",
        ),
        Step(
            "Retort feed moisture",
            "trash x sum(share x moisture) for plate waste, uneaten food, paper",
            f"{result.retort.water_kg:.2f} of {result.retort.feed_kg:.2f} kg/day",
            "BVAD Table 4-28",
        ),
        Step(
            "Char, dry basis",
            f"(feed - moisture) x {CHAR_YIELD}",
            f"{result.retort.char_dry_kg:.2f} kg/day",
            "Penn State EGEE 439",
        ),
        Step(
            "Retort heat",
            f"dry x {PYROLYSIS_ENERGY[0]}-{PYROLYSIS_ENERGY[1]} MJ/kg + water x {WATER_TO_STEAM:.2f} MJ/kg",
            f"{rng(result.retort.energy_mj, 1)} MJ/day",
            "Daugaard & Brown 2003; NIST Chemistry WebBook",
        ),
        Step(
            "Retort mean power",
            "heat / 86 400 s",
            f"{rng(result.retort.mean_power_w, 0)} W",
            "averaged over a day",
        ),
        Step(
            "Crew oxygen",
            f"{crew} crew x {CREW_OXYGEN} kg/CM-d",
            f"{result.crew_oxygen_kg_per_day:.2f} kg/day",
            "NASA BVAD REV2, Table 3-31",
        ),
        Step(
            "Perchlorate in regolith",
            f"{regolith_kg:.0f} kg x {lo:.1%}-{hi:.1%}",
            f"{rng(chem.perchlorate_kg, 1)} kg",
            "Hecht et al. 2009; Davila et al. 2013",
        ),
        Step(
            "Acetate for full reduction",
            "mol(ClO4-) x M(acetate), 1:1 stoichiometry",
            f"{rng(chem.acetate_full_kg, 1)} kg",
            "ClO4- + CH3COO- + H+ -> Cl- + 2 CO2 + 2 H2O",
        ),
        Step(
            "Chloride left in regolith",
            f"mol(ClO4-) x M(Cl) {MOLAR_MASS['Cl']}",
            f"{rng(chem.chloride_kg, 2)} kg",
            "1 Cl- per ClO4- reduced",
        ),
        Step(
            "Water to hold it at the taste limit",
            f"chloride / {CHLORIDE_LIMIT:.0f} mg/L",
            f"{rng(chem.rinse_to_limit_m3, 1)} m3",
            "US EPA secondary standard",
        ),
        Step(
            "O2 if every molecule were captured",
            "mol(ClO4-) x M(O2), upper bound only",
            f"{rng(chem.oxygen_max_kg, 1)} kg",
            "Coates & Achenbach 2004; Ettwig et al. 2012",
        ),
    ]

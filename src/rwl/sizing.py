"""Mission-scale sizing for a crew. Every constant cites its source in docs/references.md."""

from __future__ import annotations

import math
from dataclasses import asdict, dataclass

# NASA BVAD REV2, Table 4-21, total hygiene wastewater load [kg/CM-d]
HYGIENE_WASTEWATER = {"early": 5.53, "mature": 10.17}
# NASA BVAD REV2, Table 4-29, Shuttle average trash [kg/CM-d]
TRASH = 1.39
# NASA BVAD REV2, Table 4-28, plate waste + uneaten food + mixed paper, fraction of STS-51D trash mass
PYROLYSABLE_FRACTION = 0.098 + 0.247 + 0.130
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

# RWL-001: bench column bore and bed depth
BENCH_BORE_M = 0.075
BED_DEPTH_M = 0.42

MOLAR_MASS = {"ClO4": 99.45, "O2": 32.00, "acetate": 59.04}
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

    def as_dict(self) -> dict[str, object]:
        return asdict(self)


@dataclass(frozen=True)
class Perchlorate:
    regolith_kg: float
    perchlorate_kg: tuple[float, float]
    acetate_full_kg: tuple[float, float]
    oxygen_max_kg: tuple[float, float]


def _scale(pair: tuple[float, float], factor: float) -> tuple[float, float]:
    return pair[0] * factor, pair[1] * factor


def gravity_factor() -> float:
    """Darcy flux scales with g at a fixed head, so a bed on Mars passes this share of its Earth flow."""
    return MARS_GRAVITY / EARTH_GRAVITY


def bench_area() -> float:
    return math.pi * (BENCH_BORE_M / 2) ** 2


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
    )


def perchlorate(regolith_kg: float = 1000.0) -> Perchlorate:
    """Stoichiometry of full microbial reduction, ClO4- + CH3COO- + H+ -> Cl- + 2 CO2 + 2 H2O.

    The upper bound on oxygen assumes every O2 from chlorite dismutase is captured
    instead of respired, which halves the acetate needed.
    """
    if regolith_kg <= 0:
        raise ValueError("regolith mass must be positive")

    def bound(fraction: float) -> tuple[float, float, float]:
        clo4 = regolith_kg * fraction
        mol = clo4 * 1000 / MOLAR_MASS["ClO4"]
        acetate = mol * MOLAR_MASS["acetate"] / 1000
        oxygen = mol * MOLAR_MASS["O2"] / 1000
        return clo4, acetate, oxygen

    low, high = (bound(f) for f in PERCHLORATE_FRACTION)
    return Perchlorate(
        regolith_kg=regolith_kg,
        perchlorate_kg=(low[0], high[0]),
        acetate_full_kg=(low[1], high[1]),
        oxygen_max_kg=(low[2], high[2]),
    )


def regolith_for_oxygen(oxygen_kg: float) -> tuple[float, float]:
    """Regolith mass [kg] whose perchlorate would release this much O2 if all of it were captured."""
    per_tonne = perchlorate(1000.0).oxygen_max_kg
    return oxygen_kg / per_tonne[1] * 1000, oxygen_kg / per_tonne[0] * 1000

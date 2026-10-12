"""Hydraulic conductivity of the bench column from a falling-head run.

The column is its own standpipe (a = A), so the falling-head equation
k = (aL / At) ln(h1 / h2) (University of Waterloo, CIV E 353) reduces to
k = (L / t) ln(h1 / h2), with h the total head from water surface to outlet.
"""

from __future__ import annotations

import math
from collections.abc import Sequence
from dataclasses import dataclass

import numpy as np

from .sizing import BED_DEPTH_M, CHARGE_DEPTH_M, FILTRATION_RATE, bench_area, gravity_factor


@dataclass(frozen=True)
class Permeability:
    k_m_per_s: float
    k_mars_m_per_s: float
    start_head_m: float
    end_head_m: float
    flux_m_per_h: float
    r_squared: float | None = None

    @property
    def k_m_per_h(self) -> float:
        return self.k_m_per_s * 3600


def _check(outlet_drop_m: float) -> None:
    if outlet_drop_m < 0:
        raise ValueError("outlet drop is measured downward from the bed base and cannot be negative")


def falling_head(
    seconds: float,
    volume_l: float = 0.5,
    outlet_drop_m: float = 0.0,
    charge_m: float = CHARGE_DEPTH_M,
    bed_m: float = BED_DEPTH_M,
) -> Permeability:
    """k from the time a known volume takes to leave the column after a full charge."""
    _check(outlet_drop_m)
    if seconds <= 0:
        raise ValueError("time must be positive")
    fall = volume_l / 1000 / bench_area()
    if fall >= charge_m:
        raise ValueError(f"{volume_l} L drains more than the {charge_m * 1000:.0f} mm charge above the bed")
    start = charge_m + bed_m + outlet_drop_m
    end = start - fall
    k = bed_m / seconds * math.log(start / end)
    return Permeability(k, k * gravity_factor(), start, end, k * (start / bed_m) * 3600)


def falling_head_series(
    seconds: Sequence[float], levels_m: Sequence[float], outlet_drop_m: float = 0.0, bed_m: float = BED_DEPTH_M
) -> Permeability:
    """k from a logged water level above the bed: ln(h) falls linearly in time with slope -k / L."""
    _check(outlet_drop_m)
    if len(seconds) != len(levels_m) or len(seconds) < 3:
        raise ValueError("need at least 3 matching time and level readings")
    t = np.asarray(seconds, dtype=np.float64)
    heads = np.asarray(levels_m, dtype=np.float64) + bed_m + outlet_drop_m
    y = np.log(heads)
    slope, intercept = np.polyfit(t, y, 1)
    if slope >= 0:
        raise ValueError("the level is not falling")
    residual = y - (slope * t + intercept)
    spread = float(np.sum((y - y.mean()) ** 2))
    r_squared = 1.0 if spread == 0 else 1.0 - float(np.sum(residual**2)) / spread
    k = -float(slope) * bed_m
    return Permeability(
        k, k * gravity_factor(), float(heads[0]), float(heads[-1]), k * heads[0] / bed_m * 3600, r_squared
    )


def slow_sand_seconds(volume_l: float = 0.5) -> tuple[float, float]:
    """Time for volume_l to pass the bench column at the slow sand filtration rates, fast rate first."""
    slow, fast = FILTRATION_RATE
    return tuple(volume_l / 1000 / (rate / 3600 * bench_area()) for rate in (fast, slow))  # type: ignore[return-value]

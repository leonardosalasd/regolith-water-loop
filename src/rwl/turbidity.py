"""Estimates turbidity by measuring contrast loss of a background target through the sample,
normalized using a white reference patch."""

from __future__ import annotations

import math
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Sequence

import numpy as np
from PIL import Image

ROI = tuple[int, int, int, int]

_FLOOR = 1e-6


@dataclass(frozen=True)
class Reading:
    sample: str
    contrast: float
    transmittance: float

    def as_dict(self) -> dict[str, float | str]:
        return asdict(self)


@dataclass(frozen=True)
class Calibration:
    """Maps target contrast to relative concentration.

    Attenuation is close to exponential in concentration, so the fit is linear
    in log-contrast.
    """

    slope: float
    intercept: float
    r_squared: float

    def concentration(self, contrast: float) -> float:
        if self.slope == 0:
            raise ValueError("degenerate calibration: slope is zero")
        return (math.log(max(contrast, _FLOOR)) - self.intercept) / self.slope

    def as_dict(self) -> dict[str, float]:
        return asdict(self)


def load_gray(path: str | Path) -> np.ndarray:
    with Image.open(path) as image:
        return np.asarray(image.convert("L"), dtype=np.float64) / 255.0


def crop(image: np.ndarray, roi: ROI) -> np.ndarray:
    x, y, width, height = roi
    if width <= 0 or height <= 0:
        raise ValueError(f"ROI {roi} has non-positive size")
    patch = image[y : y + height, x : x + width]
    if patch.shape != (height, width):
        raise ValueError(f"ROI {roi} falls outside a {image.shape[1]}x{image.shape[0]} image")
    return patch


def contrast(patch: np.ndarray) -> float:
    """Michelson contrast taken from robust percentiles rather than min/max."""
    dark, light = np.percentile(patch, [5, 95])
    total = light + dark
    return 0.0 if total <= 0 else float((light - dark) / total)


def measure(path: str | Path, sample: str, target: ROI, white: ROI) -> Reading:
    image = load_gray(path)
    target_patch = crop(image, target)
    white_level = float(np.mean(crop(image, white)))
    if white_level <= 0:
        raise ValueError(f"{path}: white reference is black, check the ROI")
    return Reading(
        sample=sample,
        contrast=contrast(target_patch),
        transmittance=float(np.mean(target_patch)) / white_level,
    )


def fit(readings: Sequence[Reading], concentrations: Sequence[float]) -> Calibration:
    if len(readings) != len(concentrations):
        raise ValueError("readings and concentrations must have the same length")
    if len(readings) < 3:
        raise ValueError("a calibration needs at least 3 dilution levels")

    x = np.asarray(concentrations, dtype=np.float64)
    y = np.log(np.clip([r.contrast for r in readings], _FLOOR, None))

    slope, intercept = np.polyfit(x, y, 1)
    residual = y - (slope * x + intercept)
    spread = float(np.sum((y - y.mean()) ** 2))
    r_squared = 1.0 if spread == 0 else 1.0 - float(np.sum(residual**2)) / spread

    return Calibration(float(slope), float(intercept), r_squared)


def reduction(before: Reading, after: Reading, calibration: Calibration) -> float:
    """Percentage of relative concentration removed between two readings."""
    start = calibration.concentration(before.contrast)
    end = calibration.concentration(after.contrast)
    if start <= 0:
        raise ValueError("influent concentration is not positive, check the calibration range")
    return (start - end) / start * 100.0

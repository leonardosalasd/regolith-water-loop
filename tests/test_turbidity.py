import math

import numpy as np
import pytest
from PIL import Image

from rwl.turbidity import Calibration, Reading, contrast, crop, fit, measure, reduction

TARGET = (40, 40, 40, 40)
WHITE = (0, 0, 20, 20)


def checkerboard(michelson: float) -> np.ndarray:
    """40x40 checkerboard whose Michelson contrast is exactly `michelson`."""
    high = 0.5 * (1 + michelson)
    low = 0.5 * (1 - michelson)
    tile = np.indices((40, 40)).sum(axis=0) % 2
    return np.where(tile == 0, high, low)


def scene(tmp_path, name: str, michelson: float, exposure: float = 1.0):
    canvas = np.full((100, 100), 0.5)
    canvas[0:20, 0:20] = 1.0
    canvas[40:80, 40:80] = checkerboard(michelson)
    pixels = np.clip(canvas * exposure, 0, 1)
    path = tmp_path / f"{name}.png"
    Image.fromarray((pixels * 255).astype(np.uint8)).save(path)
    return path


def test_contrast_matches_construction():
    assert contrast(checkerboard(0.6)) == pytest.approx(0.6, abs=0.01)


def test_crop_rejects_out_of_bounds():
    with pytest.raises(ValueError, match="falls outside"):
        crop(np.zeros((10, 10)), (5, 5, 20, 20))


def test_measure_is_stable_across_exposure(tmp_path):
    bright = measure(scene(tmp_path, "bright", 0.5), "bright", TARGET, WHITE)
    dim = measure(scene(tmp_path, "dim", 0.5, exposure=0.6), "dim", TARGET, WHITE)

    assert bright.contrast == pytest.approx(dim.contrast, abs=0.02)
    assert bright.transmittance == pytest.approx(dim.transmittance, abs=0.02)


def test_measure_rejects_black_white_reference(tmp_path):
    canvas = np.zeros((100, 100))
    canvas[40:80, 40:80] = checkerboard(0.5)
    path = tmp_path / "black_ref.png"
    Image.fromarray((canvas * 255).astype(np.uint8)).save(path)

    with pytest.raises(ValueError, match="white reference"):
        measure(path, "black_ref", TARGET, WHITE)


def test_fit_recovers_exponential_attenuation():
    levels = [0.0, 0.25, 0.5, 0.75, 1.0]
    readings = [Reading(f"s{i}", 0.8 * math.exp(-2.0 * c), 0.5) for i, c in enumerate(levels)]

    calibration = fit(readings, levels)

    assert calibration.slope == pytest.approx(-2.0, abs=0.01)
    assert calibration.r_squared > 0.99
    assert calibration.concentration(0.8) == pytest.approx(0.0, abs=0.01)


def test_fit_needs_three_levels():
    readings = [Reading("a", 0.8, 0.5), Reading("b", 0.4, 0.5)]
    with pytest.raises(ValueError, match="at least 3"):
        fit(readings, [0.0, 1.0])


def test_reduction_between_two_readings():
    calibration = Calibration(slope=-2.0, intercept=math.log(0.8), r_squared=1.0)
    influent = Reading("in", 0.8 * math.exp(-2.0 * 1.0), 0.5)
    effluent = Reading("out", 0.8 * math.exp(-2.0 * 0.25), 0.5)

    assert reduction(influent, effluent, calibration) == pytest.approx(75.0, abs=0.5)


def test_reduction_rejects_clean_influent():
    calibration = Calibration(slope=-2.0, intercept=math.log(0.8), r_squared=1.0)
    clean = Reading("in", 0.8, 0.5)
    with pytest.raises(ValueError, match="not positive"):
        reduction(clean, clean, calibration)

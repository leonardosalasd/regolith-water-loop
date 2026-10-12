import math

import pytest

from rwl import hydraulics, sizing
from rwl.cli import main


def test_falling_head_matches_the_equation():
    result = hydraulics.falling_head(60, volume_l=0.5, outlet_drop_m=0.3)
    fall = 0.0005 / sizing.bench_area()
    start = sizing.CHARGE_DEPTH_M + sizing.BED_DEPTH_M + 0.3
    assert result.start_head_m == pytest.approx(start)
    assert result.k_m_per_s == pytest.approx(sizing.BED_DEPTH_M / 60 * math.log(start / (start - fall)))
    assert result.k_mars_m_per_s == pytest.approx(result.k_m_per_s * sizing.gravity_factor())


def test_series_recovers_k_from_an_exact_decay():
    k, bed, drop = 2e-4, sizing.BED_DEPTH_M, 0.25
    h0 = sizing.CHARGE_DEPTH_M + bed + drop
    t = [0, 20, 40, 60, 80]
    levels = [h0 * math.exp(-k / bed * s) - bed - drop for s in t]
    result = hydraulics.falling_head_series(t, levels, outlet_drop_m=drop)
    assert result.k_m_per_s == pytest.approx(k)
    assert result.r_squared == pytest.approx(1.0)


def test_slow_sand_time_for_half_a_litre():
    fast, slow = hydraulics.slow_sand_seconds(0.5)
    assert fast == pytest.approx(0.0005 / (0.4 / 3600 * sizing.bench_area()))
    assert slow == pytest.approx(4 * fast)


@pytest.mark.parametrize(
    "kwargs", [{"seconds": 0}, {"seconds": 10, "volume_l": 2.0}, {"seconds": 10, "outlet_drop_m": -0.1}]
)
def test_falling_head_rejects_bad_runs(kwargs):
    with pytest.raises(ValueError):
        hydraulics.falling_head(**kwargs)


def test_cli_permeability(tmp_path, capsys):
    assert main(["permeability", "--seconds", "30", "--outlet-drop", "0.3"]) == 0
    out = capsys.readouterr().out
    assert "hydraulic conductivity" in out and "throttle" in out
    series = tmp_path / "level.csv"
    series.write_text("seconds,level_m\n0,0.20\n10,0.15\n20,0.11\n30,0.08\n")
    assert main(["permeability", "--series", str(series)]) == 0
    assert "fit R^2" in capsys.readouterr().out

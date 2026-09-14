import pytest

from rwl import sizing
from rwl.cli import main


def test_greywater_follows_bvad_table():
    result = sizing.size(6, "early")
    assert result.greywater_l_per_day == pytest.approx(33.18)
    assert sizing.size(6, "mature").greywater_l_per_day == pytest.approx(61.02)


def test_filter_area_bounds_come_from_rates():
    result = sizing.size(6, "early")
    flow_m3_h = 33.18 / 1000 / 24
    assert result.filter_area_m2 == pytest.approx((flow_m3_h / 0.4, flow_m3_h / 0.1))


def test_mars_gravity_enlarges_the_filter():
    result = sizing.size(6, "early")
    factor = 3.7 / 9.81
    for earth, mars in zip(result.filter_area_m2, result.filter_area_mars_m2, strict=True):
        assert mars == pytest.approx(earth / factor)
        assert mars > earth


def test_char_is_a_share_of_trash():
    result = sizing.size(1, "early")
    assert result.char_kg_per_day == pytest.approx(1.39 * 0.475 * 0.25)


def test_perchlorate_stoichiometry():
    chem = sizing.perchlorate(1000)
    assert chem.perchlorate_kg == pytest.approx((4.0, 10.0))
    mol_low = 4000 / 99.45
    assert chem.acetate_full_kg[0] == pytest.approx(mol_low * 59.04 / 1000)
    assert chem.oxygen_max_kg[0] == pytest.approx(mol_low * 32.00 / 1000)


def test_regolith_for_oxygen_matches_perchlorate_bound():
    low, high = sizing.regolith_for_oxygen(sizing.perchlorate(1000).oxygen_max_kg[1])
    assert low == pytest.approx(1000)
    assert high == pytest.approx(2500)


@pytest.mark.parametrize("crew, base", [(0, "early"), (6, "orbital")])
def test_rejects_bad_inputs(crew, base):
    with pytest.raises(ValueError):
        sizing.size(crew, base)


def test_cli_prints_sizing(capsys):
    assert main(["size", "--crew", "6"]) == 0
    out = capsys.readouterr().out
    assert "33.2 L/day" in out
    assert "regolith for crew O2" in out

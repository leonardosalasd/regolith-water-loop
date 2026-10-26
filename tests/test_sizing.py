import json
from pathlib import Path

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


def test_explain_matches_size_and_perchlorate():
    steps = {step.label: step for step in sizing.explain(6, "early", 1000)}
    result = sizing.size(6, "early")
    chem = sizing.perchlorate(1000)
    assert f"{result.greywater_l_per_day:.1f} L/day" in steps["Greywater"].result
    assert f"{chem.perchlorate_kg[0]:.1f}" in steps["Perchlorate in regolith"].result
    assert all(step.source for step in steps.values())


def test_cli_explain_adds_a_formula_table(capsys):
    assert main(["size", "--explain"]) == 0
    out = capsys.readouterr().out
    assert "how each number was computed" in out
    assert "Darcy" in out


def test_cli_version():
    with pytest.raises(SystemExit) as exc:
        main(["--version"])
    assert exc.value.code == 0


def test_cli_bare_shows_info(capsys):
    assert main([]) == 0
    out = capsys.readouterr().out
    assert "Leonardo Salas" in out
    assert "size" in out and "measure" in out


def test_cli_info_command_matches_bare(capsys):
    assert main(["info"]) == 0
    out = capsys.readouterr().out
    assert "rwl <command> -h" in out


def test_retort_energy_from_dry_feed_and_moisture():
    rt = sizing.size(6, "early").retort
    assert rt.feed_kg == pytest.approx(6 * 1.39 * 0.475)
    assert rt.water_kg == pytest.approx(6 * 1.39 * (0.098 * 0.70 + 0.247 * 0.002 + 0.130 * 0.102))
    low = rt.dry_kg * 0.8 + rt.water_kg * sizing.WATER_TO_STEAM
    assert rt.energy_mj[0] == pytest.approx(low)
    assert rt.mean_power_w[0] == pytest.approx(low * 1e6 / 86400)
    assert rt.char_dry_kg < sizing.size(6, "early").char_kg_per_day


def test_chloride_is_one_per_perchlorate():
    chem = sizing.perchlorate(1000)
    assert chem.chloride_kg[0] == pytest.approx(4000 / 99.45 * 35.45 / 1000)
    assert chem.rinse_to_limit_m3[0] == pytest.approx(chem.chloride_kg[0] * 1e6 / 250 / 1000)


def test_mars_head_restores_earth_flux():
    head = sizing.mars_head()
    earth_gradient = (sizing.CHARGE_DEPTH_M + sizing.BED_DEPTH_M) / sizing.BED_DEPTH_M
    mars_gradient = (head + sizing.BED_DEPTH_M) / sizing.BED_DEPTH_M
    assert mars_gradient * sizing.MARS_GRAVITY == pytest.approx(earth_gradient * sizing.EARTH_GRAVITY)


def test_cartridge_mass_balance():
    part = sizing.cartridge(6, "early")
    assert part.regolith_kg == pytest.approx(1.464)
    assert part.char_kg == pytest.approx(0.135)
    assert part.perchlorate_g == pytest.approx((5.856, 14.64))
    assert part.per_day_of_char[0] < part.per_day_of_char[1]


def test_cli_cartridge_and_json(capsys):
    assert main(["cartridge"]) == 0
    assert "Earth" in capsys.readouterr().out
    assert main(["size", "--json"]) == 0
    payload = json.loads(capsys.readouterr().out)
    assert payload["sizing"]["retort"]["mean_power_w"][0] > 0


def test_site_constants_match_the_model():
    path = Path(__file__).resolve().parents[1] / "site" / "lib" / "sizing-constants.json"
    if not path.exists():
        pytest.skip("site not present")
    assert json.loads(path.read_text()) == json.loads(json.dumps(sizing.constants()))


@pytest.mark.parametrize("suffix", [".html", ".svg", ".txt"])
def test_cli_size_saves_tables(tmp_path, suffix, capsys):
    out = tmp_path / f"sizing{suffix}"
    assert main(["size", "--explain", "--save", str(out)]) == 0
    assert "Darcy" in out.read_text()


def test_cli_save_rejects_other_formats(tmp_path):
    with pytest.raises(SystemExit):
        main(["cartridge", "--save", str(tmp_path / "x.pdf")])

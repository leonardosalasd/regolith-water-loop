"""Command line entry point for the turbidity workflow and mission sizing."""

from __future__ import annotations

import argparse
import csv
import json
from dataclasses import asdict
from importlib.metadata import PackageNotFoundError, metadata
from importlib.metadata import version as pkg_version
from pathlib import Path

from rich.console import Console, Group
from rich.table import Table
from rich.text import Text

from . import hydraulics, sizing
from . import target as target_sheet
from .turbidity import ROI, Calibration, Reading, clipped, contrast, crop, fit, load_gray, measure, reduction

BRAND = "#f54927"

console = Console(record=True)
err_console = Console(stderr=True)

COMMANDS = {
    "target": "write the printable A4 target sheet",
    "roi": "draw the regions of interest on a photo to check them",
    "measure": "read contrast from sample photographs",
    "calibrate": "fit a dilution series",
    "report": "compare influent and effluent",
    "permeability": "hydraulic conductivity of the column from a timed run, and on Mars",
    "size": "size the system for a crew",
    "cartridge": "mass balance of one filter cartridge: local vs. from Earth",
    "info": "show this screen: what rwl does and who made it",
}


def _meta() -> tuple[str, str, dict[str, str]]:
    try:
        meta = metadata("rwl")
        urls = dict(
            entry.split(", ", 1)
            for entry in meta.get_all("Project-URL") or []  # type: ignore[union-attr]
        )
        return pkg_version("rwl"), meta["Author-email"], urls
    except PackageNotFoundError:
        return "0.0.0+local", "Leonardo Salas <leonardo.salas01@outlook.com>", {}


def _logo() -> Text:
    mark = Text("◉ · ", style=f"bold {BRAND}")
    mark.append("rwl", style="bold")
    mark.append("  Regolith Water Loop", style="dim")
    return mark


def cmd_info(_args: argparse.Namespace) -> int:
    version, author, urls = _meta()
    lines = [
        _logo(),
        Text(""),
        Text("Turbidity measurement and crew-scale sizing for a three-stage Mars water pre-treatment column."),
        Text(""),
        Text(f"version  {version}", style="dim"),
        Text(f"author   {author}", style="dim"),
    ]
    for label in ("Homepage", "Repository"):
        if label in urls:
            lines.append(Text(f"{label.lower():<8} {urls[label]}", style=f"dim {BRAND}"))

    commands = Table(title="commands", title_style=f"bold {BRAND}", border_style="dim")
    commands.add_column("command", style="bold")
    commands.add_column("does")
    for name, help_text in COMMANDS.items():
        commands.add_row(name, help_text)

    console.print(Group(*lines))
    console.print(commands)
    console.print("\nrun [bold]rwl <command> -h[/] for the options of each one, e.g. [bold]rwl size -h[/]")
    return 0


def _save(path: Path | None) -> None:
    """Write everything printed since the command started to SVG, HTML or plain text."""
    if path is None:
        console.export_text(clear=True)
        return
    if path.suffix == ".svg":
        console.save_svg(str(path), title="rwl")
    elif path.suffix == ".html":
        console.save_html(str(path))
    elif path.suffix == ".txt":
        console.save_text(str(path))
    else:
        raise SystemExit(f"--save needs a .svg, .html or .txt path, got {path.name}")
    err_console.print(f"saved to [cyan]{path}[/]")


def _load_setup(path: Path) -> tuple[ROI, ROI]:
    setup = json.loads(path.read_text())
    try:
        target = tuple(setup["target"])
        white = tuple(setup["white"])
    except KeyError as exc:
        raise SystemExit(f"{path}: missing key {exc}") from exc
    if len(target) != 4 or len(white) != 4:
        raise SystemExit(f"{path}: each ROI needs four values (x, y, width, height)")
    return target, white  # type: ignore[return-value]


def _read_readings(path: Path) -> dict[str, Reading]:
    with path.open(newline="") as handle:
        rows = list(csv.DictReader(handle))
    return {row["sample"]: Reading(row["sample"], float(row["contrast"]), float(row["transmittance"])) for row in rows}


def _write_readings(path: Path, readings: list[Reading]) -> None:
    with path.open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["sample", "contrast", "transmittance"])
        writer.writeheader()
        writer.writerows(reading.as_dict() for reading in readings)


def _warn_clipped(image: str, white: ROI) -> None:
    share = clipped(crop(load_gray(image), white))
    if share > 0.01:
        err_console.print(
            f"[yellow]warning:[/] {Path(image).name}: {share:.0%} of the white card is clipped, underexpose slightly"
        )


def cmd_measure(args: argparse.Namespace) -> int:
    target, white = _load_setup(args.setup)
    readings = []
    for image in args.images:
        readings.append(measure(image, Path(image).stem, target, white))
        _warn_clipped(image, white)
    _write_readings(args.out, readings)
    table = Table(border_style="dim")
    table.add_column("sample", style="bold")
    table.add_column("contrast", style=BRAND)
    table.add_column("transmittance", style="cyan")
    for reading in readings:
        table.add_row(reading.sample, f"{reading.contrast:.4f}", f"{reading.transmittance:.4f}")
    console.print(table)
    console.print(f"\n{len(readings)} readings written to [cyan]{args.out}[/]")
    return 0


def cmd_calibrate(args: argparse.Namespace) -> int:
    readings = _read_readings(args.readings)
    with args.levels.open(newline="") as handle:
        levels = {row["sample"]: float(row["concentration"]) for row in csv.DictReader(handle)}

    missing = sorted(set(levels) - set(readings))
    if missing:
        raise SystemExit(f"no reading for calibration samples: {', '.join(missing)}")

    ordered = sorted(levels)
    calibration = fit([readings[name] for name in ordered], [levels[name] for name in ordered])
    args.out.write_text(json.dumps(calibration.as_dict(), indent=2) + "\n")

    console.print(f"slope={calibration.slope:.4f} intercept={calibration.intercept:.4f}")
    style = "green" if calibration.r_squared >= 0.9 else "yellow"
    console.print(f"R^2=[bold {style}]{calibration.r_squared:.4f}[/]")
    if calibration.r_squared < 0.9:
        err_console.print("[yellow]warning:[/] poor fit, check lighting consistency across the series")
    console.print(f"calibration written to [cyan]{args.out}[/]")
    return 0


def cmd_report(args: argparse.Namespace) -> int:
    readings = _read_readings(args.readings)
    for name in (args.before, *args.after):
        if name not in readings:
            raise SystemExit(f"no reading named {name!r} in {args.readings}")

    calibration = Calibration(**json.loads(args.calibration.read_text()))
    before = readings[args.before]

    table = Table(title=f"removal relative to {before.sample}", title_style=f"bold {BRAND}", border_style="dim")
    table.add_column("sample", style="bold")
    table.add_column("contrast", style="cyan")
    table.add_column("relative concentration")
    table.add_column("removed", style="bold green")
    start = calibration.concentration(before.contrast)
    table.add_row(before.sample, f"{before.contrast:.4f}", f"{start:.3f}", "influent")
    for name in args.after:
        after = readings[name]
        end = calibration.concentration(after.contrast)
        removed = f"{reduction(before, after, calibration):.1f}%"
        if not calibration.in_range(end):
            removed = f"[yellow]{removed} outside calibration[/]"
        table.add_row(after.sample, f"{after.contrast:.4f}", f"{end:.3f}", removed)
    console.print(table)
    if not calibration.in_range(start):
        err_console.print("[yellow]warning:[/] the influent itself is outside the calibrated range")
    return 0


def cmd_roi(args: argparse.Namespace) -> int:
    from PIL import Image, ImageDraw, ImageOps

    target, white = _load_setup(args.setup)
    gray = load_gray(args.image)
    target_patch, white_patch = crop(gray, target), crop(gray, white)

    with Image.open(args.image) as photo:
        canvas = ImageOps.exif_transpose(photo).convert("RGB")
    draw = ImageDraw.Draw(canvas)
    width = max(2, canvas.width // 300)
    for (x, y, w, h), colour in ((target, BRAND), (white, "#22d3ee")):
        draw.rectangle((x, y, x + w, y + h), outline=colour, width=width)
    canvas.save(args.out)

    table = Table(border_style="dim", show_header=False)
    table.add_column(style="bold")
    table.add_column(style="cyan")
    table.add_row("target contrast", f"{contrast(target_patch):.4f}")
    table.add_row("white level", f"{float(white_patch.mean()):.3f}")
    table.add_row("white clipped", f"{clipped(white_patch):.1%}")
    console.print(table)
    if contrast(target_patch) < 0.05:
        err_console.print("[yellow]warning:[/] almost no contrast in the target box, is it on the checker?")
    if float(white_patch.std()) > 0.08:
        err_console.print("[yellow]warning:[/] the white box is not uniform, is it fully on the card?")
    console.print(f"boxes drawn on [cyan]{args.out}[/]: [{BRAND}]target[/], [#22d3ee]white[/]")
    return 0


def cmd_target(args: argparse.Namespace) -> int:
    path = target_sheet.write(args.out)
    console.print(f"target sheet written to [cyan]{path}[/]")
    console.print("print at 100% / actual size and check the 100 mm bar with a ruler")
    return 0


def _size_table(result: sizing.Sizing, chem: sizing.Perchlorate, oxygen_regolith: tuple[float, float]) -> Table:
    def pair(values: tuple[float, float], digits: int = 3) -> str:
        return f"{values[0]:.{digits}f} - {values[1]:.{digits}f}"

    table = Table(title=f"crew {result.crew}, {result.base} base", title_style=f"bold {BRAND}", show_header=False)
    table.add_column(style="bold")
    table.add_column(style="cyan")
    table.add_row("greywater", f"{result.greywater_l_per_day:.1f} L/day ({result.flow_l_per_h:.2f} L/h)")
    table.add_row("filter area, Earth g", f"{pair(result.filter_area_m2, 4)} m2")
    table.add_row("filter area, Mars g", f"{pair(result.filter_area_mars_m2, 4)} m2 at the same head")
    table.add_row("bench columns, Mars g", pair(result.bench_columns_mars, 1))
    table.add_row("bed volume, Mars g", f"{pair(result.bed_volume_m3, 4)} m3")
    table.add_row("trash", f"{result.trash_kg_per_day:.2f} kg/day")
    table.add_row("char", f"{result.retort.char_dry_kg:.2f} dry basis, {result.char_kg_per_day:.2f} upper, kg/day")
    table.add_row(
        "retort heat", f"{pair(result.retort.energy_mj, 1)} MJ/day, {pair(result.retort.mean_power_w, 0)} W mean"
    )
    table.add_row("", "")
    table.add_row(f"per {chem.regolith_kg:.0f} kg regolith", "", style="dim")
    table.add_row("perchlorate", f"{pair(chem.perchlorate_kg, 1)} kg")
    table.add_row("acetate, full reduction", f"{pair(chem.acetate_full_kg, 1)} kg")
    table.add_row("chloride left behind", f"{pair(chem.chloride_kg, 2)} kg")
    table.add_row("O2 if all captured", f"{pair(chem.oxygen_max_kg, 1)} kg")
    table.add_row(
        "regolith for crew O2",
        f"{oxygen_regolith[0] / 1000:.1f} - {oxygen_regolith[1] / 1000:.1f} t/day "
        f"to cover {result.crew_oxygen_kg_per_day:.2f} kg O2",
    )
    return table


def cmd_size(args: argparse.Namespace) -> int:
    console.export_text(clear=True)
    try:
        result = sizing.size(args.crew, args.base)
        chem = sizing.perchlorate(args.regolith)
    except ValueError as exc:
        raise SystemExit(str(exc)) from exc
    oxygen_regolith = sizing.regolith_for_oxygen(result.crew_oxygen_kg_per_day)

    if args.json:
        payload = {"sizing": result.as_dict(), "perchlorate": asdict(chem), "regolith_for_crew_o2_kg": oxygen_regolith}
        print(json.dumps(payload, indent=2))
        return 0

    console.print(_size_table(result, chem, oxygen_regolith))

    if args.explain:
        steps = Table(title="how each number was computed", title_style=f"bold {BRAND}", border_style="dim")
        steps.add_column("quantity", style="bold")
        steps.add_column("formula")
        steps.add_column("result", style="bold green")
        steps.add_column("source", style="cyan")
        for step in sizing.explain(args.crew, args.base, args.regolith):
            steps.add_row(step.label, step.formula, step.result, step.source)
        console.print(steps)

    _save(args.save)
    return 0


def cmd_cartridge(args: argparse.Namespace) -> int:
    console.export_text(clear=True)
    try:
        part = sizing.cartridge(args.crew, args.base)
    except ValueError as exc:
        raise SystemExit(str(exc)) from exc

    if args.json:
        print(json.dumps(asdict(part), indent=2))
        return 0

    def pair(values: tuple[float, float], digits: int = 1) -> str:
        return f"{values[0]:.{digits}f} - {values[1]:.{digits}f}"

    table = Table(title="one bench-size cartridge (RWL-001)", title_style=f"bold {BRAND}", border_style="dim")
    table.add_column("item", style="bold")
    table.add_column("amount", style="cyan")
    table.add_column("comes from")
    table.add_row("regolith, treated", f"{part.regolith_kg:.2f} kg", "[green]Mars[/], Stage 1")
    table.add_row("char", f"{part.char_kg:.2f} kg", "[green]Mars[/], Stage 3 trash")
    table.add_row(
        "acetate to detoxify it", f"{pair(part.acetate_g)} g", f"[{BRAND}]Earth[/], until a waste donor works"
    )
    table.add_row("cartridge shell", "1", f"[{BRAND}]Earth[/], refilled on site")
    table.add_row("", "")
    table.add_row("perchlorate removed", f"{pair(part.perchlorate_g)} g", "")
    table.add_row("chloride left to rinse", f"{pair(part.chloride_g)} g", "brine processor")
    table.add_row(
        "cartridges of char per day",
        pair(part.per_day_of_char),
        f"crew {args.crew}, {args.base} base",
    )
    table.add_row("", "")
    table.add_row("standing water, Earth", f"{part.earth_head_m:.2f} m", "RWL-001 charge")
    table.add_row("same flow at 0.37 g", f"{part.mars_head_m:.2f} m", "or more cartridges in parallel")
    console.print(table)
    console.print("[dim]media masses are the RWL-001 schedule, every mineral layer counted as regolith[/]")
    _save(args.save)
    return 0


def cmd_permeability(args: argparse.Namespace) -> int:
    try:
        if args.series:
            with args.series.open(newline="") as handle:
                rows = list(csv.DictReader(handle))
            result = hydraulics.falling_head_series(
                [float(r["seconds"]) for r in rows], [float(r["level_m"]) for r in rows], args.outlet_drop
            )
        elif args.seconds:
            result = hydraulics.falling_head(args.seconds, args.volume, args.outlet_drop)
        else:
            raise SystemExit("give --seconds for a timed volume, or --series for a logged level")
    except ValueError as exc:
        raise SystemExit(str(exc)) from exc

    fast, slow = hydraulics.slow_sand_seconds(args.volume)
    table = Table(title="falling-head run", title_style=f"bold {BRAND}", show_header=False, border_style="dim")
    table.add_column(style="bold")
    table.add_column(style="cyan")
    table.add_row("total head, start to end", f"{result.start_head_m:.3f} -> {result.end_head_m:.3f} m")
    if result.r_squared is not None:
        table.add_row("fit R^2", f"{result.r_squared:.4f}")
    table.add_row("hydraulic conductivity", f"{result.k_m_per_s:.2e} m/s ({result.k_m_per_h:.2f} m/h)")
    table.add_row("same bed at 0.37 g", f"[{BRAND}]{result.k_mars_m_per_s:.2e} m/s[/]")
    table.add_row("flux at the start", f"{result.flux_m_per_h:.2f} m/h")
    table.add_row(
        "slow sand rate, 0.4 - 0.1 m/h",
        f"{args.volume * 1000:.0f} ml in {fast / 60:.0f} - {slow / 60:.0f} min",
    )
    console.print(table)
    if result.flux_m_per_h > sizing.FILTRATION_RATE[1]:
        console.print(
            f"[yellow]faster than slow sand filtration:[/] throttle the valve until "
            f"{args.volume * 1000:.0f} ml takes at least {fast / 60:.0f} min"
        )
    console.print("[dim]k assumes a saturated bed and a free outlet; hose and valve losses are lumped into it[/]")
    return 0


def build_parser() -> argparse.ArgumentParser:
    version, _, _ = _meta()
    parser = argparse.ArgumentParser(prog="rwl", description="Turbidity from photographs and mission sizing")
    parser.add_argument("--version", action="version", version=f"rwl {version}")
    subcommands = parser.add_subparsers(dest="command")

    measure_cmd = subcommands.add_parser(
        "measure",
        help=COMMANDS["measure"],
        description="Read target/white contrast off each photograph and write a readings CSV.",
        epilog="example: rwl measure photos/*.jpg --setup setup.json --out readings.csv",
    )
    measure_cmd.add_argument("images", nargs="+")
    measure_cmd.add_argument("--setup", type=Path, required=True, help="JSON file with target and white ROIs")
    measure_cmd.add_argument("--out", type=Path, default=Path("readings.csv"))
    measure_cmd.set_defaults(func=cmd_measure)

    calibrate_cmd = subcommands.add_parser(
        "calibrate",
        help=COMMANDS["calibrate"],
        description="Fit contrast vs. known concentration to a log-linear curve.",
        epilog="example: rwl calibrate --readings readings.csv --levels levels.csv --out calibration.json",
    )
    calibrate_cmd.add_argument("--readings", type=Path, required=True)
    calibrate_cmd.add_argument("--levels", type=Path, required=True, help="CSV of sample,concentration")
    calibrate_cmd.add_argument("--out", type=Path, default=Path("calibration.json"))
    calibrate_cmd.set_defaults(func=cmd_calibrate)

    report_cmd = subcommands.add_parser(
        "report",
        help=COMMANDS["report"],
        description="Turn influent and effluent readings into removal percentages, flagging any outside the "
        "calibrated range.",
        epilog="example: rwl report --readings run.csv --calibration calibration.json "
        "--before influent --after charge1 charge2 charge3",
    )
    report_cmd.add_argument("--readings", type=Path, required=True)
    report_cmd.add_argument("--calibration", type=Path, required=True)
    report_cmd.add_argument("--before", required=True)
    report_cmd.add_argument("--after", required=True, nargs="+", help="one or more effluent samples, in order")
    report_cmd.set_defaults(func=cmd_report)

    roi_cmd = subcommands.add_parser(
        "roi",
        help=COMMANDS["roi"],
        description="Draw the target and white regions from setup.json on a photograph and check them.",
        epilog="example: rwl roi photos/cal0.jpg --setup setup.json --out roi-check.png",
    )
    roi_cmd.add_argument("image", type=Path)
    roi_cmd.add_argument("--setup", type=Path, required=True)
    roi_cmd.add_argument("--out", type=Path, default=Path("roi-check.png"))
    roi_cmd.set_defaults(func=cmd_roi)

    target_cmd = subcommands.add_parser(
        "target",
        help=COMMANDS["target"],
        description="Write the printable A4 checker + white card target sheet.",
        epilog="example: rwl target --out target-sheet.pdf",
    )
    target_cmd.add_argument("--out", type=Path, default=Path("target-sheet.pdf"))
    target_cmd.set_defaults(func=cmd_target)

    perm_cmd = subcommands.add_parser(
        "permeability",
        help=COMMANDS["permeability"],
        description="Falling-head hydraulic conductivity of the bench column, from the time a volume takes "
        "to drain after a full charge (the run protocol's flow-rate step) or from a logged water level.",
        epilog="example: rwl permeability --seconds 45 --outlet-drop 0.30",
    )
    perm_cmd.add_argument("--seconds", type=float, help="time for --volume to leave the column")
    perm_cmd.add_argument("--volume", type=float, default=0.5, help="volume collected, in litres (default 0.5)")
    perm_cmd.add_argument(
        "--outlet-drop", type=float, default=0.0, help="height from the bed base down to the hose outlet, in metres"
    )
    perm_cmd.add_argument("--series", type=Path, help="CSV of seconds,level_m: water level above the bed over time")
    perm_cmd.set_defaults(func=cmd_permeability)

    size_cmd = subcommands.add_parser(
        "size",
        help=COMMANDS["size"],
        description="Size the three-stage system for a crew, with Mars-gravity filtration area and "
        "perchlorate/acetate/oxygen stoichiometry.",
        epilog="example: rwl size --crew 6 --base early --explain --save sizing.html",
    )
    size_cmd.add_argument("--crew", type=int, default=6)
    size_cmd.add_argument("--base", choices=sorted(sizing.HYGIENE_WASTEWATER), default="early")
    size_cmd.add_argument("--regolith", type=float, default=1000.0, help="regolith mass in kg")
    size_cmd.add_argument("--explain", action="store_true", help="show the formula and source behind each number")
    size_cmd.add_argument("--json", action="store_true", help="print raw numbers as JSON")
    size_cmd.add_argument("--save", type=Path, help="also save the tables as .svg, .html or .txt, e.g. for printing")
    size_cmd.set_defaults(func=cmd_size)

    cartridge_cmd = subcommands.add_parser(
        "cartridge",
        help=COMMANDS["cartridge"],
        description="Mass balance of one bench-size cartridge: what Mars supplies, what Earth supplies, "
        "and the head needed for Earth flow at 0.37 g.",
        epilog="example: rwl cartridge --crew 6",
    )
    cartridge_cmd.add_argument("--crew", type=int, default=6)
    cartridge_cmd.add_argument("--base", choices=sorted(sizing.HYGIENE_WASTEWATER), default="early")
    cartridge_cmd.add_argument("--json", action="store_true", help="print raw numbers as JSON")
    cartridge_cmd.add_argument("--save", type=Path, help="also save the table as .svg, .html or .txt")
    cartridge_cmd.set_defaults(func=cmd_cartridge)

    info_cmd = subcommands.add_parser("info", help=COMMANDS["info"])
    info_cmd.set_defaults(func=cmd_info)

    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    if args.command is None:
        return cmd_info(args)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())

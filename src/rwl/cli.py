"""Command line entry point for the turbidity workflow."""

from __future__ import annotations

import argparse
import csv
import json
import sys
from pathlib import Path

from .turbidity import ROI, Calibration, Reading, fit, measure, reduction


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
    return {
        row["sample"]: Reading(row["sample"], float(row["contrast"]), float(row["transmittance"]))
        for row in rows
    }


def _write_readings(path: Path, readings: list[Reading]) -> None:
    with path.open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["sample", "contrast", "transmittance"])
        writer.writeheader()
        writer.writerows(reading.as_dict() for reading in readings)


def cmd_measure(args: argparse.Namespace) -> int:
    target, white = _load_setup(args.setup)
    readings = [measure(image, Path(image).stem, target, white) for image in args.images]
    _write_readings(args.out, readings)
    for reading in readings:
        print(f"{reading.sample}\tcontrast={reading.contrast:.4f}\tT={reading.transmittance:.4f}")
    print(f"\n{len(readings)} readings written to {args.out}")
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

    print(f"slope={calibration.slope:.4f} intercept={calibration.intercept:.4f}")
    print(f"R^2={calibration.r_squared:.4f}")
    if calibration.r_squared < 0.9:
        print("warning: poor fit, check lighting consistency across the series", file=sys.stderr)
    print(f"calibration written to {args.out}")
    return 0


def cmd_report(args: argparse.Namespace) -> int:
    readings = _read_readings(args.readings)
    for name in (args.before, args.after):
        if name not in readings:
            raise SystemExit(f"no reading named {name!r} in {args.readings}")

    calibration = Calibration(**json.loads(args.calibration.read_text()))
    before, after = readings[args.before], readings[args.after]
    removed = reduction(before, after, calibration)

    print(f"influent  {before.sample}\tcontrast={before.contrast:.4f}")
    print(f"effluent  {after.sample}\tcontrast={after.contrast:.4f}")
    print(f"turbidity removed: {removed:.1f}%")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="rwl", description="Turbidity measurement from photographs")
    subcommands = parser.add_subparsers(dest="command", required=True)

    measure_cmd = subcommands.add_parser("measure", help="read contrast from sample photographs")
    measure_cmd.add_argument("images", nargs="+")
    measure_cmd.add_argument("--setup", type=Path, required=True, help="JSON file with target and white ROIs")
    measure_cmd.add_argument("--out", type=Path, default=Path("readings.csv"))
    measure_cmd.set_defaults(func=cmd_measure)

    calibrate_cmd = subcommands.add_parser("calibrate", help="fit a dilution series")
    calibrate_cmd.add_argument("--readings", type=Path, required=True)
    calibrate_cmd.add_argument("--levels", type=Path, required=True, help="CSV of sample,concentration")
    calibrate_cmd.add_argument("--out", type=Path, default=Path("calibration.json"))
    calibrate_cmd.set_defaults(func=cmd_calibrate)

    report_cmd = subcommands.add_parser("report", help="compare influent and effluent")
    report_cmd.add_argument("--readings", type=Path, required=True)
    report_cmd.add_argument("--calibration", type=Path, required=True)
    report_cmd.add_argument("--before", required=True)
    report_cmd.add_argument("--after", required=True)
    report_cmd.set_defaults(func=cmd_report)

    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())

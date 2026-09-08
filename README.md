<div align="center">

<img src="./public/logo.svg" width="100" alt="Regolith Water Loop Logo">

# **Regolith Water Loop**

Three-stage water pre-treatment column for a Mars habitat: bioremediated regolith, pyrolysis biochar, and live sensor telemetry. Bench-built and measured.

[**Leonardo Salas**](mailto:leonardo.salas01@outlook.com)

</div>

---

> [!CAUTION]
> **This is not a drinking water system.**
> This column is a pre-treatment stage. It reduces turbidity, suspended solids and part of the chemical load. It does **not** remove bacteria, viruses or parasites, and it does **not** make water safe to drink. Water leaving this column still requires proper disinfection.

---

## What this is

A Mars habitat has to detoxify its own soil, handle the waste its crew produces every day, and recycle water. Solved separately those are three problems.
Solved together they are one machine, where the furnace that processes waste also keeps the bioreactor warm and fed, and both of them produce the material the filter is made of.

This repository holds the design, the bench build, and the code that measures whether it works.

- [docs/system.md](docs/system.md) — the three stages and how they depend on each other
- [docs/method.md](docs/method.md) — how turbidity is measured from photographs
- [GLOSSARY.md](GLOSSARY.md) — terms used throughout

## Status

Bench build in progress. The measurement toolchain is working and tested; build documentation lands once the column is assembled and photographed.

## Measuring turbidity

Removal is measured from photographs rather than an electronic probe: a phone camera is available and free, a nephelometer is not. Results are relative to the influent, not traceable to a turbidity standard.

```bash
pip install -e .

rwl measure photos/*.png --setup setup.json --out readings.csv
rwl calibrate --readings readings.csv --levels levels.csv --out calibration.json
rwl report --readings readings.csv --calibration calibration.json \
    --before influent --after effluent
```

Read [docs/method.md](docs/method.md) before shooting a session. The rig has to stay fixed or the series is void.

## Development

```bash
pip install -e '.[dev]'
pytest
```

## Share the repo

Share directly via URL or scan the QR code: <br>
[https://github.com/leonardosalasd/regolith-water-loop](https://github.com/leonardosalasd/regolith-water-loop)

<div align="center">

<img src="./public/qr/qr_bg_black.png" width="260" alt="QR Code">

</div>

---

## License

I want this project to be open and accessible, so I'm splitting the licensing depending on what you're using:

* **Source Code:** All software and code in this repository are licensed under the [**MIT License**](./LICENSE). Feel free to use, modify, and build upon it.
* **Documentation, Guides & Media:** All documentation, build guides, diagrams, schematics, and photographs are licensed under the [**Creative Commons Attribution 4.0 International License (CC BY 4.0)**](./LICENSE-DOCS). 

You are free to share and adapt this material as long as you give appropriate credit to the project.

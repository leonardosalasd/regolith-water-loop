<div align="center">

<img src="./public/logo.svg" width="100" alt="Regolith Water Loop Logo">

# **Regolith Water Loop**

Three-stage water pre-treatment column: bioremediated regolith, pyrolysis biochar, and a gravity feed. Bench-built and measured.

[**Leonardo Salas**](mailto:leonardo.salas01@outlook.com) · [rwl.leonardosalas.dev](https://rwl.leonardosalas.dev)

<br>

<a href="https://github.com/sponsors/leonardosalasd">
  <img src="https://img.shields.io/badge/Sponsor%20this%20project-%E2%9D%A4-F54927?style=for-the-badge&logo=githubsponsors&logoColor=white" alt="Sponsor Regolith Water Loop on GitHub Sponsors" height="34"/>
</a>

<sub>Built and documented in the open by one person. Sponsorship keeps it that way.</sub>

</div>

---

> [!CAUTION]
> **This is not a drinking water system.**
> This column is a pre-treatment stage. It reduces turbidity, suspended solids and part of the chemical load. It does **not** remove bacteria, viruses or parasites, and it does **not** make water safe to drink. Water leaving this column still requires proper disinfection.

---

## What this is

A habitat has to detoxify its own soil, handle the waste it produces every day, and recycle water. Solved separately those are three problems. Solved together they are one machine, where the furnace that processes waste also keeps the bioreactor warm and fed, and both of them produce the material the filter is made of.

This repository holds the design, the bench build, and the code that measures whether it works.

| | |
| --- | --- |
| [docs/system.md](docs/system.md) | The three stages and how they depend on each other |
| [docs/mars.md](docs/mars.md) | Mars conditions, sizing for six crew and habitat requirements |
| [docs/method.md](docs/method.md) | How turbidity is measured from photographs |
| [docs/protocol.md](docs/protocol.md) | Greywater recipe, grading, calibration and run procedure |
| [docs/build.md](docs/build.md) | Build log with photographs and measured volumes |
| [docs/print/target-sheet.pdf](docs/print/target-sheet.pdf) | Printable checker target and white card for the rig |
| [docs/drawings/](docs/drawings/) | Bench drawings RWL-001 and RWL-002, system schematics RWL-003 and RWL-004 |
| [docs/references.md](docs/references.md) | Every source, checked against the claim it supports |
| [GLOSSARY.md](GLOSSARY.md) | Terms used throughout |

Stage 2, the filtration column, is the stage built and measured on the bench. Stages 1 and 3 are supported by published work. Perchlorate salts are strong oxidisers and are not handled in this project.

---

## Measuring turbidity

Removal is measured from photographs rather than an electronic probe: a phone camera is available and free, a nephelometer is not. A printed target behind the sample loses contrast as suspended solids rise, and a white card in frame cancels exposure differences between shots.

Results are relative to the influent, never reported in NTU.

```bash
pip install -e .

rwl measure photos/*.jpg --setup setup.json --out readings.csv
rwl calibrate --readings readings.csv --levels levels.csv --out calibration.json
rwl report --readings readings.csv --calibration calibration.json \
    --before influent --after effluent
```

Read [docs/method.md](docs/method.md) before shooting a session. The rig has to stay fixed or the series is void.

### Sizing

```bash
rwl size --crew 6 --base early
```

Greywater, filter area under Mars gravity, char output and perchlorate stoichiometry for a crew. Every constant is cited in [src/rwl/sizing.py](src/rwl/sizing.py).

### Development

```bash
pip install -e '.[dev]'
pytest
```

---

## Documentation site

A static site under [`site/`](site/), English at the root and Spanish under `/es/`.

```bash
pnpm install --dir site
pnpm --dir site dev # development
pnpm --dir site build # static export into site/out/
```

---

## Building the PDF

The whole technical document is assembled from these Markdown files and the SVG drawings with [doc-engine-cli](https://github.com/leonardosalasd/doc-engine-cli).
[`doc-engine.md`](doc-engine.md) is the manifest.

```bash
pipx install doc-engine-cli
doc-engine build doc-engine.md
```

---

## Docker

```bash
docker compose up site # site on http://localhost:8080
docker compose run --rm rwl --help
```

---

## Share this project

Share the link directly or scan the code:
[rwl.leonardosalas.dev](https://rwl.leonardosalas.dev)

<div align="center">

<img src="./public/qr/qr2_bg_black.png" width="260" alt="QR code linking to the project">

</div>

---

## Support

If this is useful to you, [sponsorship on GitHub](https://github.com/sponsors/leonardosalasd)
funds the parts, the materials and the time that go into documenting it properly.

---

## License

Licensing is split by what you are using:

* **Source code** — [MIT](./LICENSE). Use, modify and build on it freely.
* **Documentation, guides and media** — [CC BY 4.0](./LICENSE-DOCS). Share and adapt with credit.

<div align="center">

# Contributing to Regolith Water Loop

Thanks for your interest in the project. Since I maintain this repository independently, please keep contributions focused, documented, and reproducible.

</div>

## Scope of Contributions

I welcome contributions in the following areas:
* **Code:** Improvements to the Python toolchain (`rwl` CLI, photometric processing, test coverage).
* **Hardware & Rig Design:** Enhancements to the column mechanics, drawings, or the physical photometric setup.
* **Documentation & Data:** Typo fixes, clarity improvements to protocols, or independent bench replication data.

## Reporting Issues

Before opening an issue:
1. Search existing issues to ensure it has not already been reported.
2. If reporting a measurement or test discrepancy, include the raw `readings.csv`, `levels.csv`, camera model, and lighting environment details.
3. For software bugs, include your OS, Python version, and reproduction steps with error traces.

## Code Contributions

1. Fork the repository and create a branch for your feature or fix.
2. Install the package in editable mode with development dependencies:
   ```bash
   pip install -e '.[dev]'
   ```
3. Run the test suite to verify your baseline environment:
   ```bash
   pytest
   ```
4. Write clean, tested code. If you modify processing logic in `rwl`, add or update the corresponding tests under `tests/`.
5. Submit a concise Pull Request describing what changed and why.

## Experimental & Documentation Contributions

* **Physical protocols:** Changes to `docs/method.md` or the run protocol must prioritize repeatability. Do not suggest changes that break comparative continuity across measurement sessions without empirical justification.
* **Licensing:** All submitted code falls under the [MIT License](./LICENSE). All documentation, figures, and media fall under [CC BY 4.0](./LICENSE-DOCS). By opening a PR, you agree to these terms.

## Questions

For private inquiries or data-sharing too large for GitHub issues:  
**Leonardo Salas** — [leonardo.salas01@outlook.com](mailto:leonardo.salas01@outlook.com)
<div align="center">

# Run protocol

Everything below is done in one session. Splitting a session across two days invalidates the calibration, because the light will not be the same.

Drawings: [RWL-001 column](drawings/column-section.svg) ·
[RWL-002 rig](drawings/photometric-rig.svg)

</div>

## Synthetic greywater

Stock, 5 litres. Enough for a calibration series and three column charges.

| Component | Quantity | Purpose |
| --- | --- | --- |
| Tap water | 5 L | — |
| Fine soil, sieved through the #100 mesh | 15 g | suspended solids |
| Neutral liquid soap | 5 ml | surfactant load |
| Blue food colouring | 20 drops | adsorption tracer |

Mix, then stir again immediately before drawing every sample. Solids settle in minutes and a settled stock reads as clean water.

**Check before going further:** with the jar full of undiluted stock, the target card behind it must still be faintly visible. If the target disappears completely the contrast measurement saturates and the calibration is worthless. Too opaque, add water; too clear, add soil in 5 g steps.

Write down whatever you end up with. The absolute values do not matter, repeatability across the session does.

## Before the first run

1. Grade the scoria. Keep a fine and a coarse fraction, weigh both, record the
   yield from the raw mass. See [grading](#grading-the-scoria) below.
2. Load the column bottom up per RWL-001. Level each layer, geotextile disc between layers.
3. Wash the bed with clean water until the effluent runs clear. New media sheds fines and will otherwise read as if the column is making water dirtier.
4. Build the rig per RWL-002. Take one frame, read the target and white ROIs off it, write `setup.json`.

## Grading the scoria

Laboratory sieves give the cleanest result, but they are not required. Whatever method is used, report it plainly and give the measured numbers rather than a nominal mesh size.

**With laboratory sieves.** Standard stack, keep the 0.4–0.8 mm and 4–8 mm fractions, report D10 and the uniformity coefficient.

**With kitchen sieves.** Use three sieves of different fineness. Measure the aperture of each by counting wires per centimetre under good light and dividing, then report the fractions by that measured aperture. Less precise, still traceable to a number you actually measured.

**By sedimentation.** No equipment at all. Crush the scoria, put it in a tall transparent bottle of water, shake, and let it settle. Coarse grains reach the bottom first and fines last, so decanting at timed intervals separates the fractions. This is settling-velocity separation, the same principle as the hydrometer analysis used in soil mechanics.

Record the settling times and the mass recovered in each fraction. Two runs of the same procedure should give similar masses; if they do not, the crushing was inconsistent.

## Calibration series

Five levels, 200 ml each, measured in the graduated cylinder.

| Sample | Stock | Clean water |
| --- | --- | --- |
| `cal0` | 0 ml | 200 ml |
| `cal1` | 50 ml | 150 ml |
| `cal2` | 100 ml | 100 ml |
| `cal3` | 150 ml | 50 ml |
| `cal4` | 200 ml | 0 ml |

Photograph each in the same jar, washing and drying it between levels. Then:

```bash
rwl measure photos/cal*.jpg --setup setup.json --out readings.csv
rwl calibrate --readings readings.csv --levels levels.csv --out calibration.json
```

R² below 0.9 means the light drifted. Reshoot the series; do not continue.

## The run

1. Stir the stock. Fill the jar, photograph it as `influent`.
2. Close the valve. Pour 884 ml of stock into the column.
3. Open the valve and start the timer.
4. Collect the effluent in the graduated cylinder. Record the time to pass 500 ml — that is the flow rate.
5. Fill the jar from the effluent, photograph as `effluent`.
6. Process:

```bash
rwl measure photos/influent.jpg photos/effluent.jpg --setup setup.json --out run.csv
rwl report --readings run.csv --calibration calibration.json \
    --before influent --after effluent
```

Run at least three charges. The first will read best and then removal drops as the bed loads; that curve is the useful result, not the single first number.

## What to record

Written down at the time, not reconstructed later.

- Mass of each medium as placed, and the graded yield from the raw scoria
- D10 and uniformity coefficient of the fine fraction
- The greywater recipe actually used
- Flow rate per charge
- Removal percentage per charge
- Room temperature

## Photographs to take anyway

Independent of the measurement, these are needed for the project record.

- Every stage of the build, including the versions that did not work
- The graded fractions side by side after sieving
- The five calibration jars lined up as a gradient
- Influent and effluent jars side by side
- The column running, from the side, with the layers visible

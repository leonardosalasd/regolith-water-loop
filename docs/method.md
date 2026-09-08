# Turbidity measurement

The column is evaluated by how much suspended load it removes. This project measures that from photographs instead of an electronic probe: a phone camera is available, calibrated, and costs nothing, while a nephelometer is not.

The reading is **relative**, not NTU. Every result is expressed as a percentage of the influent, which is the number that matters for a pre-treatment stage.

## Principle

A vessel of water sits in front of a printed high-contrast target. Suspended solids scatter light, so the target seen through the sample loses contrast as turbidity rises. Contrast falls roughly exponentially with concentration, so the calibration is fitted linearly in log-contrast.

A white card in the same frame cancels exposure and white balance differences between shots. Without it, a cloudier photo and a darker room look identical.

## Rig

Fixed for every photograph in a session. If any of it moves, the series is void.

- Vessel: same glass or jar, same fill level, for all samples
- Target: checkerboard or black square printed on white, taped behind the vessel
- White card: plain white paper in frame, never shadowed by the vessel
- Camera: fixed position, manual exposure and focus if the phone allows it
- Light: one constant source, no windows, no flash

Record the target and white regions once as pixel coordinates:

```json
{
  "target": [820, 540, 300, 300],
  "white": [180, 160, 120, 120]
}
```

Both are `[x, y, width, height]`. Read them off one photograph in any image editor and reuse the file for the whole session.

## Procedure

**1. Build a dilution series.** Take the synthetic greywater as the stock at concentration 1.0 and dilute with clean water to 0.75, 0.5, 0.25 and 0.0. Photograph each. Five levels is the minimum that gives a usable fit.

**2. Photograph the run.** One shot of the influent before it enters the column, one of the effluent that comes out.

**3. Process.**

```bash
rwl measure photos/*.png --setup setup.json --out readings.csv
rwl calibrate --readings readings.csv --levels levels.csv --out calibration.json
rwl report --readings readings.csv --calibration calibration.json \
    --before influent --after effluent
```

`levels.csv` maps the calibration photographs to their concentrations:

```csv
sample,concentration
cal0,0.0
cal1,0.25
cal2,0.5
cal3,0.75
cal4,1.0
```

The calibration prints an R². Below 0.9 the lighting drifted during the series and the photographs have to be retaken.

## Synthetic greywater

Mixed to a written recipe so runs are comparable. Record the exact quantities used; the absolute values do not matter, repeatability does.

- Water
- Fine soil or clay, sieved, for suspended solids
- Neutral soap for surfactant load
- Food colouring as a visual tracer

## Limitations

- Relative to the stock, not traceable to a turbidity standard. Do not report the output as NTU.
- Only measures suspended load. Dissolved contaminants that do not scatter light are invisible to this method.
- Saturated highlights break the contrast estimate. Underexpose slightly rather than clipping the white card.
- Valid within the calibrated range. An effluent clearer than the 0.0 level extrapolates and should be reported as "below the lowest calibration point".

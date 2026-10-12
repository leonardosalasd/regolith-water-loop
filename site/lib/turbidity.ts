export type Roi = [number, number, number, number];

export type Gray = { width: number; height: number; data: Uint8Array };

export type Reading = { sample: string; contrast: number; transmittance: number; clipped: number };

export type Calibration = {
  slope: number;
  intercept: number;
  r_squared: number;
  lowest: number;
  highest: number;
};

const FLOOR = 1e-6;

/** Same integer weights as Pillow's RGB to L conversion, so readings match the rwl package. */
export function toGray(image: ImageData): Gray {
  const { width, height, data } = image;
  const out = new Uint8Array(width * height);
  for (let i = 0; i < out.length; i++) {
    out[i] = (data[i * 4] * 19595 + data[i * 4 + 1] * 38470 + data[i * 4 + 2] * 7471 + 0x8000) >> 16;
  }
  return { width, height, data: out };
}

export function crop(image: Gray, [x, y, w, h]: Roi): Float64Array {
  if (w <= 0 || h <= 0) throw new Error("region has non-positive size");
  if (x < 0 || y < 0 || x + w > image.width || y + h > image.height) {
    throw new Error(`region falls outside a ${image.width}×${image.height} image`);
  }
  const out = new Float64Array(w * h);
  for (let row = 0; row < h; row++) {
    const start = (y + row) * image.width + x;
    for (let col = 0; col < w; col++) out[row * w + col] = image.data[start + col] / 255;
  }
  return out;
}

function percentile(sorted: Float64Array, q: number): number {
  const pos = (sorted.length - 1) * q;
  const low = Math.floor(pos);
  const high = Math.ceil(pos);
  return sorted[low] + (sorted[high] - sorted[low]) * (pos - low);
}

const mean = (values: ArrayLike<number>) => {
  let sum = 0;
  for (let i = 0; i < values.length; i++) sum += values[i];
  return sum / values.length;
};

export function contrast(patch: Float64Array): number {
  const sorted = Float64Array.from(patch).sort();
  const dark = percentile(sorted, 0.05);
  const light = percentile(sorted, 0.95);
  const total = light + dark;
  return total <= 0 ? 0 : (light - dark) / total;
}

export function clipped(patch: Float64Array, level = 254 / 255): number {
  let count = 0;
  for (const v of patch) if (v >= level) count++;
  return count / patch.length;
}

export function measure(image: Gray, sample: string, target: Roi, white: Roi): Reading {
  const targetPatch = crop(image, target);
  const whitePatch = crop(image, white);
  const whiteLevel = mean(whitePatch);
  if (whiteLevel <= 0) throw new Error(`${sample}: white reference is black, check the region`);
  return {
    sample,
    contrast: contrast(targetPatch),
    transmittance: mean(targetPatch) / whiteLevel,
    clipped: clipped(whitePatch),
  };
}

export function fit(readings: Reading[], levels: number[]): Calibration {
  if (readings.length !== levels.length) throw new Error("readings and levels differ in length");
  if (readings.length < 3) throw new Error("a calibration needs at least 3 dilution levels");
  const x = levels;
  const y = readings.map((r) => Math.log(Math.max(r.contrast, FLOOR)));
  const mx = mean(x);
  const my = mean(y);
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < x.length; i++) {
    sxy += (x[i] - mx) * (y[i] - my);
    sxx += (x[i] - mx) ** 2;
  }
  if (sxx === 0) throw new Error("calibration levels are all the same");
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let residual = 0;
  let spread = 0;
  for (let i = 0; i < x.length; i++) {
    residual += (y[i] - (slope * x[i] + intercept)) ** 2;
    spread += (y[i] - my) ** 2;
  }
  return {
    slope,
    intercept,
    r_squared: spread === 0 ? 1 : 1 - residual / spread,
    lowest: Math.min(...x),
    highest: Math.max(...x),
  };
}

export function concentration(calibration: Calibration, value: number): number {
  if (calibration.slope === 0) throw new Error("degenerate calibration: slope is zero");
  return (Math.log(Math.max(value, FLOOR)) - calibration.intercept) / calibration.slope;
}

export function inRange(calibration: Calibration, c: number): boolean {
  return calibration.lowest <= c && c <= calibration.highest;
}

export function reduction(before: Reading, after: Reading, calibration: Calibration): number {
  const start = concentration(calibration, before.contrast);
  const end = concentration(calibration, after.contrast);
  if (start <= 0) throw new Error("influent concentration is not positive, check the calibration range");
  return ((start - end) / start) * 100;
}

export function readingsCsv(readings: Reading[]): string {
  return (
    "sample,contrast,transmittance\n" +
    readings.map((r) => `${r.sample},${r.contrast},${r.transmittance}`).join("\n") +
    "\n"
  );
}

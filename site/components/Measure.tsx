"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import type { Locale } from "@/lib/i18n";
import {
  concentration,
  fit,
  inRange,
  measure,
  readingsCsv,
  reduction,
  toGray,
  type Calibration,
  type Gray,
  type Reading,
  type Roi,
} from "@/lib/turbidity";

const text = {
  en: {
    privacy: "Photos are processed in this browser and never uploaded.",
    add: "Add photographs",
    addNote: "Name them cal0–cal4 for the dilution series, then influent and charge1, charge2…",
    camera: "Use camera",
    stop: "Stop camera",
    name: "Sample name",
    capture: "Capture",
    regions: "Regions",
    target: "Target box",
    white: "White box",
    drawHint: "Drag on the photo to draw the selected box. Both boxes apply to every photo, like setup.json.",
    loadSetup: "Load setup.json",
    readings: "Readings",
    sample: "Sample",
    contrast: "Contrast",
    transmittance: "Transmittance",
    level: "Concentration",
    none: "Add photographs and draw both boxes.",
    clipped: "white card clipped",
    calibration: "Calibration",
    needThree: "Give a concentration to at least three samples.",
    poor: "Below 0.9: the light drifted during the series. Reshoot it.",
    report: "Report",
    influent: "Influent",
    removed: "Removed",
    outside: "outside calibration",
    relative: "relative concentration",
    download: "Download",
    remove: "remove",
  },
  es: {
    privacy: "Las fotos se procesan en este navegador y nunca se suben.",
    add: "Agregar fotografías",
    addNote: "Nómbralas cal0–cal4 para la serie de diluciones, luego influent y charge1, charge2…",
    camera: "Usar cámara",
    stop: "Detener cámara",
    name: "Nombre de la muestra",
    capture: "Capturar",
    regions: "Regiones",
    target: "Caja del objetivo",
    white: "Caja blanca",
    drawHint: "Arrastra sobre la foto para dibujar la caja elegida. Las dos cajas valen para todas las fotos, como setup.json.",
    loadSetup: "Cargar setup.json",
    readings: "Lecturas",
    sample: "Muestra",
    contrast: "Contraste",
    transmittance: "Transmitancia",
    level: "Concentración",
    none: "Agrega fotografías y dibuja las dos cajas.",
    clipped: "tarjeta blanca saturada",
    calibration: "Calibración",
    needThree: "Asigna concentración a por lo menos tres muestras.",
    poor: "Menos de 0.9: la luz cambió durante la serie. Repite las fotos.",
    report: "Reporte",
    influent: "Influente",
    removed: "Removido",
    outside: "fuera de calibración",
    relative: "concentración relativa",
    download: "Descargar",
    remove: "quitar",
  },
} as const;

type Photo = { name: string; url: string; gray: Gray };
type Mode = "target" | "white";

const COLOURS: Record<Mode, string> = { target: "#f54927", white: "#22d3ee" };

const DEFAULT_LEVELS: Record<string, string> = { cal0: "0", cal1: "0.25", cal2: "0.5", cal3: "0.75", cal4: "1" };

function stem(file: string) {
  return file.replace(/\.[^.]+$/, "");
}

function grayFrom(source: CanvasImageSource, width: number, height: number): Gray {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("canvas unavailable");
  ctx.drawImage(source, 0, 0, width, height);
  return toGray(ctx.getImageData(0, 0, width, height));
}

function save(name: string, body: string, type: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function Label({ children }: { children: string }) {
  return <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">{children}</p>;
}

const button =
  "rounded-sm border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:border-faint hover:text-ink";

function FitChart({ points, calibration }: { points: { x: number; y: number }[]; calibration: Calibration }) {
  const w = 320;
  const h = 160;
  const pad = 28;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const [x0, x1] = [Math.min(...xs), Math.max(...xs)];
  const [y0, y1] = [Math.min(...ys) - 0.1, Math.max(...ys) + 0.1];
  const sx = (x: number) => pad + ((x - x0) / (x1 - x0 || 1)) * (w - 2 * pad);
  const sy = (y: number) => h - pad - ((y - y0) / (y1 - y0 || 1)) * (h - 2 * pad);
  const line = (x: number) => calibration.slope * x + calibration.intercept;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-sm" role="img" aria-label="log contrast against concentration">
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#2a2626" />
      <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#2a2626" />
      <line x1={sx(x0)} y1={sy(line(x0))} x2={sx(x1)} y2={sy(line(x1))} stroke="#f54927" strokeWidth={1.5} />
      {points.map((p, i) => (
        <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={3.5} fill="#ede9e6" />
      ))}
      <text x={w - pad} y={h - 8} fill="#6d6662" fontSize={10} textAnchor="end">
        concentration
      </text>
      <text x={pad} y={pad - 10} fill="#6d6662" fontSize={10}>
        ln(contrast)
      </text>
    </svg>
  );
}

export function Measure({ locale }: { locale: Locale }) {
  const t = text[locale];
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [active, setActive] = useState(0);
  const [boxes, setBoxes] = useState<Partial<Record<Mode, Roi>>>({});
  const [mode, setMode] = useState<Mode>("target");
  const [drag, setDrag] = useState<{ x: number; y: number; roi: Roi } | null>(null);
  const [levels, setLevels] = useState<Record<string, string>>({});
  const [influent, setInfluent] = useState("");
  const [charges, setCharges] = useState<string[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [captureName, setCaptureName] = useState("cal0");
  const [error, setError] = useState("");

  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const stage = useRef<HTMLDivElement>(null);

  const photo = photos[active];

  useEffect(() => () => stream.current?.getTracks().forEach((track) => track.stop()), []);

  function addPhoto(name: string, url: string, gray: Gray) {
    setPhotos((list) => [...list.filter((p) => p.name !== name), { name, url, gray }]);
    setLevels((l) => (name in l || !(name in DEFAULT_LEVELS) ? l : { ...l, [name]: DEFAULT_LEVELS[name] }));
  }

  async function onFiles(files: FileList | null) {
    if (!files) return;
    setError("");
    for (const file of Array.from(files)) {
      try {
        const bitmap = await createImageBitmap(file);
        addPhoto(stem(file.name), URL.createObjectURL(file), grayFrom(bitmap, bitmap.width, bitmap.height));
        bitmap.close();
      } catch {
        setError(`${file.name}: could not be read as an image`);
      }
    }
  }

  async function onSetup(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    try {
      const setup = JSON.parse(await file.text());
      setBoxes({ target: setup.target, white: setup.white });
    } catch {
      setError(`${file.name}: not a valid setup.json`);
    }
  }

  async function startCamera() {
    setError("");
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 } },
        audio: false,
      });
      stream.current = media;
      setStreaming(true);
      requestAnimationFrame(() => {
        if (video.current) {
          video.current.srcObject = media;
          void video.current.play();
        }
      });
    } catch {
      setError("camera unavailable or permission denied");
    }
  }

  function stopCamera() {
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    setStreaming(false);
  }

  function capture() {
    const v = video.current;
    if (!v || !v.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    canvas.getContext("2d")?.drawImage(v, 0, 0);
    const name = captureName.trim() || `sample${photos.length}`;
    canvas.toBlob((blob) => {
      if (!blob) return;
      addPhoto(name, URL.createObjectURL(blob), grayFrom(canvas, canvas.width, canvas.height));
      const match = name.match(/^(.*?)(\d+)$/);
      if (match) setCaptureName(`${match[1]}${Number(match[2]) + 1}`);
    }, "image/png");
  }

  function toImage(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const scale = photo.gray.width / rect.width;
    return {
      x: Math.round(Math.min(Math.max(e.clientX - rect.left, 0), rect.width) * scale),
      y: Math.round(Math.min(Math.max(e.clientY - rect.top, 0), rect.height) * scale),
    };
  }

  function onDown(e: PointerEvent<HTMLDivElement>) {
    if (!photo) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = toImage(e);
    setDrag({ ...p, roi: [p.x, p.y, 0, 0] });
  }

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag) return;
    const p = toImage(e);
    setDrag({
      ...drag,
      roi: [Math.min(drag.x, p.x), Math.min(drag.y, p.y), Math.abs(p.x - drag.x), Math.abs(p.y - drag.y)],
    });
  }

  function onUp() {
    if (drag && drag.roi[2] > 4 && drag.roi[3] > 4) {
      setBoxes((b) => ({ ...b, [mode]: drag.roi }));
      setMode(mode === "target" ? "white" : "target");
    }
    setDrag(null);
  }

  const results = useMemo(() => {
    if (!boxes.target || !boxes.white) return [];
    return photos.map((p) => {
      try {
        return { reading: measure(p.gray, p.name, boxes.target!, boxes.white!) };
      } catch (err) {
        return { name: p.name, error: (err as Error).message };
      }
    });
  }, [photos, boxes]);

  const readings = results.flatMap((r) => (r.reading ? [r.reading] : []));

  const calibrated = useMemo(() => {
    const pairs = readings
      .map((r) => ({ r, level: levels[r.sample] }))
      .filter((p) => p.level !== undefined && p.level !== "" && !Number.isNaN(Number(p.level)));
    if (pairs.length < 3) return null;
    try {
      const calibration = fit(
        pairs.map((p) => p.r),
        pairs.map((p) => Number(p.level)),
      );
      return {
        calibration,
        points: pairs.map((p) => ({ x: Number(p.level), y: Math.log(Math.max(p.r.contrast, 1e-6)) })),
      };
    } catch {
      return null;
    }
  }, [readings, levels]);

  const byName = Object.fromEntries(readings.map((r) => [r.sample, r])) as Record<string, Reading>;
  const before = byName[influent];

  const overlay = (roi: Roi | undefined, colour: string) =>
    roi && photo ? (
      <div
        className="pointer-events-none absolute border-2"
        style={{
          borderColor: colour,
          left: `${(roi[0] / photo.gray.width) * 100}%`,
          top: `${(roi[1] / photo.gray.height) * 100}%`,
          width: `${(roi[2] / photo.gray.width) * 100}%`,
          height: `${(roi[3] / photo.gray.height) * 100}%`,
        }}
      />
    ) : null;

  return (
    <div className="my-8 space-y-10">
      <div className="rounded-sm border border-line bg-surface p-5">
        <p className="text-sm text-muted">{t.privacy}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className={`${button} cursor-pointer border-accent text-accent`}>
            {t.add}
            <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onFiles(e.target.files)} />
          </label>
          {streaming ? (
            <button type="button" className={button} onClick={stopCamera}>
              {t.stop}
            </button>
          ) : (
            <button type="button" className={button} onClick={startCamera}>
              {t.camera}
            </button>
          )}
          <label className={`${button} cursor-pointer`}>
            {t.loadSetup}
            <input type="file" accept="application/json,.json" className="sr-only" onChange={(e) => onSetup(e.target.files)} />
          </label>
        </div>
        <p className="mt-3 text-xs text-faint">{t.addNote}</p>
        {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}

        {streaming ? (
          <div className="mt-5 space-y-3">
            <div className="relative overflow-hidden rounded-sm border border-line">
              <video ref={video} playsInline muted className="block w-full" />
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <label className="block">
                <Label>{t.name}</Label>
                <input
                  value={captureName}
                  onChange={(e) => setCaptureName(e.target.value)}
                  className="mt-1 w-36 rounded-sm border border-line bg-ground px-2 py-1.5 font-mono text-sm"
                />
              </label>
              <button type="button" className={`${button} border-accent text-accent`} onClick={capture}>
                {t.capture}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {photos.length ? (
        <div>
          <Label>{t.regions}</Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["target", "white"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={`${button} ${mode === m ? "text-ink" : ""}`}
                style={mode === m ? { borderColor: COLOURS[m] } : undefined}
              >
                <span className="mr-2 inline-block h-2.5 w-2.5" style={{ background: COLOURS[m] }} />
                {m === "target" ? t.target : t.white}
                {boxes[m] ? <span className="ml-2 font-mono text-[11px] text-faint">[{boxes[m]!.join(", ")}]</span> : null}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-faint">{t.drawHint}</p>

          <div
            ref={stage}
            className="relative mt-4 touch-none select-none overflow-hidden rounded-sm border border-line"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={() => setDrag(null)}
          >
            {/* Object URL of a local photo: next/image cannot optimise it. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt={photo.name} className="block w-full" draggable={false} />
            {overlay(boxes.target, COLOURS.target)}
            {overlay(boxes.white, COLOURS.white)}
            {overlay(drag?.roi, COLOURS[mode])}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {photos.map((p, i) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setActive(i)}
                className={`rounded-sm border px-2 py-1 font-mono text-xs ${
                  i === active ? "border-accent text-accent" : "border-line text-muted hover:text-ink"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {boxes.target && boxes.white ? (
            <button
              type="button"
              className={`${button} mt-4`}
              onClick={() =>
                save("setup.json", JSON.stringify({ target: boxes.target, white: boxes.white }, null, 2) + "\n", "application/json")
              }
            >
              {t.download} setup.json
            </button>
          ) : null}
        </div>
      ) : null}

      <div>
        <Label>{t.readings}</Label>
        {results.length ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-[15px]">
              <thead>
                <tr className="text-left font-mono text-[11px] uppercase tracking-[0.1em] text-faint">
                  <th className="border-b border-line pb-2 pr-4">{t.sample}</th>
                  <th className="border-b border-line pb-2 pr-4">{t.contrast}</th>
                  <th className="border-b border-line pb-2 pr-4">{t.transmittance}</th>
                  <th className="border-b border-line pb-2 pr-4">{t.level}</th>
                  <th className="border-b border-line pb-2" />
                </tr>
              </thead>
              <tbody>
                {results.map((r) =>
                  r.reading ? (
                    <tr key={r.reading.sample}>
                      <td className="border-b border-line-soft py-2 pr-4 font-mono">{r.reading.sample}</td>
                      <td className="border-b border-line-soft py-2 pr-4 font-mono tabular-nums text-accent">
                        {r.reading.contrast.toFixed(4)}
                      </td>
                      <td className="border-b border-line-soft py-2 pr-4 font-mono tabular-nums text-muted">
                        {r.reading.transmittance.toFixed(4)}
                        {r.reading.clipped > 0.01 ? (
                          <span className="ml-2 text-xs text-accent">{t.clipped}</span>
                        ) : null}
                      </td>
                      <td className="border-b border-line-soft py-2 pr-4">
                        <input
                          inputMode="decimal"
                          value={levels[r.reading.sample] ?? ""}
                          onChange={(e) => setLevels({ ...levels, [r.reading!.sample]: e.target.value })}
                          className="w-20 rounded-sm border border-line bg-ground px-2 py-1 font-mono text-sm"
                        />
                      </td>
                      <td className="border-b border-line-soft py-2 text-right">
                        <button
                          type="button"
                          className="font-mono text-[11px] text-faint hover:text-accent"
                          onClick={() => {
                            setPhotos(photos.filter((p) => p.name !== r.reading!.sample));
                            setActive(0);
                          }}
                        >
                          {t.remove}
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={r.name}>
                      <td className="border-b border-line-soft py-2 pr-4 font-mono">{r.name}</td>
                      <td colSpan={4} className="border-b border-line-soft py-2 text-sm text-accent">
                        {r.error}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
            <button type="button" className={`${button} mt-4`} onClick={() => save("readings.csv", readingsCsv(readings), "text/csv")}>
              {t.download} readings.csv
            </button>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">{t.none}</p>
        )}
      </div>

      {readings.length ? (
        <div>
          <Label>{t.calibration}</Label>
          {calibrated ? (
            <div className="mt-3 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
              <FitChart points={calibrated.points} calibration={calibrated.calibration} />
              <div className="space-y-1 font-mono text-sm">
                <p className="text-muted">slope {calibrated.calibration.slope.toFixed(4)}</p>
                <p className="text-muted">intercept {calibrated.calibration.intercept.toFixed(4)}</p>
                <p className={calibrated.calibration.r_squared >= 0.9 ? "text-ink" : "text-accent"}>
                  R² {calibrated.calibration.r_squared.toFixed(4)}
                </p>
                {calibrated.calibration.r_squared < 0.9 ? <p className="font-body text-xs text-accent">{t.poor}</p> : null}
                <button
                  type="button"
                  className={`${button} mt-2 font-body`}
                  onClick={() => save("calibration.json", JSON.stringify(calibrated.calibration, null, 2) + "\n", "application/json")}
                >
                  {t.download} calibration.json
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted">{t.needThree}</p>
          )}
        </div>
      ) : null}

      {calibrated ? (
        <div>
          <Label>{t.report}</Label>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
              {t.influent}
              <select
                value={influent}
                onChange={(e) => setInfluent(e.target.value)}
                className="rounded-sm border border-line bg-ground px-2 py-1 font-mono text-sm"
              >
                <option value="" />
                {readings.map((r) => (
                  <option key={r.sample} value={r.sample}>
                    {r.sample}
                  </option>
                ))}
              </select>
            </label>
            {readings
              .filter((r) => r.sample !== influent)
              .map((r) => (
                <label key={r.sample} className="flex items-center gap-1.5 font-mono text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={charges.includes(r.sample)}
                    onChange={(e) =>
                      setCharges(e.target.checked ? [...charges, r.sample] : charges.filter((c) => c !== r.sample))
                    }
                    className="accent-[#f54927]"
                  />
                  {r.sample}
                </label>
              ))}
          </div>
          {before ? (
            <ul className="mt-4 space-y-2">
              {charges
                .filter((name) => byName[name] && name !== influent)
                .map((name) => {
                  const cal = calibrated.calibration;
                  const end = concentration(cal, byName[name].contrast);
                  let value: string;
                  try {
                    value = `${reduction(before, byName[name], cal).toFixed(1)} %`;
                  } catch (err) {
                    value = (err as Error).message;
                  }
                  return (
                    <li key={name} className="flex flex-wrap items-baseline gap-x-4 border-l-2 border-l-accent pl-3">
                      <span className="font-mono text-sm">{name}</span>
                      <span className="font-mono text-2xl tabular-nums">{value}</span>
                      <span className="text-xs text-muted">
                        {t.removed} · {t.relative} {end.toFixed(3)}
                        {inRange(cal, end) ? "" : ` · ${t.outside}`}
                      </span>
                    </li>
                  );
                })}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

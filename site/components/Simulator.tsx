"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import {
  cartridgeChar,
  cartridgeRegolith,
  constants as c,
  marsHead,
  perchlorate,
  size,
  type Base,
  type Range,
} from "@/lib/sizing";

const text = {
  en: {
    crew: "Crew",
    base: "Base",
    early: "Early",
    mature: "Mature",
    perchlorate: "Perchlorate in regolith",
    gravity: "Gravity",
    mars: "Mars, 0.37 g",
    earth: "Earth, 1 g",
    cartridges: "Filter cartridges in parallel",
    cartridgesNote: "Ø75 mm bench columns at slow sand filtration rates",
    always: "at 0.4 m/h",
    slow: "at 0.1 m/h, rounded up",
    greywater: "Greywater",
    flow: "Flow",
    area: "Filter area",
    trash: "Trash",
    char: "Char",
    retort: "Retort heat",
    perDay: "/day",
    mean: "mean",
    head: "Head for Earth flow",
    headNote: "instead of 0.20 m: why the design adds cartridges",
    oxygen: "Could Stage 1 feed the crew oxygen?",
    regolith: "Regolith treated per day",
    covered: "of crew O₂, even if every molecule were captured",
    oxygenNote: "The bacteria respire it themselves. Covering the crew would take",
    tonnes: "t of regolith a day",
    local: "One cartridge, by mass",
    localMars: "made on Mars",
    localEarth: "acetate from Earth",
    localNote: "Treated regolith and char from the habitat; the donor until a waste-derived one works. Shell not counted.",
    source: "Same model and sources as",
  },
  es: {
    crew: "Tripulación",
    base: "Base",
    early: "Temprana",
    mature: "Madura",
    perchlorate: "Perclorato en el regolito",
    gravity: "Gravedad",
    mars: "Marte, 0.37 g",
    earth: "Tierra, 1 g",
    cartridges: "Cartuchos de filtro en paralelo",
    cartridgesNote: "Columnas de banco de Ø75 mm a tasas de filtración lenta en arena",
    always: "a 0.4 m/h",
    slow: "a 0.1 m/h, redondeando hacia arriba",
    greywater: "Agua gris",
    flow: "Flujo",
    area: "Área de filtro",
    trash: "Basura",
    char: "Carbón",
    retort: "Calor de la retorta",
    perDay: "/día",
    mean: "promedio",
    head: "Carga para el flujo terrestre",
    headNote: "en vez de 0.20 m: por eso el diseño agrega cartuchos",
    oxygen: "¿La etapa 1 podría dar oxígeno a la tripulación?",
    regolith: "Regolito tratado al día",
    covered: "del O₂ de la tripulación, aun capturando cada molécula",
    oxygenNote: "Las bacterias lo respiran. Cubrir a la tripulación pediría",
    tonnes: "t de regolito al día",
    local: "Un cartucho, en masa",
    localMars: "hecho en Marte",
    localEarth: "acetato de la Tierra",
    localNote: "Regolito tratado y carbón del propio hábitat; el donador hasta que funcione uno de los residuos. Sin contar la carcasa.",
    source: "Mismo modelo y fuentes que",
  },
} as const;

const fmt = (n: number, digits = 1) => n.toFixed(digits);
const range = ([a, b]: Range, digits = 1) => `${fmt(a, digits)}–${fmt(b, digits)}`;

const LAYERS = [
  { share: 50, colour: "#8a8077" },
  { share: 200, colour: "#d9c9a3" },
  { share: 120, colour: "#2b2523" },
  { share: 50, colour: "#6b4a3a" },
];

const BED = LAYERS.reduce((sum, layer) => sum + layer.share, 0);
const OFFSETS = LAYERS.map((_, i) => LAYERS.slice(0, i).reduce((sum, layer) => sum + layer.share, 0));

function Column({ x, solid }: { x: number; solid: boolean }) {
  const top = 8;
  const height = 92;
  const bed = height - 14;
  return (
    <g opacity={solid ? 1 : 0.32}>
      <rect x={x} y={top} width={16} height={height} rx={2} fill="none" stroke="#6d6662" />
      <rect x={x + 1} y={top + 1} width={14} height={12} fill="#3a78b5" opacity={0.55} />
      {LAYERS.map((layer, i) => (
        <rect
          key={i}
          x={x + 1}
          y={top + 14 + (OFFSETS[i] / BED) * bed}
          width={14}
          height={(layer.share / BED) * bed}
          fill={layer.colour}
        />
      ))}
    </g>
  );
}

function Rack({ low, high }: { low: number; high: number }) {
  const total = Math.ceil(high);
  const solid = Math.ceil(low);
  const width = Math.max(total * 24 + 8, 120);
  return (
    <svg viewBox={`0 0 ${width} 110`} className="h-28 w-auto max-w-full" role="img" aria-label={`${solid}–${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <Column key={i} x={8 + i * 24} solid={i < solid} />
      ))}
    </svg>
  );
}

function Slider({
  label,
  value,
  shown,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  shown: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
        {label}
        <span className="text-sm normal-case tracking-normal text-accent">{shown}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[#f54927]"
      />
    </label>
  );
}

function Toggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">{label}</span>
      <div className="mt-2 flex rounded-sm border border-line p-0.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            className={`flex-1 rounded-[1px] px-2 py-1.5 text-sm transition-colors ${
              value === o.value ? "bg-accent text-white" : "text-muted hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="border-l-2 border-l-line py-1 pl-3">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-faint">{label}</p>
      <p className="mt-1 font-mono text-lg tabular-nums text-ink">{value}</p>
      {note ? <p className="text-xs text-muted">{note}</p> : null}
    </div>
  );
}

export function Simulator({ locale }: { locale: Locale }) {
  const t = text[locale];
  const [crew, setCrew] = useState(6);
  const [base, setBase] = useState<Base>("early");
  const [fraction, setFraction] = useState(c.perchlorateFraction[0]);
  const [mars, setMars] = useState(true);
  const [regolith, setRegolith] = useState(1000);

  const s = size(crew, base);
  const columns = mars ? s.columnsMars : s.columns;
  const area = mars ? s.areaMars : s.area;
  const tonne = perchlorate(1000, fraction);
  const daily = perchlorate(regolith, fraction);
  const covered = Math.min(daily.oxygen / s.oxygen, 1);
  const needed = s.oxygen / tonne.oxygen;
  const acetate = perchlorate(cartridgeRegolith, fraction).acetate;
  const localShare = (cartridgeRegolith + cartridgeChar) / (cartridgeRegolith + cartridgeChar + acetate);

  return (
    <div className="my-8 space-y-10">
      <div className="grid gap-6 rounded-sm border border-line bg-surface p-5 sm:grid-cols-2">
        <Slider label={t.crew} value={crew} shown={String(crew)} min={1} max={12} step={1} onChange={setCrew} />
        <Slider
          label={t.perchlorate}
          value={fraction}
          shown={`${fmt(fraction * 100)} %`}
          min={c.perchlorateFraction[0]}
          max={c.perchlorateFraction[1]}
          step={0.001}
          onChange={setFraction}
        />
        <Toggle
          label={t.base}
          value={base}
          options={[
            { value: "early", label: t.early },
            { value: "mature", label: t.mature },
          ]}
          onChange={setBase}
        />
        <Toggle
          label={t.gravity}
          value={mars ? "mars" : "earth"}
          options={[
            { value: "mars", label: t.mars },
            { value: "earth", label: t.earth },
          ]}
          onChange={(v) => setMars(v === "mars")}
        />
      </div>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">{t.cartridges}</p>
        <p className="mt-1 font-display text-3xl font-semibold tabular-nums">
          {range(columns)}
        </p>
        <div className="mt-3 overflow-x-auto">
          <Rack low={columns[0]} high={columns[1]} />
        </div>
        <p className="mt-2 text-sm text-muted">
          {t.cartridgesNote}. <span className="text-ink">{Math.ceil(columns[0])}</span> {t.always},{" "}
          <span className="text-ink">{Math.ceil(columns[1])}</span> {t.slow}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
        <Stat label={t.greywater} value={`${fmt(s.greywater)} L${t.perDay}`} />
        <Stat label={t.flow} value={`${fmt(s.flowPerHour, 2)} L/h`} />
        <Stat label={t.area} value={`${range(area, 3)} m²`} />
        <Stat label={t.trash} value={`${fmt(s.trash, 2)} kg${t.perDay}`} />
        <Stat label={t.char} value={`${fmt(s.charDry, 2)} kg${t.perDay}`} />
        <Stat label={t.retort} value={`${range(s.energy)} MJ`} note={`${range(s.power, 0)} W ${t.mean}`} />
        {mars ? <Stat label={t.head} value={`${fmt(marsHead(), 2)} m`} note={t.headNote} /> : null}
      </div>

      <div className="rounded-sm border border-line p-5">
        <h3 className="font-display text-lg font-semibold">{t.oxygen}</h3>
        <div className="mt-4">
          <Slider
            label={t.regolith}
            value={regolith}
            shown={`${fmt(regolith / 1000, 1)} t`}
            min={0}
            max={5000}
            step={50}
            onChange={setRegolith}
          />
        </div>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-raised" aria-hidden>
          <div className="h-full bg-accent transition-[width]" style={{ width: `${covered * 100}%` }} />
        </div>
        <p className="mt-3 text-sm text-muted">
          <span className="font-mono text-ink">{fmt(covered * 100, 0)} %</span> {t.covered} ({fmt(daily.oxygen, 2)} /{" "}
          {fmt(s.oxygen, 2)} kg). {t.oxygenNote}{" "}
          <span className="font-mono text-ink">{fmt(needed, 1)}</span> {t.tonnes}.
        </p>
      </div>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">{t.local}</p>
        <div className="mt-3 flex h-8 w-full overflow-hidden rounded-sm border border-line" aria-hidden>
          <div className="bg-[#6b4a3a]" style={{ width: `${localShare * 100}%` }} />
          <div className="min-w-[3px] bg-accent" style={{ width: `${(1 - localShare) * 100}%` }} />
        </div>
        <p className="mt-2 text-sm text-muted">
          <span className="font-mono text-ink">{fmt(localShare * 100, 1)} %</span> {t.localMars} (
          {fmt(cartridgeRegolith + cartridgeChar, 2)} kg) ·{" "}
          <span className="font-mono text-accent">{fmt(acetate * 1000, 1)} g</span> {t.localEarth}. {t.localNote}
        </p>
      </div>
    </div>
  );
}

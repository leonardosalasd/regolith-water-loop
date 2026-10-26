"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Locale } from "@/lib/i18n";
import { constants as c, gravityFactor } from "@/lib/sizing";

type View = "habitat" | "column";

const text = {
  en: {
    habitat: "Habitat, RWL-004",
    column: "Column, RWL-001",
    earth: "Earth, 1 g",
    mars: "Mars, 0.37 g",
    hint: "Drag to orbit, right-drag or two fingers to pan.",
    habitatNote:
      "RWL-004 in 3D. Zones, units and every flow follow the drawing; equipment shapes, heights and zone sizes are illustrative, not derived.",
    columnNote:
      "RWL-001 at true proportions. Brown grains stand for suspended solids, held in the bed; blue for dissolved colour, which passes, as in the first runs. The motion is schematic: only the Earth to Mars speed ratio, 0.377 from Darcy's law, is physical.",
    credit: "3D model © Leonardo Salas, CC BY-NC-ND 4.0.",
    legend: { solids: "Solids", water: "Water", gas: "Gas", heat: "Heat" },
    units: {
      airlock: "Airlock",
      glovebox: "Handling glovebox",
      stage1: "Stage 1 · bioreactor",
      fill: "Cartridge fill, automated",
      retort: "Stage 3 · pyrolysis retort",
      rack: "Stage 2 · filter cartridges",
      processor: "Main water processor",
      galley: "Galley",
      life: "Life support",
      hygiene: "Hygiene",
      dirty: "Dirty zone, below cabin pressure",
      bulkhead: "Sealed bulkhead, shared heat",
    },
    layers: ["Support scoria · 50 mm", "Charcoal · 120 mm", "Fine sand · 200 mm", "Coarse scoria · 50 mm", "Charge · 200 mm", "Ball valve"],
  },
  es: {
    habitat: "Hábitat, RWL-004",
    column: "Columna, RWL-001",
    earth: "Tierra, 1 g",
    mars: "Marte, 0.37 g",
    hint: "Arrastra para girar; clic derecho o dos dedos para desplazar.",
    habitatNote:
      "RWL-004 en 3D. Zonas, equipos y cada flujo siguen el plano; las formas de los equipos, las alturas y los tamaños de zona son ilustrativos, no derivados.",
    columnNote:
      "RWL-001 en proporciones reales. Los granos cafés son sólidos suspendidos, que el lecho retiene; los azules, color disuelto, que pasa, como en las primeras corridas. El movimiento es esquemático: solo la relación de velocidad Tierra a Marte, 0.377 por la ley de Darcy, es física.",
    credit: "Modelo 3D © Leonardo Salas, CC BY-NC-ND 4.0.",
    legend: { solids: "Sólidos", water: "Agua", gas: "Gas", heat: "Calor" },
    units: {
      airlock: "Esclusa",
      glovebox: "Caja de guantes",
      stage1: "Etapa 1 · biorreactor",
      fill: "Llenado automático de cartuchos",
      retort: "Etapa 3 · retorta de pirólisis",
      rack: "Etapa 2 · cartuchos de filtro",
      processor: "Procesador principal de agua",
      galley: "Cocina",
      life: "Soporte vital",
      hygiene: "Higiene",
      dirty: "Zona sucia, bajo la presión de cabina",
      bulkhead: "Mamparo sellado, calor compartido",
    },
    layers: ["Escoria de soporte · 50 mm", "Carbón · 120 mm", "Arena fina · 200 mm", "Escoria gruesa · 50 mm", "Carga · 200 mm", "Válvula de esfera"],
  },
} as const;

const FLOW = { solids: "#d9c9a3", water: "#4f9be0", gas: "#9b938e", heat: "#e08a3a" } as const;

function label(textContent: string, accent = false, side = false) {
  const el = document.createElement("div");
  el.textContent = textContent;
  el.style.cssText = `font: 500 11px/1.2 var(--font-plex-mono, ui-monospace), monospace; color: ${
    accent ? "#f54927" : "#ede9e6"
  }; background: rgba(12,11,11,0.78); padding: 2px 6px; border: 1px solid #2a2626; border-radius: 2px; white-space: nowrap; pointer-events: none;`;
  const object = new CSS2DObject(el);
  if (side) object.center.set(0, 0.5);
  return object;
}

const plan = (x: number, y: number, h = 0) => new THREE.Vector3((x - 525) / 100, h, (y - 305) / 100);

type Mover = { update: (t: number, speed: number) => void };

function along(
  points: THREE.Vector3[],
  colour: string,
  group: THREE.Group,
  count: number,
  { dashed = false, drawn = true, size = 0.035 } = {},
): Mover {
  const path = new THREE.CurvePath<THREE.Vector3>();
  for (let i = 1; i < points.length; i++) {
    path.add(new THREE.LineCurve3(points[i - 1], points[i]));
  }
  if (drawn) {
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(path.getSpacedPoints(40)),
      dashed
        ? new THREE.LineDashedMaterial({ color: colour, dashSize: 0.05, gapSize: 0.05 })
        : new THREE.LineBasicMaterial({ color: colour, transparent: true, opacity: 0.5 }),
    );
    if (dashed) line.computeLineDistances();
    group.add(line);
  }
  const geometry = new THREE.SphereGeometry(size, 10, 8);
  const material = new THREE.MeshBasicMaterial({ color: colour });
  const dots = Array.from({ length: count }, () => {
    const dot = new THREE.Mesh(geometry, material);
    group.add(dot);
    return dot;
  });
  const length = path.getLength();
  return {
    update(t, speed) {
      dots.forEach((dot, i) => {
        const u = (((t * speed * 0.35) / length + i / count) % 1 + 1) % 1;
        dot.position.copy(path.getPointAt(u));
      });
    },
  };
}

function flowPath(points: [number, number][], colour: string, group: THREE.Group, count: number, dashed = false): Mover {
  return along(
    points.map((p) => plan(...p, 0.06)),
    colour,
    group,
    count,
    { dashed },
  );
}

function box(x0: number, y0: number, x1: number, y1: number, h: number, colour: string, emissive = "#000000") {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry((x1 - x0) / 100, h, (y1 - y0) / 100),
    new THREE.MeshStandardMaterial({ color: colour, roughness: 0.8, emissive, emissiveIntensity: emissive === "#000000" ? 0 : 0.6 }),
  );
  mesh.position.copy(plan((x0 + x1) / 2, (y0 + y1) / 2, h / 2));
  return mesh;
}

const LABELS: Record<string, { unit: keyof (typeof text)["en"]["units"]; accent?: boolean }> = {
  stage1: { unit: "stage1", accent: true },
  stage3: { unit: "retort", accent: true },
  rack: { unit: "rack", accent: true },
  fill: { unit: "fill" },
  processor: { unit: "processor" },
  galley: { unit: "galley" },
  life: { unit: "life" },
  hygiene: { unit: "hygiene" },
  airlock: { unit: "airlock" },
  glovebox: { unit: "glovebox" },
  dirty: { unit: "dirty" },
  bulkhead: { unit: "bulkhead" },
};

// Fits the Blender habitat to the width of the plan model, with its floor at y = 0. Labels sit on its
// label_* empties and the flows run along the paths stored on its "flows" and "heat" empties.
function loadHabitat(g: THREE.Group, t: (typeof text)[Locale], movers: Mover[], alive: () => boolean, onModel: () => void) {
  const procedural = [...g.children];
  new GLTFLoader()
    .loadAsync(MODELS.habitat)
    .then((gltf) => {
      if (!alive()) return;
      const model = gltf.scene;
      model.updateMatrixWorld(true);
      const floor = new THREE.Box3();
      model.traverse((o) => {
        if (o.name.startsWith("floor-")) floor.expandByObject(o);
      });
      if (floor.isEmpty()) return;
      const scale = 7.5 / floor.getSize(new THREE.Vector3()).x;
      const centre = floor.getCenter(new THREE.Vector3());
      model.scale.setScalar(scale);
      model.position.set(-centre.x * scale, -floor.min.y * scale, -centre.z * scale);
      g.add(model);
      model.updateMatrixWorld(true);
      procedural.forEach((o) => (o.visible = false));

      model.traverse((o) => {
        const spec = LABELS[o.name.replace(/^label_/, "")];
        if (!o.name.startsWith("label_") || !spec) return;
        const l = label(t.units[spec.unit], spec.accent);
        l.position.copy(o.getWorldPosition(new THREE.Vector3()));
        g.add(l);
      });

      const lift = new THREE.Vector3(0, 0.05, 0);
      const world = (points: number[][]) =>
        points.map(([x, y, z]) => new THREE.Vector3(x, z, -y).applyMatrix4(model.matrixWorld).add(lift));
      const stored = (name: string) => JSON.parse(String(model.getObjectByName(name)?.userData.paths ?? "null"));
      const flows: Record<"solids" | "water" | "gas", number[][][]> = stored("flows") ?? {};
      const heat: number[][][] = stored("heat") ?? [];
      const next: Mover[] = [];
      const run = (points: THREE.Vector3[], colour: string) => {
        let length = 0;
        for (let i = 1; i < points.length; i++) length += points[i].distanceTo(points[i - 1]);
        next.push(along(points, colour, g, Math.max(2, Math.round(length / 0.3)), { drawn: false, size: 0.05 }));
      };
      (Object.keys(flows) as (keyof typeof flows)[]).forEach((kind) => flows[kind].forEach((p) => run(world(p), FLOW[kind])));
      heat.forEach((p) => run(world(p), FLOW.heat));
      movers.splice(0, movers.length, ...next);
      onModel();
    })
    .catch(() => {});
}

function buildHabitat(scene: THREE.Scene, t: (typeof text)[Locale], alive: () => boolean, onModel: () => void): Mover[] {
  const g = new THREE.Group();
  scene.add(g);

  const floor = (x0: number, y0: number, x1: number, y1: number, colour: string) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry((x1 - x0) / 100, (y1 - y0) / 100),
      new THREE.MeshStandardMaterial({ color: colour, roughness: 1 }),
    );
    m.rotation.x = -Math.PI / 2;
    m.position.copy(plan((x0 + x1) / 2, (y0 + y1) / 2, 0));
    g.add(m);
  };
  floor(150, 110, 430, 500, "#2a1310");
  floor(430, 110, 650, 330, "#1e1b1b");
  floor(430, 330, 650, 500, "#121c26");
  floor(650, 110, 900, 500, "#1a1818");

  const wallMat = new THREE.MeshStandardMaterial({ color: "#6d6662", roughness: 0.9 });
  const wall = (x0: number, y0: number, x1: number, y1: number, thick = 4, h = 0.35, mat = wallMat) => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(Math.max((x1 - x0) / 100, thick / 100), h, Math.max((y1 - y0) / 100, thick / 100)),
      mat,
    );
    m.position.copy(plan((x0 + x1) / 2, (y0 + y1) / 2, h / 2));
    g.add(m);
  };
  wall(150, 110, 900, 110);
  wall(150, 500, 900, 500);
  wall(150, 110, 150, 300);
  wall(150, 370, 150, 500);
  wall(900, 110, 900, 500);
  wall(650, 110, 650, 500, 2);
  wall(430, 330, 650, 330, 2);
  const bulkhead = new THREE.MeshStandardMaterial({ color: "#a8301a", emissive: "#e08a3a", emissiveIntensity: 0.2 });
  wall(430, 110, 430, 500, 8, 0.5, bulkhead);

  g.add(box(50, 300, 150, 370, 0.4, "#3a3533"));
  g.add(box(175, 290, 280, 380, 0.45, "#4a4240"));
  g.add(box(300, 270, 425, 420, 0.38, "#4a4240"));
  g.add(box(445, 436, 620, 486, 0.45, "#2b4a66"));
  g.add(box(680, 160, 870, 220, 0.32, "#3a3533"));
  g.add(box(680, 262, 870, 322, 0.32, "#3a3533"));
  g.add(box(680, 370, 870, 430, 0.32, "#2b4a66"));
  const retort = box(440, 150, 600, 250, 0.55, "#5a2a1a", "#e05a2a");
  g.add(retort);

  const reactor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 0.7, 40),
    new THREE.MeshStandardMaterial({ color: "#55504c", roughness: 0.6, metalness: 0.2 }),
  );
  reactor.position.copy(plan(362, 195, 0.35));
  g.add(reactor);
  const jacket = new THREE.Mesh(
    new THREE.TorusGeometry(0.41, 0.03, 8, 48),
    new THREE.MeshStandardMaterial({ color: "#e08a3a", emissive: "#e08a3a", emissiveIntensity: 0.5 }),
  );
  jacket.rotation.x = Math.PI / 2;
  jacket.position.copy(plan(362, 195, 0.25));
  g.add(jacket);

  const layerColours = ["#8a8077", "#2b2523", "#d9c9a3", "#6b4a3a"];
  const layerShares = [50, 120, 200, 50];
  for (let i = 0; i < 8; i++) {
    const x = 457 + i * 21.5;
    let y = 0;
    layerShares.forEach((share, k) => {
      const h = (share / 420) * 0.42;
      const layer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, h, 16),
        new THREE.MeshStandardMaterial({ color: layerColours[k], roughness: 1 }),
      );
      layer.position.copy(plan(x, 391, y + h / 2));
      g.add(layer);
      y += h;
    });
  }

  const tag = (s: string, x: number, y: number, h: number, accent = false) => {
    const l = label(s, accent);
    l.position.copy(plan(x, y, h));
    g.add(l);
  };
  tag(t.units.airlock, 100, 335, 0.55);
  tag(t.units.glovebox, 227, 335, 0.62);
  tag(t.units.stage1, 362, 195, 0.9, true);
  tag(t.units.fill, 362, 345, 0.55);
  tag(t.units.retort, 520, 200, 0.75, true);
  tag(t.units.rack, 532, 391, 0.62, true);
  tag(t.units.processor, 532, 461, 0.62);
  tag(t.units.galley, 775, 190, 0.48);
  tag(t.units.life, 775, 292, 0.48);
  tag(t.units.hygiene, 775, 400, 0.48);
  tag(t.units.dirty, 290, 470, 0.05);
  tag(t.units.bulkhead, 430, 300, 0.7);

  const movers = [
    flowPath([[60, 335], [173, 335]], FLOW.solids, g, 3),
    flowPath([[227, 290], [227, 195], [298, 195]], FLOW.solids, g, 5),
    flowPath([[362, 240], [362, 268]], FLOW.solids, g, 2),
    flowPath([[470, 250], [470, 300], [427, 300]], FLOW.solids, g, 4),
    flowPath([[425, 391], [443, 391]], FLOW.solids, g, 2),
    flowPath([[678, 190], [602, 190]], FLOW.solids, g, 4),
    flowPath([[678, 400], [622, 400]], FLOW.water, g, 4),
    flowPath([[532, 420], [532, 434]], FLOW.water, g, 2),
    flowPath([[620, 470], [775, 470], [775, 432]], FLOW.water, g, 7),
    flowPath([[600, 232], [636, 232], [636, 292], [678, 292]], FLOW.gas, g, 4, true),
    flowPath([[440, 190], [425, 190]], FLOW.heat, g, 3),
  ];
  const glow: Mover = {
    update(time) {
      const pulse = 0.45 + 0.25 * Math.sin(time * 2);
      (retort.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
      bulkhead.emissiveIntensity = 0.15 + 0.15 * Math.sin(time * 2);
    },
  };
  const all = [...movers, glow];
  loadHabitat(g, t, all, alive, onModel);
  return all;
}

const CUT_START = Math.PI / 2;
const CUT_LENGTH = Math.PI * 1.5;

// The Blender model is in metres, Z up, cut open towards +X; the scene works in units of 100 mm.
const MODELS = { column: "/models/rwl-001.glb", particles: "/models/particles.glb", habitat: "/models/habitat.glb" };
const MODEL_SCALE = 10;
const CUT_FACING = Math.atan2(9.6, 8.2);
const VALVE_CENTRE_M = -0.103;
const HOSE_END_M = -0.08;

function sectioned(radius: number, height: number, material: THREE.MeshStandardMaterial) {
  const group = new THREE.Group();
  group.add(new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 48, 1, false, CUT_START, CUT_LENGTH), material));
  const face = new THREE.PlaneGeometry(radius, height);
  const front = new THREE.Mesh(face, material);
  front.position.set(radius / 2, 0, 0);
  const side = new THREE.Mesh(face, material);
  side.rotation.y = Math.PI / 2;
  side.position.set(0, 0, radius / 2);
  group.add(front, side);
  return group;
}

function buildColumn(
  scene: THREE.Scene,
  t: (typeof text)[Locale],
  alive: () => boolean,
  onModel: () => void,
): { movers: Mover[]; target: THREE.Vector3 } {
  const g = new THREE.Group();
  scene.add(g);
  const drawn: THREE.Object3D[] = [];
  const mm = (v: number) => v / 100;
  const r = mm(c.benchBore * 1000) / 2;
  const cap = mm(20);

  const shares = [50, 120, 200, 50];
  const colours = ["#8a8077", "#2b2523", "#d9c9a3", "#6b4a3a"];
  const beside = (height: number) =>
    new THREE.Vector3(Math.sin(CUT_FACING), 0, -Math.cos(CUT_FACING)).multiplyScalar(r + 0.25).setY(height);
  const tops: number[] = [];
  let y = cap;
  shares.forEach((share, i) => {
    const h = mm(share);
    const layer = sectioned(
      r * 0.97,
      h,
      new THREE.MeshStandardMaterial({ color: colours[i], roughness: 1, side: THREE.DoubleSide }),
    );
    layer.position.y = y + h / 2;
    g.add(layer);
    drawn.push(layer);
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 0.98, r * 0.98, 0.012, 48),
      new THREE.MeshStandardMaterial({ color: "#9b938e", wireframe: true }),
    );
    disc.position.y = y;
    g.add(disc);
    drawn.push(disc);
    const l = label(t.layers[i], false, true);
    l.position.copy(beside(y + h / 2));
    g.add(l);
    y += h;
    tops.push(y);
  });
  const bedTop = y;
  const charge = mm(c.chargeDepth * 1000);
  const water = sectioned(
    r * 0.97,
    charge,
    new THREE.MeshStandardMaterial({ color: "#3a78b5", transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false }),
  );
  water.position.y = bedTop + charge / 2;
  g.add(water);
  drawn.push(water);
  const chargeLabel = label(t.layers[4], true, true);
  chargeLabel.position.copy(beside(bedTop + charge / 2));
  g.add(chargeLabel);

  const pipeTop = cap + mm(750);
  const pipe = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r, pipeTop, 48, 1, true, CUT_START, CUT_LENGTH),
    new THREE.MeshStandardMaterial({ color: "#ede9e6", transparent: true, opacity: 0.12, side: THREE.DoubleSide }),
  );
  pipe.position.y = pipeTop / 2;
  g.add(pipe);
  const capMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(r * 1.08, r * 1.08, cap, 48),
    new THREE.MeshStandardMaterial({ color: "#cfc9c4" }),
  );
  capMesh.position.y = cap / 2;
  g.add(capMesh);
  const hose = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.6, 16),
    new THREE.MeshStandardMaterial({ color: "#ede9e6", transparent: true, opacity: 0.4 }),
  );
  hose.position.y = -0.3;
  g.add(hose);
  const valve = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.16), new THREE.MeshStandardMaterial({ color: "#3a78b5" }));
  valve.position.y = -0.7;
  g.add(valve);
  drawn.push(pipe, capMesh, hose, valve);
  const valveLabel = label(t.layers[5], false, true);
  valveLabel.position.copy(beside(-0.7));
  g.add(valveLabel);

  const grainGeo = new THREE.SphereGeometry(0.035, 8, 6);
  const solid = new THREE.MeshBasicMaterial({ color: "#a0703f" });
  const dye = new THREE.MeshBasicMaterial({ color: "#4f9be0" });
  const top = bedTop + charge;
  const sandTop = tops[2];
  const particles = Array.from({ length: 70 }, (_, i) => {
    const isSolid = i % 2 === 0;
    const mesh: THREE.Mesh<THREE.BufferGeometry, THREE.Material> = new THREE.Mesh(grainGeo, isSolid ? solid : dye);
    const along = r * (0.12 + 0.76 * ((i * 0.618) % 1));
    if (i % 4 < 2) mesh.position.set(along, 0, 0.03);
    else mesh.position.set(0.03, 0, along);
    g.add(mesh);
    const stop = isSolid ? sandTop + mm(50) * ((i * 0.37) % 1) : -0.9;
    return { mesh, isSolid, phase: i / 70, stop, angle: CUT_FACING + (((i * 0.618) % 1) - 0.5) * 1.4 };
  });

  let outlet = -0.9;
  let span = top - outlet;
  let onAxisBelow = -Infinity;

  const loader = new GLTFLoader();
  Promise.all([loader.loadAsync(MODELS.column), loader.loadAsync(MODELS.particles)])
    .then(([column, grains]) => {
      if (!alive()) return;
      column.scene.scale.setScalar(MODEL_SCALE);
      column.scene.rotation.y = -CUT_FACING;
      column.scene.position.y = cap;
      g.add(column.scene);
      drawn.forEach((o) => (o.visible = false));
      valveLabel.position.y = cap + VALVE_CENTRE_M * MODEL_SCALE;

      const shape = (name: string, size: number) => {
        const source = grains.scene.getObjectByName(name);
        if (!(source instanceof THREE.Mesh)) return null;
        const geometry = source.geometry.clone();
        geometry.computeBoundingBox();
        const box = geometry.boundingBox as THREE.Box3;
        geometry.translate(...box.getCenter(new THREE.Vector3()).negate().toArray());
        geometry.scale(...Array(3).fill(size / Math.max(...box.getSize(new THREE.Vector3()).toArray())) as [number, number, number]);
        return { geometry, material: source.material as THREE.Material };
      };
      const drop = shape("drop", 0.09);
      const grain = shape("grain", 0.07);
      const ring = r * 1.06;
      const soil = new THREE.MeshStandardMaterial({ color: "#a0703f", roughness: 1 });
      particles.forEach((p) => {
        const look = p.isSolid ? grain : drop;
        if (look) {
          p.mesh.geometry = look.geometry;
          p.mesh.material = p.isSolid ? soil : look.material;
        }
        p.mesh.position.set(ring * Math.cos(p.angle), 0, ring * Math.sin(p.angle));
      });
      outlet = cap + HOSE_END_M * MODEL_SCALE;
      span = top - outlet;
      onAxisBelow = cap;
      onModel();
    })
    .catch(() => {});

  const movers: Mover[] = [
    {
      update(time, speed) {
        particles.forEach((p) => {
          const travelled = ((time * speed * 0.18 + p.phase) % 1) * span;
          let height = top - travelled;
          if (height < bedTop) {
            const inBed = bedTop - height;
            height = bedTop - inBed * 0.6;
          }
          if (p.isSolid && height < p.stop) height = p.stop;
          p.mesh.position.y = height;
          if (height < onAxisBelow) p.mesh.position.set(0, height, 0);
          else if (onAxisBelow > -Infinity) {
            const ring = r * 1.06;
            p.mesh.position.set(ring * Math.cos(p.angle), height, ring * Math.sin(p.angle));
          }
        });
      },
    },
  ];
  return { movers, target: new THREE.Vector3(0, pipeTop / 2 - 0.4, 0) };
}

export function Model3D({ locale }: { locale: Locale }) {
  const t = text[locale];
  const mount = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>("habitat");
  const [mars, setMars] = useState(true);
  const [loaded, setLoaded] = useState<View | null>(null);
  const speed = useRef(gravityFactor);
  const zoom = useRef<(factor: number) => void>(() => {});

  useEffect(() => {
    speed.current = mars ? gravityFactor : 1;
  }, [mars]);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    const width = host.clientWidth;
    const height = host.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    host.appendChild(renderer.domElement);

    const labels = new CSS2DRenderer();
    labels.setSize(width, height);
    labels.domElement.style.cssText = "position:absolute;inset:0;pointer-events:none;";
    host.appendChild(labels.domElement);

    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight("#ede9e6", "#0c0b0b", 1.4));
    const sun = new THREE.DirectionalLight("#ffffff", 1.6);
    sun.position.set(4, 8, 5);
    scene.add(sun);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.05, 100);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.maxPolarAngle = Math.PI * 0.49;
    zoom.current = (factor) => {
      const offset = camera.position.clone().sub(controls.target).multiplyScalar(factor);
      const distance = THREE.MathUtils.clamp(offset.length(), controls.minDistance, controls.maxDistance);
      camera.position.copy(controls.target).add(offset.setLength(distance));
    };

    let live = true;
    let movers: Mover[];
    if (view === "habitat") {
      movers = buildHabitat(
        scene,
        t,
        () => live,
        () => setLoaded("habitat"),
      );
      camera.position.set(0.3, 8.3, 8.6);
      controls.target.set(0, 0, 0.2);
      controls.minDistance = 3;
      controls.maxDistance = 14;
    } else {
      const built = buildColumn(
        scene,
        t,
        () => live,
        () => setLoaded("column"),
      );
      movers = built.movers;
      camera.position.set(8.2, 6.8, 9.6);
      controls.target.copy(built.target);
      controls.minDistance = 3;
      controls.maxDistance = 20;
      controls.maxPolarAngle = Math.PI * 0.9;
    }

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock();
    let simTime = 0;
    let frame = 0;
    const tick = () => {
      const dt = clock.getDelta();
      if (!still) simTime += dt;
      movers.forEach((m) => m.update(simTime, view === "column" ? speed.current : 1));
      controls.update();
      renderer.render(scene, camera);
      labels.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    tick();

    const resize = new ResizeObserver(() => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      labels.setSize(w, h);
    });
    resize.observe(host);

    return () => {
      live = false;
      cancelAnimationFrame(frame);
      resize.disconnect();
      controls.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            Object.values(m).forEach((v) => v instanceof THREE.Texture && v.dispose());
            m.dispose();
          });
        }
      });
      renderer.dispose();
      host.removeChild(renderer.domElement);
      host.removeChild(labels.domElement);
    };
  }, [view, t]);

  const tab = (v: View, name: string) => (
    <button
      type="button"
      onClick={() => setView(v)}
      aria-pressed={view === v}
      className={`flex-1 rounded-[1px] px-3 py-1.5 text-sm transition-colors ${
        view === v ? "bg-accent text-white" : "text-muted hover:text-ink"
      }`}
    >
      {name}
    </button>
  );

  return (
    <div className="my-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-[260px] flex-1 rounded-sm border border-line p-0.5">
          {tab("habitat", t.habitat)}
          {tab("column", t.column)}
        </div>
        {view === "column" ? (
          <div className="flex rounded-sm border border-line p-0.5">
            {[true, false].map((m) => (
              <button
                key={String(m)}
                type="button"
                onClick={() => setMars(m)}
                aria-pressed={mars === m}
                className={`rounded-[1px] px-3 py-1.5 text-sm ${mars === m ? "bg-accent text-white" : "text-muted hover:text-ink"}`}
              >
                {m ? t.mars : t.earth}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="relative mt-4">
        <div
          ref={mount}
          className="relative h-[460px] w-full overflow-hidden rounded-sm border border-line bg-surface sm:h-[540px]"
        />
        <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-sm border border-line bg-ground/80">
          {[
            ["+", 0.8],
            ["−", 1.25],
          ].map(([sign, factor]) => (
            <button
              key={sign}
              type="button"
              aria-label={sign === "+" ? "zoom in" : "zoom out"}
              onClick={() => zoom.current(factor as number)}
              className="h-9 w-9 font-mono text-lg text-muted hover:bg-raised hover:text-ink"
            >
              {sign}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.1em] text-faint">
        {view === "habitat"
          ? (Object.keys(FLOW) as (keyof typeof FLOW)[]).map((k) => (
              <span key={k} className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: FLOW[k] }} />
                {t.legend[k]}
              </span>
            ))
          : null}
        <span className="normal-case tracking-normal">{t.hint}</span>
      </div>
      <p className="mt-3 text-sm text-muted">{view === "habitat" ? t.habitatNote : t.columnNote}</p>
      {loaded === view ? <p className="mt-1 text-xs text-faint">{t.credit}</p> : null}
    </div>
  );
}

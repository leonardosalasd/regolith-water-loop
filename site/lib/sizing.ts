import c from "./sizing-constants.json";

export type Base = keyof typeof c.hygieneWastewater;
export type Range = [number, number];

export const constants = c;

const pyrolysableShare = Object.values(c.pyrolysable).reduce((sum, [share]) => sum + share, 0);
const moistureShare = Object.values(c.pyrolysable).reduce((sum, [share, wet]) => sum + share * wet, 0);

export const gravityFactor = c.marsGravity / c.earthGravity;
export const benchArea = Math.PI * (c.benchBore / 2) ** 2;

export function size(crew: number, base: Base) {
  const greywater = crew * c.hygieneWastewater[base];
  const flow = greywater / 1000 / 24;
  const [slow, fast] = c.filtrationRate;
  const area: Range = [flow / fast, flow / slow];
  const areaMars: Range = [area[0] / gravityFactor, area[1] / gravityFactor];
  const trash = crew * c.trash;
  const feed = trash * pyrolysableShare;
  const water = trash * moistureShare;
  const dry = feed - water;
  const energy: Range = [
    dry * c.pyrolysisEnergy[0] + water * c.waterToSteam,
    dry * c.pyrolysisEnergy[1] + water * c.waterToSteam,
  ];
  return {
    greywater,
    flowPerHour: greywater / 24,
    area,
    areaMars,
    columns: [area[0] / benchArea, area[1] / benchArea] as Range,
    columnsMars: [areaMars[0] / benchArea, areaMars[1] / benchArea] as Range,
    trash,
    feed,
    water,
    charDry: dry * c.charYield,
    charUpper: feed * c.charYield,
    energy,
    power: [(energy[0] * 1e6) / 86400, (energy[1] * 1e6) / 86400] as Range,
    oxygen: crew * c.crewOxygen,
  };
}

export function perchlorate(regolithKg: number, fraction: number) {
  const clo4 = regolithKg * fraction;
  const mol = (clo4 * 1000) / c.molarMass.ClO4;
  return {
    perchlorate: clo4,
    acetate: (mol * c.molarMass.acetate) / 1000,
    oxygen: (mol * c.molarMass.O2) / 1000,
    chloride: (mol * c.molarMass.Cl) / 1000,
  };
}

export function marsHead() {
  return (c.chargeDepth + c.bedDepth) / gravityFactor - c.bedDepth;
}

export const cartridgeRegolith = Object.entries(c.benchMedia)
  .filter(([name]) => !c.charMedia.includes(name))
  .reduce((sum, [, kg]) => sum + kg, 0);

export const cartridgeChar = c.charMedia.reduce(
  (sum, name) => sum + c.benchMedia[name as keyof typeof c.benchMedia],
  0,
);

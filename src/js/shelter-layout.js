export const SHELTER_GRID_COLUMNS = 12;
export const SHELTER_GRID_ROWS = 8;

export const SHELTER_FIXED_STRUCTURES = [
  {
    id: "shelter_core",
    label: "Held Room",
    short: "HQ",
    detail: "Main room. The only reason the run exists.",
    kind: "core",
    spriteId: "shelter_core",
    footprint: [2, 2],
    placeable: false,
    defaultPosition: { x: 5, y: 3 },
  },
  {
    id: "perimeter_fence",
    upgradeId: "basic_barricade",
    label: "Perimeter Fence",
    short: "PF",
    detail: "Scrap fence, gate line, and the edge of the shelter.",
    kind: "defense",
    spriteId: "perimeter_fence",
    footprint: [12, 8],
    placeable: false,
    defaultPosition: { x: 1, y: 1 },
  },
];

export const SHELTER_PLACEABLE_STRUCTURES = [
  {
    id: "shelter_stash",
    upgradeId: "shelter_stash",
    label: "Stash",
    short: "ST",
    detail: "Secure salvage and ration storage.",
    kind: "storage",
    spriteId: "stash",
    footprint: [2, 1],
    placeable: true,
    defaultPosition: { x: 4, y: 5 },
  },
  {
    id: "campfire",
    upgradeId: "campfire",
    label: "Campfire",
    short: "CF",
    detail: "Heat, morale, and the center of the shelter line.",
    kind: "support",
    spriteId: "campfire",
    footprint: [2, 2],
    placeable: true,
    defaultPosition: { x: 6, y: 5 },
  },
  {
    id: "survivor_cots",
    upgradeId: "survivor_cots",
    label: "Cots",
    short: "CT",
    detail: "Rest line for survivors and wound recovery.",
    kind: "support",
    spriteId: "cots",
    footprint: [2, 1],
    placeable: true,
    defaultPosition: { x: 2, y: 5 },
  },
  {
    id: "smokehouse",
    upgradeId: "smokehouse",
    label: "Smokehouse",
    short: "SH",
    detail: "Preserves food and supports the shelter kitchen line.",
    kind: "support",
    spriteId: "smokehouse",
    footprint: [2, 2],
    placeable: true,
    defaultPosition: { x: 1, y: 6 },
  },
  {
    id: "food_crate",
    upgradeId: "food_crate",
    label: "Food Crate",
    short: "FC",
    detail: "Dry rations and food buffer storage.",
    kind: "storage",
    spriteId: "crate",
    footprint: [1, 1],
    placeable: true,
    defaultPosition: { x: 3, y: 6 },
  },
  {
    id: "rain_collector",
    upgradeId: "rain_collector",
    label: "Collector",
    short: "RC",
    detail: "Rain capture and raw water intake.",
    kind: "utility",
    spriteId: "collector",
    footprint: [2, 2],
    placeable: true,
    defaultPosition: { x: 1, y: 2 },
  },
  {
    id: "water_still",
    upgradeId: "water_still",
    label: "Water Still",
    short: "WS",
    detail: "Turns dirty intake into drinkable water.",
    kind: "support",
    spriteId: "water_still",
    footprint: [2, 2],
    placeable: true,
    defaultPosition: { x: 3, y: 2 },
  },
  {
    id: "crafting_bench",
    upgradeId: "crafting_bench",
    label: "Workbench",
    short: "WB",
    detail: "Main construction and tool assembly line.",
    kind: "utility",
    spriteId: "bench",
    footprint: [2, 2],
    placeable: true,
    defaultPosition: { x: 8, y: 4 },
  },
  {
    id: "weapon_rack",
    upgradeId: "weapon_rack",
    label: "Weapon Rack",
    short: "WR",
    detail: "Weapons storage and quick arming point.",
    kind: "utility",
    spriteId: "rack",
    footprint: [1, 2],
    placeable: true,
    defaultPosition: { x: 10, y: 4 },
  },
  {
    id: "armor_hooks",
    upgradeId: "armor_hooks",
    label: "Armor Hooks",
    short: "AH",
    detail: "Hang armor and travel gear close to the exit.",
    kind: "utility",
    spriteId: "hooks",
    footprint: [1, 2],
    placeable: true,
    defaultPosition: { x: 11, y: 4 },
  },
  {
    id: "watch_post",
    upgradeId: "watch_post",
    label: "Watch Post",
    short: "WT",
    detail: "Sightline over the perimeter and road edge.",
    kind: "defense",
    spriteId: "watch_post",
    footprint: [1, 2],
    placeable: true,
    defaultPosition: { x: 11, y: 1 },
  },
  {
    id: "tripwire_grid",
    upgradeId: "tripwire_grid",
    label: "Tripwire Grid",
    short: "TW",
    detail: "Outer snare line and breach warning strip.",
    kind: "defense",
    spriteId: "tripwire_grid",
    footprint: [2, 1],
    placeable: true,
    defaultPosition: { x: 9, y: 7 },
  },
  {
    id: "ammo_press",
    upgradeId: "ammo_press",
    label: "Ammo Press",
    short: "AP",
    detail: "Bench-fed round assembly and casing work.",
    kind: "utility",
    spriteId: "ammo_press",
    footprint: [1, 1],
    placeable: true,
    defaultPosition: { x: 10, y: 6 },
  },
  {
    id: "repair_rig",
    upgradeId: "repair_rig",
    label: "Repair Rig",
    short: "RR",
    detail: "Field repairs, patching, and salvage recovery.",
    kind: "utility",
    spriteId: "repair_rig",
    footprint: [2, 1],
    placeable: true,
    defaultPosition: { x: 8, y: 7 },
  },
  {
    id: "radio_rig",
    upgradeId: "radio_rig",
    label: "Radio Rig",
    short: "RD",
    detail: "Main receiver and signal interception rig.",
    kind: "signal",
    spriteId: "radio_rig",
    footprint: [2, 2],
    placeable: true,
    defaultPosition: { x: 5, y: 1 },
  },
  {
    id: "signal_decoder",
    upgradeId: "signal_decoder",
    label: "Decoder",
    short: "SD",
    detail: "Signal parsing and anomaly filtering block.",
    kind: "signal",
    spriteId: "signal_decoder",
    footprint: [1, 1],
    placeable: true,
    defaultPosition: { x: 7, y: 1 },
  },
  {
    id: "battery_bank",
    upgradeId: "battery_bank",
    label: "Battery Bank",
    short: "BB",
    detail: "Reserve cells and shelter power buffer.",
    kind: "signal",
    spriteId: "battery_bank",
    footprint: [2, 1],
    placeable: true,
    defaultPosition: { x: 8, y: 2 },
  },
  {
    id: "flood_lights",
    upgradeId: "flood_lights",
    label: "Flood Lights",
    short: "FL",
    detail: "Hard perimeter light for siege nights.",
    kind: "defense",
    spriteId: "flood_lights",
    footprint: [1, 1],
    placeable: true,
    defaultPosition: { x: 10, y: 2 },
  },
  {
    id: "trader_beacon",
    upgradeId: "trader_beacon",
    label: "Beacon",
    short: "BC",
    detail: "Long-range signal marker and lure.",
    kind: "signal",
    spriteId: "beacon",
    footprint: [1, 2],
    placeable: true,
    defaultPosition: { x: 9, y: 1 },
  },
  {
    id: "auto_scavenger",
    upgradeId: "auto_scavenger",
    label: "Crawler",
    short: "CR",
    detail: "Small salvage runner for low-risk recovery.",
    kind: "utility",
    spriteId: "crawler",
    footprint: [1, 1],
    placeable: true,
    defaultPosition: { x: 11, y: 6 },
  },
  {
    id: "scout_bike",
    upgradeId: "scout_bike",
    label: "Scout Bike",
    short: "BK",
    detail: "Fast route prep and road contact ride.",
    kind: "support",
    spriteId: "bike",
    footprint: [2, 1],
    placeable: true,
    defaultPosition: { x: 4, y: 7 },
  },
  {
    id: "faraday_mesh",
    upgradeId: "faraday_mesh",
    label: "Mesh Node",
    short: "FM",
    detail: "Grounded shielding on the outer line.",
    kind: "signal",
    spriteId: "mesh",
    footprint: [1, 1],
    placeable: true,
    defaultPosition: { x: 1, y: 1 },
  },
  {
    id: "relay_tap",
    upgradeId: "relay_tap",
    label: "Relay Tap",
    short: "RT",
    detail: "Stolen power and signal feed line.",
    kind: "signal",
    spriteId: "relay_tap",
    footprint: [1, 1],
    placeable: true,
    defaultPosition: { x: 10, y: 1 },
  },
  {
    id: "bunker_drill",
    upgradeId: "bunker_drill",
    label: "Drill",
    short: "DR",
    detail: "Deep access rig for buried entry work.",
    kind: "utility",
    spriteId: "bunker_drill",
    footprint: [2, 1],
    placeable: true,
    defaultPosition: { x: 8, y: 8 },
  },
];

export const SHELTER_STRUCTURE_DEFS = [
  ...SHELTER_FIXED_STRUCTURES,
  ...SHELTER_PLACEABLE_STRUCTURES,
];

const STRUCTURES_BY_ID = Object.fromEntries(
  SHELTER_STRUCTURE_DEFS.map((structure) => [structure.id, structure]),
);

export function shelterStructureById(id) {
  return STRUCTURES_BY_ID[id] || null;
}

export function isStructureBuilt(upgrades, structure) {
  if (structure.id === "shelter_core") {
    return true;
  }
  return !structure.upgradeId || upgrades.includes(structure.upgradeId);
}

export function builtShelterStructures(upgrades) {
  return SHELTER_STRUCTURE_DEFS.filter((structure) => isStructureBuilt(upgrades, structure));
}

export function builtPlaceableStructures(upgrades) {
  return SHELTER_PLACEABLE_STRUCTURES.filter((structure) => isStructureBuilt(upgrades, structure));
}

export function structureArea(structure, position = structure.defaultPosition) {
  const [width, height] = structure.footprint;
  return {
    x1: position.x,
    y1: position.y,
    x2: position.x + width - 1,
    y2: position.y + height - 1,
  };
}

function areasOverlap(left, right) {
  return !(left.x2 < right.x1 || left.x1 > right.x2 || left.y2 < right.y1 || left.y1 > right.y2);
}

export function canPlaceShelterStructure(placed, structureId, x, y, builtIds) {
  const structure = shelterStructureById(structureId);
  if (!structure || !structure.placeable || !builtIds.includes(structureId)) {
    return false;
  }
  const area = structureArea(structure, { x, y });
  if (
    area.x1 < 1
    || area.y1 < 1
    || area.x2 > SHELTER_GRID_COLUMNS
    || area.y2 > SHELTER_GRID_ROWS
  ) {
    return false;
  }

  const fixedCore = shelterStructureById("shelter_core");
  const coreArea = structureArea(fixedCore);
  if (areasOverlap(area, coreArea)) {
    return false;
  }

  return builtIds.every((otherId) => {
    if (otherId === structureId) {
      return true;
    }
    const other = shelterStructureById(otherId);
    if (!other || !other.placeable) {
      return true;
    }
    const position = placed[otherId];
    if (!position) {
      return true;
    }
    return !areasOverlap(area, structureArea(other, position));
  });
}

export function seedShelterPlacedLayout(upgrades, existingPlaced = {}) {
  const builtIds = builtPlaceableStructures(upgrades).map((structure) => structure.id);
  const placed = {};

  builtIds.forEach((structureId) => {
    const structure = shelterStructureById(structureId);
    const current = existingPlaced[structureId];
    if (current && canPlaceShelterStructure({ ...placed, [structureId]: current }, structureId, current.x, current.y, builtIds)) {
      placed[structureId] = { x: current.x, y: current.y };
      return;
    }

    const fallback = structure.defaultPosition;
    if (canPlaceShelterStructure({ ...placed, [structureId]: fallback }, structureId, fallback.x, fallback.y, builtIds)) {
      placed[structureId] = { x: fallback.x, y: fallback.y };
    }
  });

  return placed;
}

export function structureUpgradeId(structureId) {
  return shelterStructureById(structureId)?.upgradeId || null;
}

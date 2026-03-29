import { UPGRADES_BY_ID } from "../content/index.js";
import { addLog, canAfford, spendResources } from "./shared.js";
import { clamp, pickOne } from "./utils.js";

const STRUCTURE_SIGNAL_IDS = new Set(["radio_rig", "signal_decoder", "trader_beacon", "faraday_mesh", "relay_tap"]);
const STRUCTURE_UTILITY_IDS = new Set(["crafting_bench", "ammo_press", "rain_collector", "bunker_drill"]);
const STRUCTURE_DEFENSE_IDS = new Set(["basic_barricade", "watch_post"]);

function structureKey(structureId) {
  return structureId || "shelter_core";
}

export function getStructureDamage(state, structureId) {
  return state.shelter.damage?.[structureKey(structureId)] || 0;
}

export function setStructureDamage(state, structureId, value) {
  const key = structureKey(structureId);
  state.shelter.damage[key] = clamp(Math.round(value), 0, 3);
  if (state.shelter.damage[key] <= 0) {
    delete state.shelter.damage[key];
  }
}

export function addStructureDamage(state, structureId, amount = 1) {
  setStructureDamage(state, structureId, getStructureDamage(state, structureId) + amount);
}

function builtStructureKeys(state) {
  const keys = ["shelter_core"];
  state.upgrades.forEach((upgradeId) => {
    keys.push(upgradeId);
  });
  return [...new Set(keys)];
}

export function pickDamageTarget(state, preferred = []) {
  const available = [...new Set([...preferred, ...builtStructureKeys(state)])];
  return pickOne(available.filter(Boolean)) || "shelter_core";
}

export function damageLabel(key) {
  if (key === "basic_barricade") {
    return "Perimeter Fence";
  }
  if (key === "shelter_core") {
    return "Held Room";
  }
  return UPGRADES_BY_ID[key]?.name || key;
}

function damagePartsCost(structureId) {
  if (STRUCTURE_SIGNAL_IDS.has(structureId)) {
    return { parts: 1, wire: 1 };
  }
  if (STRUCTURE_UTILITY_IDS.has(structureId) || STRUCTURE_DEFENSE_IDS.has(structureId)) {
    return { parts: 1 };
  }
  return {};
}

export function getRepairCost(state, structureId) {
  const damage = getStructureDamage(state, structureId);
  if (damage <= 0) {
    return {};
  }

  return {
    scrap: 3 + damage * 2,
    ...damagePartsCost(structureId),
  };
}

export function repairStructure(state, structureId) {
  const cost = getRepairCost(state, structureId);
  if (!Object.keys(cost).length || !canAfford(state, cost)) {
    return false;
  }

  spendResources(state, cost);
  setStructureDamage(state, structureId, getStructureDamage(state, structureId) - 1);
  addLog(state, `You shore up ${damageLabel(structureId)} before the next bad night remembers it.`, "build");
  return true;
}

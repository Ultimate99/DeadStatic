import { ITEMS } from "../data.js";
import { UPGRADES_BY_ID } from "../content/index.js";
import { addLog, addResource, applyEffectBundle, canAfford, evaluateProgression, getDerivedState, hasItem, hasMaterials, requirementsMet, spendMaterials, spendResources } from "./shared.js";
import { getStructureDamage, setStructureDamage } from "./structures.js";
import { clamp } from "./utils.js";

export function buyUpgrade(state, upgradeId) {
  const upgrade = UPGRADES_BY_ID[upgradeId];
  if (!upgrade || state.upgrades.includes(upgradeId)) {
    return false;
  }
  if (
    !requirementsMet(state, upgrade.requires)
    || !canAfford(state, upgrade.cost)
    || !hasMaterials(state, upgrade.materials)
  ) {
    return false;
  }

  spendResources(state, upgrade.cost);
  spendMaterials(state, upgrade.materials);
  state.upgrades.push(upgradeId);
  applyEffectBundle(state, upgrade.effects);
  addLog(state, `Built: ${upgrade.name}. ${upgrade.description}`, "build");
  evaluateProgression(state);
  return true;
}

export function equipItem(state, itemId) {
  const item = ITEMS[itemId];
  if (!item || !hasItem(state, itemId)) {
    return false;
  }

  if (item.type === "weapon") {
    state.equipped.weapon = itemId;
    addLog(state, `Equipped: ${item.name}.`, "build");
    return true;
  }
  if (item.type === "armor") {
    state.equipped.armor = itemId;
    addLog(state, `Equipped: ${item.name}.`, "build");
    return true;
  }

  return false;
}

export function useItem(state, itemId) {
  const item = ITEMS[itemId];
  if (!item || !hasItem(state, itemId) || item.type !== "consumable") {
    return false;
  }

  state.inventory[itemId] -= 1;
  if (state.inventory[itemId] <= 0) {
    delete state.inventory[itemId];
  }

  if (item.heal) {
    state.condition = clamp(state.condition + item.heal, 0, getDerivedState(state).maxCondition);
  }
  if (item.resources) {
    Object.entries(item.resources).forEach(([resourceId, amount]) => addResource(state, resourceId, amount));
  }
  if (item.condition) {
    state.condition = clamp(state.condition + item.condition, 0, getDerivedState(state).maxCondition);
  }

  addLog(state, `Used: ${item.name}.`, "loot");
  evaluateProgression(state);
  return true;
}

export function useBestMedicalItem(state) {
  if (hasItem(state, "bandage_roll")) {
    return useItem(state, "bandage_roll");
  }
  if (hasItem(state, "first_aid_rag")) {
    return useItem(state, "first_aid_rag");
  }
  return false;
}

export function eatRation(state) {
  if (state.resources.food < 1) {
    return false;
  }

  state.resources.food -= 1;
  state.condition = clamp(state.condition + 8, 0, getDerivedState(state).maxCondition);
  addResource(state, "morale", 1);
  addLog(state, "You eat while the shelter creaks around you.", "loot");
  return true;
}

export function patchBarricade(state) {
  if (state.resources.scrap < 6) {
    return false;
  }

  state.resources.scrap -= 6;
  state.shelter.threat = clamp(state.shelter.threat - 2, 0, 12);
  state.shelter.warmth = clamp(state.shelter.warmth + 1, 0, 10);
  state.shelter.noise = clamp(state.shelter.noise + 0.14, 0, 10);
  if (state.upgrades.includes("basic_barricade")) {
    setStructureDamage(state, "basic_barricade", getStructureDamage(state, "basic_barricade") - 1);
  }
  addLog(state, "You patch weak seams with metal and stubbornness.", "build");
  return true;
}

export function craftAmmo(state) {
  if (
    !state.upgrades.includes("ammo_press")
    || state.resources.parts < 1
    || state.resources.scrap < 1
    || state.resources.chemicals < 1
  ) {
    return false;
  }

  state.resources.parts -= 1;
  state.resources.scrap -= 1;
  state.resources.chemicals -= 1;
  addResource(state, "ammo", 5);
  addLog(state, "You press a handful of ugly rounds that should still work.", "build");
  return true;
}

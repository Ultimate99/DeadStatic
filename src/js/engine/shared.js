import { ITEMS, RESOURCE_DEFS, RESOURCE_ORDER } from "../data.js";
import { FACTIONS_BY_ID, SCAVENGE_SOURCES, UPGRADES, UPGRADES_BY_ID, ZONES_BY_ID } from "../content/index.js";
import { stateMeetsRequirements } from "../selectors/index.js";
import { clamp, hourStamp } from "./utils.js";

const MAX_LOG_LINES = 60;
const DERIVED_NUMERIC_KEYS = [
  "maxCondition",
  "burnCondition",
  "defense",
  "searchScrapMin",
  "searchScrapMax",
  "searchFoodChance",
  "searchPartChance",
  "searchMedicineChance",
  "conditionRegen",
  "survivorCap",
  "expeditionLootBonus",
  "scoutBonus",
  "radioDepth",
  "attack",
  "searchBonusRolls",
  "rareLootBonus",
];

export function getTimeStamp(state) {
  return `D${state.time.day} ${hourStamp(state.time.hour)}`;
}

export function addLog(state, text, category = "general") {
  state.log.unshift({
    stamp: getTimeStamp(state),
    text,
    category,
  });
  state.log = state.log.slice(0, MAX_LOG_LINES);
}

export function markEventSeen(state, eventId) {
  if (!state.seenEvents.includes(eventId)) {
    state.seenEvents.push(eventId);
  }
}

export function hasUpgrade(state, upgradeId) {
  return state.upgrades.includes(upgradeId);
}

export function hasItem(state, itemId) {
  return (state.inventory[itemId] || 0) > 0;
}

export function discoverResource(state, resourceId) {
  if (!RESOURCE_DEFS[resourceId]) {
    return;
  }

  if (!state.discoveredResources.includes(resourceId)) {
    state.discoveredResources.push(resourceId);
  }
}

export function unlockSection(state, sectionId, text) {
  if (!state.unlockedSections.includes(sectionId)) {
    state.unlockedSections.push(sectionId);
    if (text) {
      addLog(state, text);
    }
  }
}

export function unlockZone(state, zoneId, text) {
  if (!ZONES_BY_ID[zoneId]) {
    return;
  }

  if (!state.unlockedZones.includes(zoneId)) {
    state.unlockedZones.push(zoneId);
    if (text) {
      addLog(state, text);
    }
  }
}

function mergeEffectsIntoDerived(derived, effects = {}) {
  DERIVED_NUMERIC_KEYS.forEach((key) => {
    if (typeof effects[key] === "number") {
      derived[key] += effects[key];
    }
  });

  if (effects.passive) {
    Object.entries(effects.passive).forEach(([resourceId, amount]) => {
      derived.passive[resourceId] += amount;
    });
  }

  if (effects.weaponSlot) {
    derived.weaponSlot = true;
  }

  if (effects.armorSlot) {
    derived.armorSlot = true;
  }
}

export function getDerivedState(state) {
  const derived = {
    maxCondition: 100,
    burnCondition: 12,
    defense: 0,
    searchScrapMin: 1,
    searchScrapMax: 4,
    searchFoodChance: 0.04,
    searchPartChance: 0.03,
    searchMedicineChance: 0.01,
    conditionRegen: 0,
    survivorCap: 0,
    expeditionLootBonus: 0,
    scoutBonus: 0,
    radioDepth: 0,
    attack: 2,
    searchBonusRolls: 0,
    rareLootBonus: 0,
    weaponSlot: false,
    armorSlot: false,
    passive: Object.fromEntries(RESOURCE_ORDER.map((resourceId) => [resourceId, 0])),
  };

  state.upgrades.forEach((upgradeId) => {
    mergeEffectsIntoDerived(derived, UPGRADES_BY_ID[upgradeId]?.effects);
  });

  if (state.faction.aligned) {
    mergeEffectsIntoDerived(derived, FACTIONS_BY_ID[state.faction.aligned]?.effects);
  }

  const assigned = state.survivors.assigned;
  derived.passive.scrap += assigned.scavenger * 0.08;
  derived.passive.parts += assigned.scavenger * 0.03;
  derived.defense += assigned.guard;
  derived.conditionRegen += assigned.medic * 0.04;
  derived.expeditionLootBonus += assigned.scout * 0.08;
  derived.scoutBonus += assigned.scout * 0.06;
  derived.radioDepth += assigned.tuner * 0.25;
  derived.passive.reputation += assigned.tuner * 0.03;

  const equippedWeapon = ITEMS[state.equipped.weapon];
  const equippedArmor = ITEMS[state.equipped.armor];
  if (equippedWeapon?.attack) {
    derived.attack += equippedWeapon.attack;
  }
  if (equippedArmor?.defense) {
    derived.defense += equippedArmor.defense;
  }

  derived.attack += Math.floor(state.resources.morale / 4);
  derived.defense += Math.floor(state.resources.reputation / 12);
  derived.survivorCap += 1;

  return derived;
}

export function requirementsMet(state, requirements = {}) {
  return stateMeetsRequirements(state, requirements, hasItem);
}

function sourceAvailable(state, source) {
  return Boolean(source && requirementsMet(state, source.requires));
}

export function getAvailableScavengeSources(state) {
  return SCAVENGE_SOURCES.filter((source) => sourceAvailable(state, source));
}

export function canAfford(state, cost = {}) {
  return Object.entries(cost).every(([resourceId, amount]) => state.resources[resourceId] >= amount);
}

export function hasMaterials(state, materials = {}) {
  return Object.entries(materials).every(([itemId, amount]) => (state.inventory[itemId] || 0) >= amount);
}

export function spendResources(state, cost = {}) {
  Object.entries(cost).forEach(([resourceId, amount]) => {
    state.resources[resourceId] = Math.max(0, state.resources[resourceId] - amount);
  });
}

export function spendMaterials(state, materials = {}) {
  Object.entries(materials).forEach(([itemId, amount]) => {
    state.inventory[itemId] = Math.max(0, (state.inventory[itemId] || 0) - amount);
    if (state.inventory[itemId] <= 0) {
      delete state.inventory[itemId];
    }
  });
}

export function addResource(state, resourceId, amount) {
  if (!RESOURCE_DEFS[resourceId] || !amount) {
    return;
  }

  state.resources[resourceId] = Math.max(0, state.resources[resourceId] + amount);
  if (state.resources[resourceId] > 0) {
    discoverResource(state, resourceId);
  }
}

export function grantItem(state, itemId, amount = 1) {
  state.inventory[itemId] = (state.inventory[itemId] || 0) + amount;
  const item = ITEMS[itemId];
  if (!item) {
    return;
  }

  if (item.type === "material" && !state.unlockedSections.includes("inventory")) {
    unlockSection(state, "inventory", "You recover usable material, not just junk. A real inventory starts to matter.");
  }

  if (item.type === "weapon" && !state.equipped.weapon) {
    state.equipped.weapon = itemId;
  }

  if (item.type === "armor" && !state.equipped.armor) {
    state.equipped.armor = itemId;
  }
}

export function applyEffectBundle(state, effects = {}) {
  if (effects.resources) {
    Object.entries(effects.resources).forEach(([resourceId, amount]) => {
      addResource(state, resourceId, amount);
    });
  }

  if (effects.condition) {
    const maxCondition = getDerivedState(state).maxCondition;
    state.condition = clamp(state.condition + effects.condition, 0, maxCondition);
  }

  if (effects.grantItems) {
    Object.entries(effects.grantItems).forEach(([itemId, amount]) => {
      grantItem(state, itemId, amount);
    });
  }

  if (effects.discoverResources) {
    effects.discoverResources.forEach((resourceId) => discoverResource(state, resourceId));
  }

  if (effects.unlockSections) {
    effects.unlockSections.forEach((sectionId) => unlockSection(state, sectionId));
  }

  if (effects.unlockZones) {
    effects.unlockZones.forEach((zoneId) => unlockZone(state, zoneId));
  }

  if (effects.setFlags) {
    Object.assign(state.flags, effects.setFlags);
  }

  if (effects.radioProgress) {
    state.story.radioProgress += effects.radioProgress;
  }

  if (effects.secretProgress) {
    state.story.secretProgress += effects.secretProgress;
  }
}

export function formatCost(cost = {}) {
  return Object.entries(cost)
    .map(([resourceId, amount]) => `${RESOURCE_DEFS[resourceId].label} ${amount}`)
    .join(" / ");
}

export function formatMaterials(materials = {}) {
  return Object.entries(materials)
    .map(([itemId, amount]) => `${ITEMS[itemId]?.name || itemId} ${amount}`)
    .join(" / ");
}

export function getVisibleUpgrades(state) {
  return UPGRADES.filter((upgrade) => state.upgrades.includes(upgrade.id) || requirementsMet(state, upgrade.requires));
}

export function getAvailableUpgrades(state) {
  return UPGRADES.filter((upgrade) => !state.upgrades.includes(upgrade.id) && requirementsMet(state, upgrade.requires));
}

export function evaluateProgression(state) {
  if (state.stats.searches >= 3 && !state.flags.burnUnlocked) {
    state.flags.burnUnlocked = true;
    addLog(state, "Cold makes simple math persuasive. Ten scrap for warmth suddenly sounds fair.");
  }

  if ((state.stats.searches >= 4 || state.resources.scrap >= 8) && !state.unlockedSections.includes("upgrades")) {
    unlockSection(state, "upgrades", "Plans start replacing panic. You can build.");
  }

  if (hasUpgrade(state, "shelter_stash") || hasUpgrade(state, "campfire") || hasUpgrade(state, "basic_barricade")) {
    unlockSection(state, "shelter");
  }

  if (hasUpgrade(state, "rusty_knife") || hasUpgrade(state, "weapon_rack") || hasUpgrade(state, "armor_hooks")) {
    unlockSection(state, "inventory");
  }

  if (hasUpgrade(state, "small_scavenge") || hasUpgrade(state, "map_board")) {
    unlockSection(state, "map");
  }

  if (hasUpgrade(state, "survivor_cots")) {
    unlockSection(state, "survivors");
    discoverResource(state, "morale");
  }

  if (hasUpgrade(state, "radio_rig")) {
    unlockSection(state, "radio");
    discoverResource(state, "reputation");
  }

  if (hasUpgrade(state, "trader_beacon")) {
    unlockSection(state, "trader");
  }

  if (state.story.radioProgress >= 4 || hasItem(state, "relay_key")) {
    unlockSection(state, "factions");
  }

  if (state.story.secretProgress >= 2 && hasItem(state, "relay_key") && !state.flags.bunkerRouteKnown) {
    state.flags.bunkerRouteKnown = true;
    unlockZone(state, "hidden_bunker_entrance", "A pattern in the static and a key in your hand point to a bunker route under the city.");
  }

  RESOURCE_ORDER.forEach((resourceId) => {
    if (state.resources[resourceId] > 0) {
      discoverResource(state, resourceId);
    }
  });
}

export function markZoneVisited(state, zoneId) {
  if (!state.visitedZones.includes(zoneId)) {
    state.visitedZones.push(zoneId);
    state.stats.zonesVisited = state.visitedZones.length;
  }
}

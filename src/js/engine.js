import {
  ITEMS,
  RARITY_ORDER,
  RESOURCE_DEFS,
  RESOURCE_ORDER,
  SURVIVOR_NAME_POOL,
  SURVIVOR_ROLES,
  SURVIVOR_TRAITS,
} from "./data.js";
import {
  ENEMIES,
  EXPEDITION_ROUTE_EVENTS,
  EXPEDITION_OBJECTIVES,
  EXPEDITION_OBJECTIVES_BY_ID,
  EXPEDITION_APPROACHES,
  EXPEDITION_APPROACHES_BY_ID,
  FACTIONS_BY_ID,
  RADIO_INVESTIGATIONS,
  RADIO_INVESTIGATIONS_BY_ID,
  SCAVENGE_SOURCES,
  SCAVENGE_SOURCES_BY_ID,
  SEARCH_LOOT_TABLE,
  TRADER_CHANNELS,
  TRADER_CHANNELS_BY_ID,
  TRADER_OFFERS,
  UPGRADES,
  UPGRADES_BY_ID,
  ZONES_BY_ID,
} from "./content.js";
import { EVENTS } from "./events.js";

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
  "salvageYieldBonus",
  "forageYieldBonus",
  "expeditionEncounterAdjust",
  "signalGain",
  "anomalyGain",
  "traderDiscount",
  "nightMitigation",
  "power",
  "coverage",
  "repairPower",
  "maintenance",
  "foodSecurity",
  "waterSecurity",
  "siegeMitigation",
];

const STRUCTURE_SIGNAL_IDS = new Set(["radio_rig", "signal_decoder", "battery_bank", "trader_beacon", "faraday_mesh", "relay_tap"]);
const STRUCTURE_UTILITY_IDS = new Set(["crafting_bench", "ammo_press", "rain_collector", "bunker_drill", "repair_rig", "battery_bank", "water_still"]);
const STRUCTURE_DEFENSE_IDS = new Set(["basic_barricade", "watch_post", "tripwire_grid", "flood_lights"]);
const STRUCTURE_UPGRADE_IDS = new Set([
  "shelter_stash",
  "campfire",
  "basic_barricade",
  "food_crate",
  "crafting_bench",
  "weapon_rack",
  "armor_hooks",
  "watch_post",
  "tripwire_grid",
  "ammo_press",
  "repair_rig",
  "rain_collector",
  "water_still",
  "radio_rig",
  "battery_bank",
  "flood_lights",
  "map_board",
  "survivor_cots",
  "smokehouse",
  "trader_beacon",
  "scout_bike",
  "signal_decoder",
  "auto_scavenger",
  "faraday_mesh",
  "relay_tap",
  "bunker_drill",
]);
const SURVIVOR_TRAIT_IDS = Object.keys(SURVIVOR_TRAITS);
const PASSIVE_RESOURCE_MULTIPLIER = 0.45;
const SHELTER_ADJACENCY_BONUSES = [
  {
    id: "food_line",
    upgrades: ["food_crate", "smokehouse"],
    label: "Food line",
    effects: { forageYieldBonus: 0.06, foodSecurity: 1 },
  },
  {
    id: "water_loop",
    upgrades: ["rain_collector", "water_still"],
    label: "Water loop",
    effects: { waterSecurity: 1, conditionRegen: 0.01 },
  },
  {
    id: "repair_line",
    upgrades: ["crafting_bench", "repair_rig"],
    label: "Repair line",
    effects: { repairPower: 1, maintenance: 1 },
  },
  {
    id: "fence_watch",
    upgrades: ["watch_post", "tripwire_grid"],
    label: "Fence watch",
    effects: { defense: 1, siegeMitigation: 0.25, coverage: 0.15 },
  },
  {
    id: "lit_perimeter",
    upgrades: ["watch_post", "flood_lights"],
    label: "Lit perimeter",
    effects: { defense: 1, coverage: 0.3, nightMitigation: 0.12 },
  },
  {
    id: "radio_stack",
    upgrades: ["radio_rig", "signal_decoder"],
    label: "Radio stack",
    effects: { signalGain: 0.1, radioDepth: 0.15, coverage: 0.25 },
  },
  {
    id: "powered_signal",
    upgrades: ["radio_rig", "battery_bank"],
    label: "Powered signal",
    effects: { power: 1, signalGain: 0.05 },
  },
  {
    id: "relay_spine",
    upgrades: ["trader_beacon", "relay_tap"],
    label: "Relay spine",
    effects: { coverage: 0.2, signalGain: 0.06, anomalyGain: 0.08 },
  },
  {
    id: "warm_beds",
    upgrades: ["survivor_cots", "campfire"],
    label: "Warm beds",
    effects: { conditionRegen: 0.01, moraleGuard: 1 },
  },
];

export const NIGHT_PLANS = {
  low_profile: {
    id: "low_profile",
    label: "Low Profile",
    description: "Kill the glow, keep voices low, and let the outside pass by.",
    defense: -1,
    noise: -0.85,
    raidBias: -0.06,
    breachBias: 0.02,
    morale: 1,
  },
  hold_fast: {
    id: "hold_fast",
    label: "Hold Fast",
    description: "Board the line, hold the center, and trust the shelter to do its job.",
    defense: 0,
    noise: 0,
    raidBias: 0,
    breachBias: 0,
    morale: 0,
  },
  counter_watch: {
    id: "counter_watch",
    label: "Counter Watch",
    description: "Keep eyes on the perimeter and answer movement before it reaches the door.",
    defense: 2,
    noise: 0.55,
    raidBias: 0.06,
    breachBias: -0.04,
    morale: -1,
  },
};

function survivorName(index) {
  return SURVIVOR_NAME_POOL[index % SURVIVOR_NAME_POOL.length];
}

function normalizeSurvivorRole(roleId) {
  return roleId && (roleId === "idle" || SURVIVOR_ROLES[roleId]) ? roleId : "idle";
}

function normalizeSurvivorRecord(survivor, index) {
  return {
    id: survivor?.id || `survivor-${index + 1}`,
    name: survivor?.name || survivorName(index),
    traitId: SURVIVOR_TRAITS[survivor?.traitId] ? survivor.traitId : SURVIVOR_TRAIT_IDS[index % SURVIVOR_TRAIT_IDS.length],
    role: normalizeSurvivorRole(survivor?.role),
    wounded: Math.max(0, survivor?.wounded || 0),
    stress: Math.max(0, survivor?.stress || 0),
  };
}

function syncSurvivorRoster(state) {
  const roster = Array.isArray(state.survivors.roster) ? state.survivors.roster : [];
  state.survivors.roster = roster.map((survivor, index) => normalizeSurvivorRecord(survivor, index));
  const assigned = Object.fromEntries(Object.keys(SURVIVOR_ROLES).map((roleId) => [roleId, 0]));
  let idle = 0;

  state.survivors.roster.forEach((survivor) => {
    if (survivor.role !== "idle" && assigned[survivor.role] !== undefined) {
      assigned[survivor.role] += 1;
    } else {
      idle += 1;
      survivor.role = "idle";
    }
  });

  state.survivors.total = state.survivors.roster.length;
  state.survivors.idle = idle;
  state.survivors.assigned = assigned;
}

function idleSurvivor(state) {
  syncSurvivorRoster(state);
  return state.survivors.roster.find((survivor) => survivor.role === "idle") || null;
}

function assignedSurvivor(state, roleId) {
  syncSurvivorRoster(state);
  return state.survivors.roster.find((survivor) => survivor.role === roleId) || null;
}

function survivorWorkFactor(survivor) {
  const woundPenalty = survivor.wounded >= 2 ? 0.45 : survivor.wounded === 1 ? 0.22 : 0;
  const stressPenalty = survivor.stress >= 7 ? 0.28 : survivor.stress >= 4 ? 0.12 : 0;
  return clamp(1 - woundPenalty - stressPenalty, 0.2, 1);
}

function rosterCandidates(state, preferredRoles = []) {
  syncSurvivorRoster(state);
  const roster = state.survivors.roster;
  const preferred = roster.filter((survivor) => preferredRoles.includes(survivor.role));
  return preferred.length ? preferred : roster;
}

function applySurvivorStress(state, amount = 1, preferredRoles = []) {
  const candidates = rosterCandidates(state, preferredRoles);
  const target = pickOne(candidates);
  if (!target) {
    return null;
  }

  target.stress = clamp(target.stress + amount, 0, 10);
  return target;
}

function applySurvivorWound(state, amount = 1, preferredRoles = []) {
  const candidates = rosterCandidates(state, preferredRoles);
  const target = pickOne(candidates);
  if (!target) {
    return null;
  }

  target.wounded = clamp(target.wounded + amount, 0, 3);
  return target;
}

function maybeTriggerCrewConflict(state) {
  syncSurvivorRoster(state);
  const strained = state.survivors.roster.filter((survivor) => survivor.stress >= 7);
  if (!strained.length || !chance(clamp(0.08 + strained.length * 0.06, 0.08, 0.4))) {
    return null;
  }

  const instigator = pickOne(strained);
  if (!instigator) {
    return null;
  }

  state.resources.morale = Math.max(0, state.resources.morale - 2);
  state.shelter.noise = clamp(state.shelter.noise + 0.28, 0, 10);
  instigator.stress = Math.max(0, instigator.stress - 2);
  addLog(state, `${instigator.name} snaps at the shelter line. The room gets louder and nobody feels steadier for it.`, "crew");
  return instigator;
}

function recoverSurvivorsAtDawn(state) {
  syncSurvivorRoster(state);
  const medicFactor = state.survivors.assigned.medic + (hasItem(state, "clinic_case") ? 1 : 0);
  if (!state.survivors.roster.length) {
    return;
  }

  const recovered = [];
  const steadied = [];
  state.survivors.roster.forEach((survivor) => {
    if (survivor.wounded > 0) {
      const canRecover = medicFactor > 0 || chance(0.18);
      if (canRecover && (medicFactor > 0 || survivor.wounded === 1)) {
        survivor.wounded = Math.max(0, survivor.wounded - 1);
        recovered.push(survivor.name);
      }
    }
    if (survivor.stress > 0) {
      const drop = 1 + (medicFactor > 0 ? 1 : 0);
      survivor.stress = Math.max(0, survivor.stress - drop);
      if (drop > 0) {
        steadied.push(survivor.name);
      }
    }
  });

  if (recovered.length) {
    addLog(state, `${recovered.join(", ")} patch up enough to stand a little cleaner at dawn.`, "crew");
  }
  if (steadied.length && chance(0.3)) {
    addLog(state, "Dawn takes some of the edge off the room. Nobody feels safe, but a few people stop shaking.", "crew");
  }
}

function survivorTraitBonuses(state) {
  syncSurvivorRoster(state);
  const totals = {
    attack: 0,
    defense: 0,
    salvageYieldBonus: 0,
    scavengeNoiseReduction: 0,
    forageYieldBonus: 0,
    conditionRegen: 0,
    expeditionLootBonus: 0,
    expeditionEncounterAdjust: 0,
    scoutBonus: 0,
    signalGain: 0,
    anomalyGain: 0,
    traderDiscount: 0,
    nightMitigation: 0,
    moraleGuard: 0,
    coverage: 0,
    repairPower: 0,
    maintenance: 0,
  };

  state.survivors.roster.forEach((survivor) => {
    const trait = SURVIVOR_TRAITS[survivor.traitId];
    if (!trait) {
      return;
    }

    if (trait.role === survivor.role) {
      const factor = survivorWorkFactor(survivor);
      switch (trait.id || survivor.traitId) {
        case "quiet_hands":
          totals.salvageYieldBonus += 0.08 * factor;
          totals.scavengeNoiseReduction += 0.08 * factor;
          break;
        case "pack_rat":
          totals.salvageYieldBonus += 0.12 * factor;
          break;
        case "hard_case":
          totals.defense += 1 * factor;
          totals.nightMitigation += 0.45 * factor;
          break;
        case "lantern_nerve":
          totals.nightMitigation += 0.2 * factor;
          totals.moraleGuard += 1 * factor;
          break;
        case "patch_saint":
          totals.conditionRegen += 0.03 * factor;
          totals.repairPower += 0.25 * factor;
          break;
        case "bone_saw":
          totals.conditionRegen += 0.04 * factor;
          totals.repairPower += 0.3 * factor;
          totals.moraleGuard -= 1 * factor;
          break;
        case "pathfinder":
          totals.expeditionEncounterAdjust -= 0.04 * factor;
          totals.scoutBonus += 0.04 * factor;
          totals.coverage += 0.08 * factor;
          break;
        case "breaker":
          totals.expeditionLootBonus += 0.06 * factor;
          totals.attack += 1 * factor;
          break;
        case "ghost_ear":
          totals.signalGain += 0.2 * factor;
          totals.coverage += 0.08 * factor;
          break;
        case "odd_frequency":
          totals.signalGain += 0.08 * factor;
          totals.anomalyGain += 0.24 * factor;
          totals.coverage += 0.06 * factor;
          totals.moraleGuard -= 1 * factor;
          break;
        default:
          break;
      }
    }
  });

  return totals;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chance(probability) {
  return Math.random() < probability;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function pickOne(list) {
  return list.length ? list[randInt(0, list.length - 1)] : null;
}

function hourStamp(hour) {
  return `${String(hour).padStart(2, "0")}:00`;
}

export function getTimeStamp(state) {
  return `D${state.time.day} ${hourStamp(state.time.hour)}`;
}

export function getShelterUpkeep(state) {
  const crew = Math.max(0, state.survivors?.total || 0);
  const mealCost = Math.max(1, 1 + Math.floor(crew / 2));
  const waterCost = Math.max(1, 1 + Math.ceil(crew / 2));
  const builtCount = Math.max(0, builtStructureKeys(state).length - 1);
  const maintenanceWood = Math.max(0, Math.floor(Math.max(0, builtCount - 3) / 4));
  const maintenanceParts = Math.max(0, Math.floor(Math.max(0, builtCount - 6) / 5));

  return {
    crew,
    mealHours: 6,
    waterHours: 4,
    maintenanceHours: 8,
    mealCost,
    waterCost,
    maintenanceWood,
    maintenanceParts,
    mealHoursLeft: Math.max(0, 6 - state.clocks.hunger),
    waterHoursLeft: Math.max(0, 4 - state.clocks.thirst),
    maintenanceHoursLeft: Math.max(0, 8 - state.clocks.maintenance),
  };
}

function adjacencyBonuses(state) {
  return SHELTER_ADJACENCY_BONUSES.filter((bonus) => bonus.upgrades.every((upgradeId) => state.upgrades.includes(upgradeId)));
}

export function getShelterSystems(state, derived = getDerivedState(state)) {
  const upkeep = getShelterUpkeep(state);
  const builtCount = Math.max(0, builtStructureKeys(state).length - 1);
  const damagedCount = Object.keys(state.shelter.damage || {}).filter((structureId) => getStructureDamage(state, structureId) > 0).length;
  const powerDemand = [
    "radio_rig",
    "signal_decoder",
    "trader_beacon",
    "relay_tap",
    "flood_lights",
    "repair_rig",
    "ammo_press",
    "bunker_drill",
  ].filter((upgradeId) => state.upgrades.includes(upgradeId)).length;
  const powerSupply = Math.max(
    0,
    1
      + derived.power
      + (hasItem(state, "tower_battery") ? 1 : 0)
      + (state.resources.fuel >= 2 && state.upgrades.includes("campfire") ? 1 : 0),
  );
  const coverage = clamp(
    1
      + derived.coverage
      + (state.upgrades.includes("watch_post") ? 1.2 : 0)
      + state.survivors.assigned.scout * 0.2
      + state.survivors.assigned.tuner * 0.25,
    0,
    12,
  );
  const maintenanceLoad = builtCount * 0.45 + damagedCount * 1.25 + upkeep.crew * 0.2;
  const maintenanceSupport = derived.maintenance + derived.repairPower + state.survivors.assigned.medic * 0.35;
  const maintenanceBalance = Number((maintenanceSupport - maintenanceLoad).toFixed(2));
  const foodInflow = Number((derived.passive.food + derived.forageYieldBonus * 0.12 + derived.foodSecurity * 0.12).toFixed(2));
  const waterInflow = Number((derived.passive.water + derived.waterSecurity * 0.14).toFixed(2));
  const foodDrain = Number((upkeep.mealCost / upkeep.mealHours).toFixed(2));
  const waterDrain = Number((upkeep.waterCost / upkeep.waterHours).toFixed(2));
  const powerGap = Math.max(0, powerDemand - powerSupply);

  return {
    builtCount,
    damagedCount,
    powerSupply,
    powerDemand,
    powerGap,
    powerState: powerGap <= 0 ? "stable" : powerGap <= 1 ? "thin" : "dark",
    coverage,
    maintenanceLoad: Number(maintenanceLoad.toFixed(2)),
    maintenanceSupport: Number(maintenanceSupport.toFixed(2)),
    maintenanceBalance,
    maintenanceState: maintenanceBalance >= 0.75 ? "stable" : maintenanceBalance >= -0.35 ? "strained" : "failing",
    foodInflow,
    foodDrain,
    foodFlow: Number((foodInflow - foodDrain).toFixed(2)),
    waterInflow,
    waterDrain,
    waterFlow: Number((waterInflow - waterDrain).toFixed(2)),
    adjacency: adjacencyBonuses(state),
  };
}

export function addLog(state, text, category = "general") {
  state.log.unshift({
    stamp: getTimeStamp(state),
    text,
    category,
  });
  state.log = state.log.slice(0, MAX_LOG_LINES);
}

function markEventSeen(state, eventId) {
  if (!state.seenEvents.includes(eventId)) {
    state.seenEvents.push(eventId);
  }
}

function hasUpgrade(state, upgradeId) {
  return state.upgrades.includes(upgradeId);
}

function structureKey(structureId) {
  return structureId || "shelter_core";
}

export function getStructureDamage(state, structureId) {
  return state.shelter.damage?.[structureKey(structureId)] || 0;
}

function setStructureDamage(state, structureId, value) {
  const key = structureKey(structureId);
  state.shelter.damage[key] = clamp(Math.round(value), 0, 3);
  if (state.shelter.damage[key] <= 0) {
    delete state.shelter.damage[key];
  }
}

function addStructureDamage(state, structureId, amount = 1) {
  setStructureDamage(state, structureId, getStructureDamage(state, structureId) + amount);
}

function builtStructureKeys(state) {
  const keys = ["shelter_core"];
  state.upgrades.forEach((upgradeId) => {
    if (STRUCTURE_UPGRADE_IDS.has(upgradeId)) {
      keys.push(upgradeId);
    }
  });
  return [...new Set(keys)];
}

function pickDamageTarget(state, preferred = []) {
  const available = [...new Set([...preferred, ...builtStructureKeys(state)])];
  return pickOne(available.filter(Boolean)) || "shelter_core";
}

function damageLabel(key) {
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
  if (STRUCTURE_UTILITY_IDS.has(structureId)) {
    return { parts: 1 };
  }
  if (STRUCTURE_DEFENSE_IDS.has(structureId)) {
    return { parts: 1 };
  }
  return {};
}

export function getRepairCost(state, structureId) {
  const damage = getStructureDamage(state, structureId);
  if (damage <= 0) {
    return {};
  }

  const cost = {
    scrap: 3 + damage * 2,
    ...damagePartsCost(structureId),
  };
  if (hasItem(state, "carpenter_kit")) {
    cost.scrap = Math.max(2, cost.scrap - 1);
  }
  if (hasItem(state, "hand_drill") && cost.parts) {
    cost.parts = Math.max(0, cost.parts - 1);
    if (cost.parts === 0) {
      delete cost.parts;
    }
  }
  return cost;
}

export function repairStructure(state, structureId) {
  const cost = getRepairCost(state, structureId);
  if (!Object.keys(cost).length || !canAfford(state, cost)) {
    return false;
  }

  spendResources(state, cost);
  const repairDepth = 1 + (hasItem(state, "carpenter_kit") ? 1 : 0) + (hasItem(state, "hand_drill") ? 1 : 0);
  setStructureDamage(state, structureId, getStructureDamage(state, structureId) - repairDepth);
  addLog(
    state,
    `You shore up ${damageLabel(structureId)} before the next bad night remembers it${repairDepth > 1 ? ", fixing more than one weak seam in the process" : ""}.`,
    "build",
  );
  return true;
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

function unlockSection(state, sectionId, text) {
  if (!state.unlockedSections.includes(sectionId)) {
    state.unlockedSections.push(sectionId);
    if (text) {
      addLog(state, text);
    }
  }
}

function unlockZone(state, zoneId, text) {
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
      derived.passive[resourceId] += amount * PASSIVE_RESOURCE_MULTIPLIER;
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
  syncSurvivorRoster(state);
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
    salvageYieldBonus: 0,
    forageYieldBonus: 0,
    expeditionEncounterAdjust: 0,
    signalGain: 0,
    anomalyGain: 0,
    traderDiscount: 0,
    nightMitigation: 0,
    power: 0,
    coverage: 0,
    repairPower: 0,
    maintenance: 0,
    foodSecurity: 0,
    waterSecurity: 0,
    siegeMitigation: 0,
    weaponSlot: false,
    armorSlot: false,
    passive: Object.fromEntries(RESOURCE_ORDER.map((resourceId) => [resourceId, 0])),
  };

  state.upgrades.forEach((upgradeId) => {
    mergeEffectsIntoDerived(derived, UPGRADES_BY_ID[upgradeId]?.effects);
  });

  const effectiveRoles = {
    scavenger: 0,
    guard: 0,
    medic: 0,
    scout: 0,
    tuner: 0,
  };
  state.survivors.roster.forEach((survivor) => {
    if (!Object.prototype.hasOwnProperty.call(effectiveRoles, survivor.role)) {
      return;
    }
    effectiveRoles[survivor.role] += survivorWorkFactor(survivor);
  });

  derived.salvageYieldBonus += effectiveRoles.scavenger * 0.06;
  derived.defense += effectiveRoles.guard;
  derived.conditionRegen += effectiveRoles.medic * 0.02;
  derived.expeditionLootBonus += effectiveRoles.scout * 0.08;
  derived.scoutBonus += effectiveRoles.scout * 0.06;
  derived.expeditionEncounterAdjust -= effectiveRoles.scout * 0.025;
  derived.radioDepth += effectiveRoles.tuner * 0.25;
  derived.signalGain += effectiveRoles.tuner * 0.12;
  derived.coverage += effectiveRoles.guard * 0.12 + effectiveRoles.scout * 0.08 + effectiveRoles.tuner * 0.1;

  const traitBonuses = survivorTraitBonuses(state);
  derived.attack += traitBonuses.attack;
  derived.defense += traitBonuses.defense;
  derived.salvageYieldBonus += traitBonuses.salvageYieldBonus;
  derived.forageYieldBonus += traitBonuses.forageYieldBonus;
  derived.conditionRegen += traitBonuses.conditionRegen;
  derived.expeditionLootBonus += traitBonuses.expeditionLootBonus;
  derived.expeditionEncounterAdjust += traitBonuses.expeditionEncounterAdjust;
  derived.scoutBonus += traitBonuses.scoutBonus;
  derived.signalGain += traitBonuses.signalGain;
  derived.anomalyGain += traitBonuses.anomalyGain;
  derived.traderDiscount += traitBonuses.traderDiscount;
  derived.nightMitigation += traitBonuses.nightMitigation;
  derived.coverage += traitBonuses.coverage;
  derived.repairPower += traitBonuses.repairPower;
  derived.maintenance += traitBonuses.maintenance;

  const equippedWeapon = ITEMS[state.equipped.weapon];
  const equippedArmor = ITEMS[state.equipped.armor];
  if (equippedWeapon?.attack) {
    derived.attack += equippedWeapon.attack;
  }
  if (equippedArmor?.defense) {
    derived.defense += equippedArmor.defense;
  }
  if (hasItem(state, "pry_bar")) {
    derived.salvageYieldBonus += 0.08;
    derived.searchPartChance += 0.06;
  }
  if (hasItem(state, "salvage_hatchet")) {
    derived.salvageYieldBonus += 0.04;
    derived.forageYieldBonus += 0.06;
    derived.nightMitigation += 0.12;
  }
  if (hasItem(state, "carpenter_kit")) {
    derived.repairPower += 1;
    derived.maintenance += 1;
    derived.nightMitigation += 0.1;
  }
  if (hasItem(state, "hand_drill")) {
    derived.repairPower += 1;
    derived.searchPartChance += 0.04;
    derived.coverage += 0.1;
  }
  if (hasItem(state, "signal_meter")) {
    derived.signalGain += 0.14;
    derived.radioDepth += 0.12;
    derived.coverage += 0.18;
  }

  adjacencyBonuses(state).forEach((bonus) => {
    mergeEffectsIntoDerived(derived, bonus.effects);
  });

  derived.attack += Math.floor(state.resources.morale / 4);
  derived.defense += Math.floor(state.resources.reputation / 12);
  derived.survivorCap += 1;

  return derived;
}

function requirementsMet(state, requirements = {}) {
  if (requirements.searches && state.stats.searches < requirements.searches) {
    return false;
  }
  if (requirements.burnUses && state.stats.burnUses < requirements.burnUses) {
    return false;
  }
  if (requirements.day && state.time.day < requirements.day) {
    return false;
  }
  if (requirements.radioProgress && state.story.radioProgress < requirements.radioProgress) {
    return false;
  }
  if (requirements.secretProgress && state.story.secretProgress < requirements.secretProgress) {
    return false;
  }
  if (requirements.survivors && state.survivors.total < requirements.survivors) {
    return false;
  }
  if (requirements.zonesVisited && state.stats.zonesVisited < requirements.zonesVisited) {
    return false;
  }
  if (requirements.reputation && state.resources.reputation < requirements.reputation) {
    return false;
  }
  if (requirements.upgrades && !requirements.upgrades.every((upgradeId) => hasUpgrade(state, upgradeId))) {
    return false;
  }
  if (requirements.items && !requirements.items.every((itemId) => hasItem(state, itemId))) {
    return false;
  }
  if (requirements.flags && !requirements.flags.every((flag) => state.flags[flag])) {
    return false;
  }

  return true;
}

function sourceAvailable(state, source) {
  return Boolean(source && requirementsMet(state, source.requires));
}

export function getAvailableScavengeSources(state) {
  return SCAVENGE_SOURCES.filter((source) => sourceAvailable(state, source));
}

function nightPlan(state) {
  return NIGHT_PLANS[state.night.plan] || NIGHT_PLANS.hold_fast;
}

function guardStrength(state) {
  return state.survivors.assigned.guard + (hasUpgrade(state, "watch_post") ? 1 : 0);
}

export function getNightForecast(state) {
  const derived = getDerivedState(state);
  const systems = getShelterSystems(state, derived);
  const plan = nightPlan(state);
  const faction = factionConsequences(state);
  const adjustedDefense = Math.max(0, derived.defense + plan.defense + derived.siegeMitigation * 0.6 + systems.coverage * 0.12);
  const adjustedNoise = clamp(state.shelter.noise + plan.noise + (faction.nightNoise || 0), 0, 10);
  const guardBonus = guardStrength(state) * 0.34;
  const signalBonus = state.survivors.assigned.tuner * 0.05;
  const maintenancePenalty = Math.max(0, -systems.maintenanceBalance);
  const dangerScore = clamp(
    state.shelter.threat * 1.5
      + adjustedNoise * 1.28
      + Math.max(0, state.time.day - 1) * 0.38
      + systems.powerGap * 0.52
      + maintenancePenalty * 0.84
      - adjustedDefense * 0.84
      - state.shelter.warmth * 0.24
      - systems.coverage * 0.22
      - guardBonus
      - signalBonus,
    0,
    14,
  );

  const infectedChance = clamp(
    0.16
      + state.shelter.threat * 0.08
      + adjustedNoise * 0.05
      + maintenancePenalty * 0.03
      - adjustedDefense * 0.018
      - systems.coverage * 0.012,
    0.1,
    0.86,
  );
  const raidChance = clamp(
    (state.time.day >= 3 ? 0.1 : 0.03)
      + adjustedNoise * 0.06
      + state.resources.reputation * 0.01
      + systems.powerGap * 0.02
      + plan.raidBias
      + (faction.raidBias || 0)
      - (faction.raidMitigation || 0)
      - systems.coverage * 0.02
      - adjustedDefense * 0.012,
    0.04,
    0.7,
  );
  const breachChance = clamp(
    0.08
      + Math.max(0, dangerScore - 1.5) * 0.06
      + maintenancePenalty * 0.035
      + plan.breachBias
      - (faction.breachMitigation || 0)
      - derived.siegeMitigation * 0.03
      - systems.coverage * 0.014
      - adjustedDefense * 0.015,
    0.03,
    0.64,
  );
  const siegeChance = clamp(
    (state.time.day >= 4 ? 0.06 : 0.01)
      + Math.max(0, dangerScore - 4.2) * 0.05
      + breachChance * 0.32
      + raidChance * 0.14
      - adjustedDefense * 0.012
      - derived.siegeMitigation * 0.03,
    0.01,
    0.56,
  );
  const quietChance = clamp(1 - (infectedChance * 0.46 + raidChance * 0.36 + breachChance * 0.32 + siegeChance * 0.28), 0.04, 0.58);
  const hoursUntilNight = state.time.hour < 21 ? 21 - state.time.hour : 24 - state.time.hour + 21;

  let severity = "Quiet";
  if (dangerScore >= 2.5) {
    severity = "Tense";
  }
  if (dangerScore >= 4.8) {
    severity = "Rough";
  }
  if (dangerScore >= 7) {
    severity = "Critical";
  }
  if (siegeChance >= 0.28 || dangerScore >= 8.2) {
    severity = "Siege";
  }

  return {
    plan,
    systems,
    adjustedDefense,
    adjustedNoise,
    dangerScore,
    infectedChance,
    raidChance,
    breachChance,
    siegeChance,
    quietChance,
    hoursUntilNight,
    severity,
  };
}

export function setNightPlan(state, planId) {
  if (!NIGHT_PLANS[planId] || state.night.plan === planId) {
    return false;
  }

  state.night.plan = planId;
  addLog(state, `Night stance set: ${NIGHT_PLANS[planId].label}.`, "night");
  return true;
}

function expeditionApproach(approachId) {
  return EXPEDITION_APPROACHES_BY_ID[approachId] || EXPEDITION_APPROACHES_BY_ID.standard;
}

function expeditionObjective(objectiveId) {
  return EXPEDITION_OBJECTIVES_BY_ID[objectiveId] || EXPEDITION_OBJECTIVES_BY_ID.salvage;
}

function radioInvestigation(investigationId) {
  return RADIO_INVESTIGATIONS_BY_ID[investigationId] || RADIO_INVESTIGATIONS_BY_ID.civic_band;
}

function alignedFaction(state) {
  return null;
}

function factionConsequences(state) {
  return alignedFaction(state)?.consequences || {};
}

function channelAvailable(state, channel) {
  if (!channel || !state.unlockedSections.includes("trader")) {
    return false;
  }
  if (channel.requiresFaction && state.faction.aligned !== channel.requiresFaction) {
    return false;
  }
  return true;
}

export function getAvailableTraderChannels(state) {
  return TRADER_CHANNELS.filter((channel) => channelAvailable(state, channel));
}

export function prepareExpedition(state, zoneId) {
  if (!ZONES_BY_ID[zoneId] || !state.unlockedZones.includes(zoneId)) {
    return false;
  }

  state.expedition.selectedZone = zoneId;
  if (!EXPEDITION_APPROACHES_BY_ID[state.expedition.approach]) {
    state.expedition.approach = "standard";
  }
  if (!EXPEDITION_OBJECTIVES_BY_ID[state.expedition.objective]) {
    state.expedition.objective = "salvage";
  }
  addLog(state, `Route board updated for ${ZONES_BY_ID[zoneId].name}.`, "expedition");
  return true;
}

export function setExpeditionApproach(state, approachId) {
  if (!EXPEDITION_APPROACHES_BY_ID[approachId] || state.expedition.approach === approachId) {
    return false;
  }

  state.expedition.approach = approachId;
  addLog(state, `Expedition approach set: ${EXPEDITION_APPROACHES_BY_ID[approachId].label}.`, "expedition");
  return true;
}

export function setExpeditionObjective(state, objectiveId) {
  if (!EXPEDITION_OBJECTIVES_BY_ID[objectiveId] || state.expedition.objective === objectiveId) {
    return false;
  }

  state.expedition.objective = objectiveId;
  addLog(state, `Expedition objective set: ${EXPEDITION_OBJECTIVES_BY_ID[objectiveId].label}.`, "expedition");
  return true;
}

export function getExpeditionPreview(
  state,
  zoneId = state.expedition.selectedZone,
  approachId = state.expedition.approach,
  objectiveId = state.expedition.objective,
) {
  const zone = ZONES_BY_ID[zoneId];
  const approach = expeditionApproach(approachId);
  const objective = expeditionObjective(objectiveId);
  const derived = getDerivedState(state);
  const faction = factionConsequences(state);

  if (!zone) {
    return null;
  }

  const hours = Math.max(1, zone.hours + approach.hours + objective.hours);
  const encounterChance = clamp(
    zone.encounterChance
      + approach.encounterDelta
      + objective.encounterDelta
      + derived.expeditionEncounterAdjust
      - derived.scoutBonus,
    0.08,
    0.92,
  );
  const lootBonus = derived.expeditionLootBonus + approach.lootBonus + (faction.objectiveBias?.[objective.id] || 0);
  const threat = clamp(0.7 + zone.risk * 0.25 + approach.threat + objective.threat, 0.2, 2.4);
  const noise = approach.noise + zone.risk * 0.12 + objective.noise + (faction.nightNoise || 0) * 0.12;
  const combinedCost = { ...approach.cost };
  Object.entries(objective.cost || {}).forEach(([resourceId, amount]) => {
    combinedCost[resourceId] = (combinedCost[resourceId] || 0) + amount;
  });

  return {
    zone,
    approach,
    objective,
    hours,
    encounterChance,
    lootBonus,
    threat,
    noise,
    cost: combinedCost,
    canLaunch: canAfford(state, combinedCost),
  };
}

function routeEventAvailable(state, event, preview) {
  if (event.approaches && !event.approaches.includes(preview.approach.id)) {
    return false;
  }
  if (event.objectives && !event.objectives.includes(preview.objective.id)) {
    return false;
  }
  if (event.zones && !event.zones.includes(preview.zone.id)) {
    return false;
  }
  if (event.day && state.time.day < event.day) {
    return false;
  }
  if (event.items && !event.items.every((itemId) => hasItem(state, itemId))) {
    return false;
  }
  return true;
}

function pickRouteEvent(state, preview) {
  const candidates = EXPEDITION_ROUTE_EVENTS.filter((event) => routeEventAvailable(state, event, preview));
  if (!candidates.length) {
    return null;
  }

  const totalWeight = candidates.reduce((sum, event) => sum + (event.weight || 1), 0);
  let roll = Math.random() * totalWeight;
  for (const event of candidates) {
    roll -= event.weight || 1;
    if (roll <= 0) {
      return event;
    }
  }
  return candidates[candidates.length - 1];
}

function applyRouteEvent(state, preview) {
  if (!chance(0.72)) {
    state.expedition.lastRouteEvent = null;
    return { preview, event: null };
  }

  const event = pickRouteEvent(state, preview);
  if (!event) {
    state.expedition.lastRouteEvent = null;
    return { preview, event: null };
  }

  const adjusted = {
    ...preview,
    hours: Math.max(1, preview.hours + (event.timeDelta || 0)),
    encounterChance: clamp(preview.encounterChance + (event.encounterDelta || 0), 0.08, 0.96),
    lootBonus: preview.lootBonus + (event.lootBonus || 0),
    threat: clamp(preview.threat + (event.threatDelta || 0), 0.15, 3.2),
    noise: clamp(preview.noise + (event.noiseDelta || 0), 0, 3.4),
    cost: { ...preview.cost },
  };

  if (event.resources) {
    Object.entries(event.resources).forEach(([resourceId, amount]) => addResource(state, resourceId, amount));
  }
  if (event.radioTrace) {
    Object.entries(event.radioTrace).forEach(([traceId, amount]) => {
      state.radio.traces[traceId] = Number(((state.radio.traces[traceId] || 0) + amount).toFixed(2));
      resolveRadioMilestones(state, traceId);
    });
  }
  if (event.condition) {
    state.condition = clamp(state.condition + event.condition, 0, getDerivedState(state).maxCondition);
  }
  if (event.secretProgress) {
    state.story.secretProgress += event.secretProgress;
  }
  if (event.morale) {
    addResource(state, "morale", event.morale);
  }
  if (event.stress) {
    const stressed = applySurvivorStress(state, event.stress, ["scout", "scavenger", "tuner"]);
    if (stressed) {
      addLog(state, `${stressed.name} carries the route strain back into the shelter.`, "crew");
    }
  }

  state.expedition.lastRouteEvent = {
    id: event.id,
    label: event.label,
    text: event.text,
    stamp: getTimeStamp(state),
    zoneId: preview.zone.id,
  };
  addLog(state, event.text, "expedition");
  return { preview: adjusted, event };
}

export function launchPreparedExpedition(state) {
  if (!state.expedition.selectedZone) {
    return false;
  }
  return scavengeZone(state, state.expedition.selectedZone, state.expedition.approach);
}

export function canAfford(state, cost = {}) {
  return Object.entries(cost).every(([resourceId, amount]) => state.resources[resourceId] >= amount);
}

export function hasMaterials(state, materials = {}) {
  return Object.entries(materials).every(([itemId, amount]) => (state.inventory[itemId] || 0) >= amount);
}

function spendResources(state, cost = {}) {
  Object.entries(cost).forEach(([resourceId, amount]) => {
    state.resources[resourceId] = Math.max(0, state.resources[resourceId] - amount);
  });
}

function spendMaterials(state, materials = {}) {
  Object.entries(materials).forEach(([itemId, amount]) => {
    state.inventory[itemId] = Math.max(0, (state.inventory[itemId] || 0) - amount);
    if (state.inventory[itemId] <= 0) {
      delete state.inventory[itemId];
    }
  });
}

function addResource(state, resourceId, amount) {
  if (!RESOURCE_DEFS[resourceId] || !amount) {
    return;
  }

  state.resources[resourceId] = Math.max(0, state.resources[resourceId] + amount);
  if (state.resources[resourceId] > 0) {
    discoverResource(state, resourceId);
  }
}

function grantItem(state, itemId, amount = 1) {
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

function pickWeightedEntry(entries) {
  const totalWeight = entries.reduce((sum, entry) => sum + (entry.weight || 1), 0);
  let roll = Math.random() * totalWeight;
  for (const entry of entries) {
    roll -= entry.weight || 1;
    if (roll <= 0) {
      return entry;
    }
  }
  return entries[entries.length - 1] || null;
}

function createLootBundle() {
  return {
    resources: {},
    items: {},
    finds: [],
  };
}

function addLootFind(bundle, entry, amount) {
  if (!amount) {
    return;
  }

  if (entry.type === "resource") {
    bundle.resources[entry.key] = (bundle.resources[entry.key] || 0) + amount;
    bundle.finds.push({
      rarity: entry.rarity,
      label: RESOURCE_DEFS[entry.key]?.label || entry.key,
      amount,
    });
    return;
  }

  bundle.items[entry.key] = (bundle.items[entry.key] || 0) + amount;
  bundle.finds.push({
    rarity: entry.rarity,
    label: ITEMS[entry.key]?.name || entry.key,
    amount,
  });
}

function addDirectResourceFind(bundle, resourceId, amount) {
  if (!amount) {
    return;
  }

  bundle.resources[resourceId] = (bundle.resources[resourceId] || 0) + amount;
  bundle.finds.push({
    rarity: "lane",
    label: RESOURCE_DEFS[resourceId]?.label || resourceId,
    amount,
  });
}

function applyLootBundle(state, bundle) {
  Object.entries(bundle.resources).forEach(([resourceId, amount]) => addResource(state, resourceId, amount));
  Object.entries(bundle.items).forEach(([itemId, amount]) => grantItem(state, itemId, amount));
}

function rarityRank(rarityId) {
  return Math.max(0, RARITY_ORDER.indexOf(rarityId));
}

function maybeRecordNotableFind(state, source, finds = []) {
  const notable = finds
    .filter((find) => RARITY_ORDER.includes(find.rarity))
    .sort((left, right) => rarityRank(right.rarity) - rarityRank(left.rarity))[0];

  if (!notable || rarityRank(notable.rarity) < rarityRank("epic")) {
    return;
  }

  state.ui.notableFind = {
    sourceId: source.id,
    sourceLabel: source.label,
    label: notable.label,
    amount: notable.amount,
    rarity: notable.rarity,
    stamp: getTimeStamp(state),
  };
  addLog(state, `Notable find: ${(notable.rarity && notable.rarity[0].toUpperCase() + notable.rarity.slice(1)) || "Rare"} ${notable.label}. ${source.label} just paid out hard.`, "notable");
}

function formatLootFinds(finds = []) {
  return finds
    .map((find) => `${find.rarity === "lane" ? "" : `${find.rarity} `}${find.label} +${find.amount}`.trim())
    .join(", ");
}

function lootMatchesSource(entry, sourceId) {
  return !entry.sources || entry.sources.includes(sourceId);
}

function rollLootTable(table, rarity, state, sourceId = null) {
  const entries = table.filter((entry) => (
    entry.rarity === rarity
    && requirementsMet(state, entry.requires)
    && (!sourceId || lootMatchesSource(entry, sourceId))
  ));
  if (!entries.length) {
    return null;
  }
  return pickWeightedEntry(entries);
}

function pickBonusRarity(source, state, derived) {
  const roll = Math.random();
  const bias = source?.rarityBias || {};

  if (state.flags.worldReveal && roll < 0.02 + (bias.mythic || 0) + derived.rareLootBonus * 0.05) {
    return "mythic";
  }
  if (state.story.radioProgress >= 4 && roll < 0.06 + (bias.anomalous || 0) + derived.rareLootBonus * 0.08) {
    return "anomalous";
  }
  if ((state.story.radioProgress >= 2 || state.stats.searches >= 18) && roll < 0.14 + (bias.legendary || 0) + derived.rareLootBonus * 0.12) {
    return "legendary";
  }
  if ((state.stats.searches >= 10 || hasUpgrade(state, "crafting_bench")) && roll < 0.28 + (bias.epic || 0) + derived.rareLootBonus * 0.18) {
    return "epic";
  }
  if (roll < 0.52 + (bias.rare || 0) + derived.rareLootBonus * 0.3) {
    return "rare";
  }
  return "uncommon";
}

function applySourceDirectResources(bundle, source) {
  Object.entries(source.directResources || {}).forEach(([resourceId, range]) => {
    const amount = randInt(range[0], range[1]);
    addDirectResourceFind(bundle, resourceId, amount);
  });
}

function rollSourceRarities(source, state, derived, bundle) {
  (source.guaranteed || []).forEach((rarity) => {
    const entry = rollLootTable(SEARCH_LOOT_TABLE, rarity, state, source.id);
    if (entry) {
      addLootFind(bundle, entry, randInt(entry.amount[0], entry.amount[1]));
    }
  });

  (source.rolls || []).forEach((roll) => {
    if (!requirementsMet(state, roll.requires)) {
      return;
    }

    if (!chance(roll.chance + derived.rareLootBonus * (roll.rareBonus || 0))) {
      return;
    }

    const entry = rollLootTable(SEARCH_LOOT_TABLE, roll.rarity, state, source.id);
    if (entry) {
      addLootFind(bundle, entry, randInt(entry.amount[0], entry.amount[1]));
    }
  });
}

function applyEffectBundle(state, effects = {}) {
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

  if (effects.radioTrace) {
    Object.entries(effects.radioTrace).forEach(([traceId, amount]) => {
      if (state.radio.traces[traceId] === undefined) {
        state.radio.traces[traceId] = 0;
      }
      state.radio.traces[traceId] += amount;
    });
  }
}

function eventAvailable(state, event, pool) {
  if (event.pool !== pool) {
    return false;
  }
  if (event.once && state.seenEvents.includes(event.id)) {
    return false;
  }
  return requirementsMet(state, event.requires);
}

function pickWeightedEvent(state, pool) {
  const candidates = EVENTS.filter((event) => eventAvailable(state, event, pool));
  if (!candidates.length) {
    return null;
  }

  const totalWeight = candidates.reduce((sum, event) => sum + (event.weight || 1), 0);
  let roll = Math.random() * totalWeight;
  for (const event of candidates) {
    roll -= event.weight || 1;
    if (roll <= 0) {
      return event;
    }
  }
  return candidates[candidates.length - 1];
}

function runEvent(state, pool) {
  const event = pickWeightedEvent(state, pool);
  if (!event) {
    return null;
  }

  markEventSeen(state, event.id);
  applyEffectBundle(state, event.effects);
  const category = event.category
    || (pool.startsWith("travel") ? "expedition"
      : pool.startsWith("zone:") ? "expedition"
        : pool === "radio" || pool.startsWith("radio:") ? "radio"
          : pool === "night" ? "night"
            : pool === "food" ? "loot"
              : pool === "search" ? "loot"
                : "general");
  addLog(state, event.text, category);
  return event;
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
  syncSurvivorRoster(state);
  if (state.stats.searches >= 3 && !state.flags.burnUnlocked) {
    state.flags.burnUnlocked = true;
    addLog(state, "Cold makes simple math persuasive. Twelve scrap for warmth suddenly sounds fair.");
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

function markZoneVisited(state, zoneId) {
  if (!state.visitedZones.includes(zoneId)) {
    state.visitedZones.push(zoneId);
    state.stats.zonesVisited = state.visitedZones.length;
  }
}

function zoneRewardMultiplier(baseAmount, bonus) {
  return Math.max(0, Math.round(baseAmount * (1 + bonus)));
}

function objectiveBiasForResource(objective, resourceId) {
  return objective?.resourceBias?.[resourceId] || 0;
}

function generateZoneRewards(zone, derived, lootBonus = 0, objective = EXPEDITION_OBJECTIVES_BY_ID.salvage) {
  const rewards = {
    resources: {},
    grantItems: {},
  };

  Object.entries(zone.loot).forEach(([resourceId, range]) => {
    const amount = randInt(range[0], range[1]);
    rewards.resources[resourceId] = zoneRewardMultiplier(
      amount,
      derived.expeditionLootBonus + lootBonus + objectiveBiasForResource(objective, resourceId),
    );
  });

  if (chance(zone.itemChance + (objective.itemChanceBonus || 0) + derived.scoutBonus * 0.2 + Math.max(0, lootBonus) * 0.16)) {
    const itemId = pickOne(zone.itemPool);
    if (itemId) {
      rewards.grantItems[itemId] = 1;
    }
  }

  if (objective.traceGain) {
    rewards.radioTrace = { ...objective.traceGain };
  }

  return rewards;
}

function applyZoneRewards(state, zoneId, rewards) {
  applyEffectBundle(state, rewards);
  const zone = ZONES_BY_ID[zoneId];
  const gains = Object.entries(rewards.resources)
    .filter(([, amount]) => amount > 0)
    .map(([resourceId, amount]) => `${RESOURCE_DEFS[resourceId].label} +${amount}`);
  const items = Object.keys(rewards.grantItems || {}).map((itemId) => ITEMS[itemId].name);
  const fragments = [];

  if (gains.length) {
    fragments.push(gains.join(", "));
  }
  if (items.length) {
    fragments.push(`found ${items.join(", ")}`);
  }
  if (rewards.radioTrace) {
    fragments.push(`traces ${Object.keys(rewards.radioTrace).join(", ")}`);
  }

  addLog(state, `You return from ${zone.name} with ${fragments.join(" and ")}.`, "expedition");
}

function sourceEncounterProfile(sourceId) {
  switch (sourceId) {
    case "vehicle_shells":
      return { zoneId: "abandoned_gas_station", enemies: ["walker", "stalker"], rewards: { resources: { parts: 1 } } };
    case "dead_pantries":
      return { zoneId: "burned_apartments", enemies: ["walker"], rewards: { resources: { food: 1 } } };
    case "clinic_drawers":
      return { zoneId: "hospital_wing", enemies: ["walker", "screecher"], rewards: { resources: { medicine: 1 } } };
    case "signal_wrecks":
      return { zoneId: "radio_tower_perimeter", enemies: ["stalker", "static_touched"], rewards: { resources: { wire: 1 } } };
    case "sealed_caches":
      return { zoneId: "radio_tower_perimeter", enemies: ["stalker", "relay_brute"], rewards: { resources: { ammo: 1, parts: 1 } } };
    case "rubble":
    default:
      return { zoneId: "ruined_street", enemies: ["walker", "screecher"], rewards: { resources: { wood: 1 } } };
  }
}

function sourceEncounterChance(state, source) {
  const searchPressure = Math.max(0, state.stats.searches - 2) * 0.022;
  const shelterPressure = state.shelter.threat * 0.03 + state.shelter.noise * 0.024;
  const lanePressure = (source.threat || 0.3) * 0.12 + (source.noise || 0.3) * 0.08;

  return clamp(
    0.015 + searchPressure + shelterPressure + lanePressure,
    0.05,
    source.id === "rubble" ? 0.24 : 0.38,
  );
}

function maybeUseFood(state) {
  const derived = getDerivedState(state);
  const upkeep = getShelterUpkeep(state);
  const available = state.resources.food;
  const spent = Math.min(available, upkeep.mealCost);

  if (spent > 0) {
    state.resources.food -= spent;
  }

  if (spent >= upkeep.mealCost) {
    state.condition = clamp(state.condition + 1 + Math.floor(derived.foodSecurity * 0.5), 0, derived.maxCondition);
  } else {
    const shortage = upkeep.mealCost - spent;
    state.condition = clamp(state.condition - Math.max(3, 8 + shortage * 2 - Math.floor(derived.foodSecurity)), 0, derived.maxCondition);
    state.resources.morale = Math.max(0, state.resources.morale - (2 + shortage));
    addLog(state, `The shelter needs ${upkeep.mealCost} food and only finds ${spent}. Hunger turns sharp fast.`, "night");
  }
}

function maybeUseWater(state) {
  const derived = getDerivedState(state);
  const upkeep = getShelterUpkeep(state);
  const available = state.resources.water;
  const spent = Math.min(available, upkeep.waterCost);

  if (spent > 0) {
    state.resources.water -= spent;
  }

  if (spent >= upkeep.waterCost) {
    state.condition = clamp(state.condition, 0, derived.maxCondition);
  } else {
    const shortage = upkeep.waterCost - spent;
    state.condition = clamp(state.condition - Math.max(2, 6 + shortage * 2 - Math.floor(derived.waterSecurity)), 0, derived.maxCondition);
    state.resources.morale = Math.max(0, state.resources.morale - (1 + shortage));
    addLog(state, `The shelter needs ${upkeep.waterCost} drinkable water and comes up short. The room dries out with you in it.`, "night");
  }
}

function maybeUseMaintenance(state) {
  const upkeep = getShelterUpkeep(state);
  if (upkeep.maintenanceWood <= 0 && upkeep.maintenanceParts <= 0) {
    return;
  }

  const spentWood = Math.min(state.resources.wood, upkeep.maintenanceWood);
  const spentParts = Math.min(state.resources.parts, upkeep.maintenanceParts);
  state.resources.wood -= spentWood;
  state.resources.parts -= spentParts;

  if (spentWood >= upkeep.maintenanceWood && spentParts >= upkeep.maintenanceParts) {
    addLog(state, `The shelter burns through ${upkeep.maintenanceWood} wood${upkeep.maintenanceParts ? ` and ${upkeep.maintenanceParts} parts` : ""} to keep the line serviceable.`, "build");
    return;
  }

  const target = pickDamageTarget(state, ["basic_barricade", "watch_post", "repair_rig", "flood_lights", "shelter_core"]);
  addStructureDamage(state, target, 1);
  state.shelter.threat = clamp(state.shelter.threat + 0.35, 0, 12);
  state.shelter.noise = clamp(state.shelter.noise + 0.12, 0, 10);
  addLog(
    state,
    `Maintenance slips. ${damageLabel(target)} takes the strain after the shelter only finds ${spentWood}/${upkeep.maintenanceWood} wood${upkeep.maintenanceParts ? ` and ${spentParts}/${upkeep.maintenanceParts} parts` : ""}.`,
    "build",
  );
}

function runNightPressure(state, derived) {
  const forecast = getNightForecast(state);
  const plan = forecast.plan;
  const systems = forecast.systems;
  const roll = Math.random();
  const siegeRoll = forecast.siegeChance;
  const raidRoll = forecast.raidChance;
  const breachRoll = forecast.breachChance;
  const infectedRoll = forecast.infectedChance;
  let eventType = "quiet";

  if (roll < siegeRoll) {
    eventType = "siege";
  } else if (roll < siegeRoll + breachRoll) {
    eventType = "breach";
  } else if (roll < siegeRoll + breachRoll + raidRoll) {
    eventType = "raiders";
  } else if (roll < siegeRoll + breachRoll + raidRoll + infectedRoll) {
    eventType = "infected";
  }

  const basePressure = Math.max(
    0,
    Math.round(
      forecast.dangerScore
      + randInt(0, 2)
      + Math.max(0, -systems.maintenanceBalance)
      + systems.powerGap * 0.7
      - forecast.adjustedDefense * 0.28,
    ),
  );
  const damagedStructures = [];
  let conditionLoss = 0;
  let moraleDelta = plan.morale;
  let stolen = {};
  const crewHits = [];
  let summary = "The line holds through a mostly quiet night.";

  if (eventType === "quiet") {
    const relief = forecast.dangerScore <= 1.5 ? 1 : 0;
    addResource(state, "morale", Math.max(1, 1 + Math.max(0, plan.morale)));
    if (relief > 0) {
      state.condition = clamp(state.condition + relief, 0, derived.maxCondition);
    }
    summary = "The night stays tense. Nothing gets through, but nobody sleeps well.";
  }

  if (eventType === "infected") {
    conditionLoss = Math.max(3, Math.round(basePressure * 0.95));
    moraleDelta -= 2;
    const target = pickDamageTarget(state, ["basic_barricade", "watch_post"]);
    addStructureDamage(state, target, 2);
    damagedStructures.push(target);
    const stressed = applySurvivorStress(state, 1, ["guard", "scavenger"]);
    if (stressed) {
      crewHits.push(`${stressed.name} is rattled by the wall pressure.`);
    }
    summary = "Infected pressure drags along the walls and finds weak points before dawn.";
  }

  if (eventType === "raiders") {
    conditionLoss = Math.max(4, Math.round(basePressure * 0.9));
    moraleDelta -= 3;
    stolen = {
      scrap: Math.min(state.resources.scrap, randInt(3, 8)),
      parts: Math.min(state.resources.parts, chance(0.65) ? randInt(1, 2) : 0),
      food: Math.min(state.resources.food, chance(0.55) ? randInt(0, 2) : 0),
    };
    Object.entries(stolen).forEach(([resourceId, amount]) => {
      state.resources[resourceId] -= amount;
    });
    const target = pickDamageTarget(state, ["basic_barricade", "radio_rig", "watch_post"]);
    addStructureDamage(state, target, 2);
    damagedStructures.push(target);
    const wounded = applySurvivorWound(state, 1, ["guard", "scavenger"]);
    if (wounded) {
      crewHits.push(`${wounded.name} takes a hit while driving raiders off the line.`);
    }
    addResource(state, "reputation", 1);
    summary = "Raiders probe the perimeter, steal what they can reach, and vanish before first light.";
  }

  if (eventType === "breach") {
    conditionLoss = Math.max(6, Math.round(basePressure * 1.2));
    moraleDelta -= 4;
    const firstTarget = pickDamageTarget(state, ["basic_barricade", "shelter_core"]);
    const secondTarget = pickDamageTarget(state, ["watch_post", "campfire", "radio_rig", "crafting_bench", "shelter_core"]);
    addStructureDamage(state, firstTarget, 2);
    addStructureDamage(state, secondTarget, firstTarget === secondTarget ? 1 : 1);
    damagedStructures.push(firstTarget, secondTarget);
    const wounded = applySurvivorWound(state, 1, ["guard", "medic", "idle"]);
    const stressed = applySurvivorStress(state, 2, ["guard", "idle"]);
    if (wounded) {
      crewHits.push(`${wounded.name} is cut up sealing the breach.`);
    }
    if (stressed) {
      crewHits.push(`${stressed.name} is left shaking after something gets inside the line.`);
    }
    summary = "Something gets into the line. The room survives, but not cleanly.";
  }

  if (eventType === "siege") {
    conditionLoss = Math.max(8, Math.round(basePressure * 1.45));
    moraleDelta -= 5;
    state.night.siegePressure += 1;
    state.night.breachCount += 1;
    stolen = {
      scrap: Math.min(state.resources.scrap, randInt(5, 10)),
      ammo: Math.min(state.resources.ammo, chance(0.6) ? randInt(1, 3) : 0),
      food: Math.min(state.resources.food, chance(0.7) ? randInt(1, 2) : 0),
    };
    Object.entries(stolen).forEach(([resourceId, amount]) => {
      state.resources[resourceId] -= amount;
    });
    ["basic_barricade", "watch_post", "flood_lights", "tripwire_grid", "shelter_core"]
      .forEach((targetId) => {
        if (targetId === "shelter_core" || state.upgrades.includes(targetId)) {
          addStructureDamage(state, targetId, targetId === "shelter_core" ? 1 : 2);
          damagedStructures.push(targetId);
        }
      });
    const wounded = applySurvivorWound(state, 2, ["guard", "medic", "idle"]);
    const stressed = applySurvivorStress(state, 3, ["guard", "scavenger", "idle"]);
    if (wounded) {
      crewHits.push(`${wounded.name} is badly hurt holding the center during the siege.`);
    }
    if (stressed) {
      crewHits.push(`${stressed.name} breaks under the siege noise and needs time to steady.`);
    }
    summary = "The shelter takes a full siege. The line holds because you refuse to let it become a room full of last words.";
  }

  conditionLoss = Math.max(0, conditionLoss - Math.floor(derived.nightMitigation));
  if (systems.maintenanceState === "failing") {
    conditionLoss += 2;
    summary += " The failing base adds its own damage to the night.";
  }
  if (systems.powerState === "dark" && eventType !== "quiet") {
    conditionLoss += 1;
    moraleDelta -= 1;
  }

  if (conditionLoss > 0) {
    state.condition = clamp(state.condition - conditionLoss, 0, derived.maxCondition);
  }
  if (moraleDelta > 0) {
    addResource(state, "morale", moraleDelta);
  } else if (moraleDelta < 0) {
    state.resources.morale = Math.max(0, state.resources.morale + moraleDelta);
  }

  state.shelter.noise = clamp(state.shelter.noise * 0.78, 0, 10);
  state.shelter.threat = clamp(state.shelter.threat + (eventType === "quiet" ? -0.15 : eventType === "siege" ? 1.4 : 0.8), 0, 12);
  state.night.lastReport = {
    stamp: getTimeStamp(state),
    eventType,
    severity: forecast.severity,
    conditionLoss,
    moraleDelta,
    siegePressure: state.night.siegePressure,
    damagedStructures: [...new Set(damagedStructures.filter(Boolean))],
    stolen,
    crewHits,
    summary,
  };

  addLog(state, summary, "night");
  if (state.night.lastReport.damagedStructures.length) {
    addLog(state, `Night damage: ${state.night.lastReport.damagedStructures.map((target) => damageLabel(target)).join(", ")}.`, "night");
  }
  if ((stolen.scrap || 0) + (stolen.parts || 0) + (stolen.food || 0) + (stolen.ammo || 0) > 0) {
    addLog(
      state,
      `Night losses: Scrap ${stolen.scrap || 0}${stolen.parts ? ` / Parts ${stolen.parts}` : ""}${stolen.food ? ` / Food ${stolen.food}` : ""}${stolen.ammo ? ` / Ammo ${stolen.ammo}` : ""}.`,
      "night",
    );
  }
  crewHits.forEach((line) => addLog(state, line, "crew"));
  if (systems.powerState !== "stable") {
    addLog(state, `Power state is ${systems.powerState}. Signal and utility systems are running thinner than the shelter wants.`, "night");
  }

  runEvent(state, "night");
}

export function advanceTime(state, hours) {
  for (let index = 0; index < hours; index += 1) {
    const derived = getDerivedState(state);
    state.time.hour += 1;
    if (state.time.hour >= 24) {
      state.time.hour = 0;
      state.time.day += 1;
    }

    state.shelter.warmth = Math.max(0, state.shelter.warmth - 0.4);
    state.shelter.threat = clamp(state.shelter.threat + 0.34, 0, 12);
    state.shelter.noise = clamp(state.shelter.noise - 0.05, 0, 10);
    state.clocks.hunger += 1;
    state.clocks.thirst += 1;
    state.clocks.maintenance += 1;

    if (state.clocks.hunger >= 6) {
      state.clocks.hunger = 0;
      maybeUseFood(state);
    }

    if (state.clocks.thirst >= 4) {
      state.clocks.thirst = 0;
      maybeUseWater(state);
    }

    if (state.clocks.maintenance >= 8) {
      state.clocks.maintenance = 0;
      maybeUseMaintenance(state);
    }

    if (state.time.hour === 21) {
      runNightPressure(state, derived);
    }

    if (state.time.hour === 6 && state.time.day > 1) {
      state.stats.nightsSurvived += 1;
      state.shelter.threat = clamp(state.shelter.threat - derived.defense * 0.22, 0, 12);
      state.shelter.noise = clamp(state.shelter.noise - 0.6, 0, 10);
      recoverSurvivorsAtDawn(state);
      maybeTriggerCrewConflict(state);
      addLog(state, "A grey dawn leaks over the shelter. You are still here.", "night");
    }
  }
}

export function runScavengeSource(state, sourceId = "rubble") {
  const source = SCAVENGE_SOURCES_BY_ID[sourceId];
  if (!sourceAvailable(state, source)) {
    return false;
  }

  const derived = getDerivedState(state);
  const traitBonuses = survivorTraitBonuses(state);
  advanceTime(state, source.hours || 1);
  state.stats.searches += 1;
  state.stats.scavengeSources[sourceId] = (state.stats.scavengeSources[sourceId] || 0) + 1;
  state.shelter.threat = clamp(state.shelter.threat + (source.threat || 0.35) + 0.16, 0, 12);
  state.shelter.noise = clamp(state.shelter.noise + (source.noise || 0.4) + 0.12 - traitBonuses.scavengeNoiseReduction, 0, 10);

  const scrapMin = Math.max(0, derived.searchScrapMin + (source.scrapMod?.min || 0));
  const scrapMax = Math.max(scrapMin, derived.searchScrapMax + (source.scrapMod?.max || 0));
  const directScrap = Math.max(0, zoneRewardMultiplier(randInt(scrapMin, scrapMax), derived.salvageYieldBonus));
  const lootBundle = createLootBundle();
  addResource(state, "scrap", directScrap);
  applySourceDirectResources(lootBundle, source);
  if (hasItem(state, "salvage_hatchet") && ["rubble", "dead_pantries"].includes(source.id)) {
    addDirectResourceFind(lootBundle, "wood", 1);
  }
  if (hasItem(state, "pry_bar") && ["vehicle_shells", "sealed_caches"].includes(source.id)) {
    addDirectResourceFind(lootBundle, "parts", 1);
  }
  rollSourceRarities(source, state, derived, lootBundle);

  for (let rollIndex = 0; rollIndex < derived.searchBonusRolls; rollIndex += 1) {
    if (!chance(source.bonusChance || 0.6)) {
      continue;
    }
    const bonusRarity = pickBonusRarity(source, state, derived);
    const bonusRoll = rollLootTable(SEARCH_LOOT_TABLE, bonusRarity, state, source.id);
    if (bonusRoll) {
      addLootFind(lootBundle, bonusRoll, randInt(bonusRoll.amount[0], bonusRoll.amount[1]));
    }
  }

  applyLootBundle(state, lootBundle);
  maybeRecordNotableFind(state, source, lootBundle.finds);

  const lootSummary = lootBundle.finds.length
    ? ` ${formatLootFinds(lootBundle.finds)}.`
    : "";
  addLog(state, `You work ${source.logLabel}. scrap +${directScrap}.${lootSummary}`, "loot");
  if (!state.combat && chance(sourceEncounterChance(state, source))) {
    const profile = sourceEncounterProfile(source.id);
    createCombat(state, pickOne(profile.enemies), profile.zoneId, profile.rewards);
  } else if (chance(source.eventChance || 0.42)) {
    runEvent(state, "search");
  }

  evaluateProgression(state);
  return true;
}

export function searchRubble(state) {
  return runScavengeSource(state, "rubble");
}

export function burnForWarmth(state) {
  const derived = getDerivedState(state);
  if (state.resources.scrap < 12) {
    return false;
  }

  state.resources.scrap -= 12;
  state.stats.burnUses += 1;
  state.shelter.warmth = clamp(state.shelter.warmth + 2.6, 0, 10);
  state.shelter.noise = clamp(state.shelter.noise + 0.25, 0, 10);
  state.condition = clamp(state.condition + derived.burnCondition, 0, derived.maxCondition);
  addLog(state, "You feed the fire with old metal and buy yourself another stretch of feeling alive.", "build");
  evaluateProgression(state);
  return true;
}

export function forageFood(state) {
  const derived = getDerivedState(state);
  advanceTime(state, 1);
  state.stats.foodSearches += 1;
  state.shelter.noise = clamp(state.shelter.noise + 0.3, 0, 10);
  state.shelter.threat = clamp(state.shelter.threat + 0.12, 0, 12);
  addResource(state, "food", zoneRewardMultiplier(randInt(1, 2), derived.forageYieldBonus));
  addResource(state, "water", zoneRewardMultiplier(randInt(0, 1), derived.forageYieldBonus));
  if (chance(0.18)) {
    addResource(state, "medicine", 1);
  }
  if (chance(0.12)) {
    addResource(state, "cloth", 1);
  }
  addLog(state, "You search for food instead of useful things. Today, that is the useful thing.", "loot");
  if (chance(0.55)) {
    runEvent(state, "food");
  }
  evaluateProgression(state);
}

export function drinkWater(state) {
  if (state.resources.water < 1) {
    return false;
  }

  state.resources.water -= 1;
  state.clocks.thirst = 0;
  state.condition = clamp(state.condition + 4, 0, getDerivedState(state).maxCondition);
  addLog(state, "You drink slowly and let your hands stop shaking.");
  return true;
}

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

function enemyBehavior(enemyId) {
  return ENEMIES[enemyId]?.behavior || {};
}

function enemyIntent(enemyId, turn = 1) {
  const behavior = enemyBehavior(enemyId);
  if (enemyId === "stalker" && turn === 1) {
    return "ambush";
  }
  if (!behavior.intents?.length) {
    return behavior.defaultIntent || "lunge";
  }
  return behavior.intents[randInt(0, behavior.intents.length - 1)] || behavior.defaultIntent || "lunge";
}

function combatIntentLabel(intent) {
  switch (intent) {
    case "grapple":
      return "grapple";
    case "shriek":
      return "shriek";
    case "rupture":
      return "rupture";
    case "ambush":
      return "ambush";
    case "feint":
      return "feint";
    case "pulse":
      return "static pulse";
    case "crush":
      return "crush";
    case "lunge":
    default:
      return "lunge";
  }
}

function queueNextCombatIntent(state) {
  if (!state.combat) {
    return;
  }
  state.combat.turn += 1;
  state.combat.intent = enemyIntent(state.combat.enemyId, state.combat.turn);
}

function createCombat(state, enemyId, zoneId, rewards, preview = null) {
  state.combat = {
    enemyId,
    zoneId,
    enemyHp: ENEMIES[enemyId].hp,
    rewards,
    objectiveId: preview?.objective?.id || state.expedition.objective || "salvage",
    turn: 1,
    intent: enemyIntent(enemyId, 1),
    brace: 0,
    grappled: false,
  };
  addLog(
    state,
    `${ENEMIES[enemyId].name} closes in near ${ZONES_BY_ID[zoneId].name}. Intent: ${combatIntentLabel(state.combat.intent)}.`,
    "combat",
  );
}

export function scavengeZone(state, zoneId, approachId = state.expedition.approach || "standard") {
  const zone = ZONES_BY_ID[zoneId];
  if (!zone || !state.unlockedZones.includes(zoneId) || state.combat) {
    return false;
  }

  const preview = getExpeditionPreview(state, zoneId, approachId, state.expedition.objective);
  if (!preview || !preview.canLaunch) {
    return false;
  }

  const derived = getDerivedState(state);
  const route = applyRouteEvent(state, preview);
  const adjustedPreview = route.preview;
  spendResources(state, adjustedPreview.cost);
  advanceTime(state, adjustedPreview.hours);
  state.stats.expeditions += 1;
  markZoneVisited(state, zoneId);
  state.shelter.threat = clamp(state.shelter.threat + adjustedPreview.threat, 0, 12);
  state.shelter.noise = clamp(state.shelter.noise + adjustedPreview.noise, 0, 10);
  state.expedition.selectedZone = zoneId;
  state.expedition.approach = adjustedPreview.approach.id;
  state.expedition.objective = adjustedPreview.objective.id;
  addLog(
    state,
    `Route set: ${zone.name} via ${adjustedPreview.approach.label.toLowerCase()} approach on ${adjustedPreview.objective.label.toLowerCase()} objective.`,
    "expedition",
  );
  if (chance(adjustedPreview.approach.travelEventChance)) {
    runEvent(state, `travel:${adjustedPreview.approach.id}`);
  }

  const rewards = generateZoneRewards(zone, derived, adjustedPreview.lootBonus, adjustedPreview.objective);
  const encounterChance = adjustedPreview.encounterChance;
  state.expedition.lastOutcome = {
    zoneId,
    objectiveId: adjustedPreview.objective.id,
    approachId: adjustedPreview.approach.id,
    routeEventId: route.event?.id || null,
    encounterChance: Number(encounterChance.toFixed(2)),
    lootBonus: Number(adjustedPreview.lootBonus.toFixed(2)),
    stamp: getTimeStamp(state),
  };
  if (chance(encounterChance)) {
    createCombat(state, pickOne(zone.enemies), zoneId, rewards, adjustedPreview);
  } else {
    applyZoneRewards(state, zoneId, rewards);
    if (adjustedPreview.objective.id === "signal") {
      resolveRadioMilestones(state, "tower_grid");
      resolveRadioMilestones(state, "anomaly_trace");
    }
    runEvent(state, `zone:${zoneId}`);
  }

  evaluateProgression(state);
  return true;
}

function resolveCombatVictory(state) {
  const enemy = ENEMIES[state.combat.enemyId];
  const zoneId = state.combat.zoneId;
  const behavior = enemyBehavior(enemy.id);
  const derived = getDerivedState(state);
  applyEffectBundle(state, { resources: enemy.reward });
  if (behavior.deathBurst) {
    applyEffectBundle(state, { resources: behavior.deathBurst });
    if (behavior.deathSplash) {
      state.condition = clamp(state.condition - behavior.deathSplash, 0, derived.maxCondition);
      addLog(state, `${enemy.name} ruptures on the way down.`, "combat");
    }
  }
  if (enemy.id === "static_touched") {
    state.radio.traces.anomaly_trace = Number(((state.radio.traces.anomaly_trace || 0) + 0.5).toFixed(2));
  }
  applyZoneRewards(state, zoneId, state.combat.rewards);
  state.stats.combatsWon += 1;
  addLog(state, `${enemy.name} drops hard. The noise it made keeps moving without it.`, "combat");
  if (state.combat.objectiveId === "signal") {
    resolveRadioMilestones(state, "tower_grid");
    resolveRadioMilestones(state, "anomaly_trace");
  }
  runEvent(state, `zone:${zoneId}`);
  state.combat = null;
  evaluateProgression(state);
}

function resolveCombatLoss(state) {
  const lostScrap = Math.min(state.resources.scrap, randInt(4, 10));
  const lostFood = Math.min(state.resources.food, 1);
  state.resources.scrap -= lostScrap;
  state.resources.food -= lostFood;
  state.resources.morale = Math.max(0, state.resources.morale - 2);
  state.condition = 18;
  const wounded = applySurvivorWound(state, 1, ["scout", "guard", "idle"]);
  const stressed = applySurvivorStress(state, 2, ["scout", "guard", "idle"]);
  addLog(state, `You drag yourself home, leaving Scrap ${lostScrap} and Food ${lostFood} behind with the blood.`, "combat");
  if (wounded) {
    addLog(state, `${wounded.name} comes back from the route hurt and slower than before.`, "crew");
  }
  if (stressed) {
    addLog(state, `${stressed.name} cannot stop replaying the route in their head.`, "crew");
  }
  state.combat = null;
}

function combatPlayerDamage(state, derived, enemy) {
  const weapon = ITEMS[state.equipped.weapon];
  let damage = randInt(derived.attack, derived.attack + 3);

  if (state.combat.objectiveId === "sweep") {
    damage += 1;
  }

  if (weapon?.ammoPerAttack) {
    if (state.resources.ammo >= weapon.ammoPerAttack) {
      state.resources.ammo -= weapon.ammoPerAttack;
      damage += 2;
    } else {
      damage = randInt(1, 3);
      addLog(state, `The ${weapon.name} clicks empty. You attack anyway.`, "combat");
    }
  }

  const armor = enemyBehavior(enemy.id).armor || 0;
  return Math.max(1, damage - armor);
}

function resolveEnemyTurn(state, forcedIntent = null) {
  if (!state.combat) {
    return;
  }

  const derived = getDerivedState(state);
  const enemy = ENEMIES[state.combat.enemyId];
  const behavior = enemyBehavior(enemy.id);
  const intent = forcedIntent || state.combat.intent || behavior.defaultIntent || "lunge";
  let incoming = randInt(enemy.attack[0], enemy.attack[1]);
  let summary = `${enemy.name} presses the fight.`;

  switch (intent) {
    case "grapple":
      incoming = Math.max(1, incoming - 1);
      if (chance(behavior.gripChance || 0.25)) {
        state.combat.grappled = true;
        summary = `${enemy.name} hooks onto you and drags the fight close.`;
      } else {
        summary = `${enemy.name} tries to drag you down but misses the hold.`;
      }
      state.shelter.threat = clamp(state.shelter.threat + (behavior.aftermathThreat || 0.18), 0, 12);
      break;
    case "shriek":
      incoming = Math.max(1, incoming - 1);
      state.shelter.threat = clamp(state.shelter.threat + (behavior.shriekThreat || 0.35), 0, 12);
      state.shelter.noise = clamp(state.shelter.noise + (behavior.shriekNoise || 0.4), 0, 10);
      summary = `${enemy.name} shrieks. Everything outside hears it.`;
      break;
    case "rupture":
      incoming += 1;
      summary = `${enemy.name} swells and forces you back through rotten spray.`;
      break;
    case "ambush":
      incoming += randInt(...(behavior.openerBonus || [1, 3]));
      summary = `${enemy.name} comes in from the angle you weren't watching.`;
      break;
    case "feint":
      incoming = Math.max(1, incoming - 2);
      state.combat.grappled = false;
      summary = `${enemy.name} cuts left, tests you, and waits for the wrong move.`;
      break;
    case "pulse":
      state.resources.morale = Math.max(0, state.resources.morale - (behavior.moraleHit || 1));
      state.radio.traces[state.radio.investigation] = Math.max(0, Number(((state.radio.traces[state.radio.investigation] || 0) - (behavior.signalBurn || 0.25)).toFixed(2)));
      summary = `${enemy.name} throws a static pulse through the fight. The receiver in your head hates it.`;
      break;
    case "crush":
      incoming += 2;
      state.shelter.threat = clamp(state.shelter.threat + 0.25, 0, 12);
      summary = `${enemy.name} commits to a brute crush that rattles your whole line.`;
      break;
    case "lunge":
    default:
      summary = `${enemy.name} lunges.`;
      break;
  }

  let reduced = Math.max(1, incoming - Math.floor(derived.defense * 0.75));
  if (state.combat.brace > 0) {
    reduced = Math.max(1, reduced - state.combat.brace);
    state.combat.brace = 0;
  }
  if (state.combat.grappled && intent !== "grapple") {
    reduced += 1;
  }
  reduced = Math.max(0, reduced - Math.floor(derived.nightMitigation * 0.2));
  state.condition = clamp(state.condition - reduced, 0, derived.maxCondition);
  if (reduced >= 4) {
    const wounded = applySurvivorWound(state, 1, ["scout", "guard", "idle"]);
    if (wounded) {
      addLog(state, `${wounded.name} takes a hard knock in the fight.`, "crew");
    }
  } else if (reduced >= 2) {
    const stressed = applySurvivorStress(state, 1, ["scout", "guard", "idle"]);
    if (stressed && chance(0.4)) {
      addLog(state, `${stressed.name} carries the fight back to the shelter in their nerves.`, "crew");
    }
  }
  addLog(state, `${summary} ${reduced > 0 ? `You lose ${reduced} condition.` : "You hold."}`, "combat");

  if (state.condition <= 0) {
    resolveCombatLoss(state);
    return;
  }

  queueNextCombatIntent(state);
}

export function attackCombat(state) {
  if (!state.combat) {
    return false;
  }

  const derived = getDerivedState(state);
  const enemy = ENEMIES[state.combat.enemyId];
  const damage = combatPlayerDamage(state, derived, enemy);

  state.combat.enemyHp = Math.max(0, state.combat.enemyHp - damage);
  if (state.combat.enemyHp <= 0) {
    addLog(state, `You hit ${enemy.name} for ${damage}.`, "combat");
    resolveCombatVictory(state);
    return true;
  }

  addLog(state, `You hit ${enemy.name} for ${damage}. ${enemy.name} lines up ${combatIntentLabel(state.combat.intent)}.`, "combat");
  resolveEnemyTurn(state);
  return true;
}

export function braceCombat(state) {
  if (!state.combat) {
    return false;
  }

  state.combat.brace = 3;
  addLog(state, `You brace for ${combatIntentLabel(state.combat.intent)}.`, "combat");
  resolveEnemyTurn(state);
  return true;
}

export function retreatCombat(state) {
  if (!state.combat) {
    return false;
  }

  const derived = getDerivedState(state);
  const zoneRisk = ZONES_BY_ID[state.combat.zoneId].risk;
  const behavior = enemyBehavior(state.combat.enemyId);
  const escapeChance = clamp(
    0.45
      + derived.scoutBonus
      - zoneRisk * 0.04
      - (behavior.retreatPenalty || 0)
      - (state.combat.grappled ? behavior.gripPenalty || 0.12 : 0),
    0.15,
    0.8,
  );
  if (chance(escapeChance)) {
    addLog(state, `You break line of sight and lose the ${ENEMIES[state.combat.enemyId].name} in the dark.`, "combat");
    if (state.combat.enemyId === "screecher") {
      state.shelter.threat = clamp(state.shelter.threat + 0.35, 0, 12);
      state.shelter.noise = clamp(state.shelter.noise + 0.5, 0, 10);
    }
    state.combat = null;
    return true;
  }

  addLog(state, `You almost get away. ${ENEMIES[state.combat.enemyId].name} punishes the break.`, "combat");
  resolveEnemyTurn(state, state.combat.intent === "feint" ? "ambush" : state.combat.intent);
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
  state.clocks.hunger = 0;
  state.condition = clamp(state.condition + 6, 0, getDerivedState(state).maxCondition);
  addResource(state, "morale", 1);
  addLog(state, "You eat while the shelter creaks around you.", "loot");
  return true;
}

export function patchBarricade(state) {
  if (state.resources.scrap < 6 || state.resources.wood < 2) {
    return false;
  }

  state.resources.scrap -= 6;
  state.resources.wood -= 2;
  state.shelter.threat = clamp(state.shelter.threat - (hasItem(state, "salvage_hatchet") ? 1.9 : 1.5), 0, 12);
  state.shelter.warmth = clamp(state.shelter.warmth + 0.6, 0, 10);
  state.shelter.noise = clamp(state.shelter.noise + 0.18, 0, 10);
  if (hasUpgrade(state, "basic_barricade")) {
    setStructureDamage(state, "basic_barricade", getStructureDamage(state, "basic_barricade") - (hasItem(state, "salvage_hatchet") ? 2 : 1));
  }
  addLog(state, `You patch weak seams with wood, scrap, and stubbornness${hasItem(state, "salvage_hatchet") ? ", using the hatchet to bite the joins clean" : ""}.`, "build");
  return true;
}

export function craftAmmo(state) {
  if (
    !hasUpgrade(state, "ammo_press")
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

export function recruitSurvivor(state) {
  const derived = getDerivedState(state);
  if (state.survivors.total >= derived.survivorCap) {
    return false;
  }
  if (!canAfford(state, { scrap: 22, wood: 1, food: 4, water: 2 })) {
    return false;
  }

  spendResources(state, { scrap: 22, wood: 1, food: 4, water: 2 });
  syncSurvivorRoster(state);
  const index = state.survivors.roster.length;
  const traitId = SURVIVOR_TRAIT_IDS[randInt(0, SURVIVOR_TRAIT_IDS.length - 1)];
  state.survivors.roster.push(normalizeSurvivorRecord({
    id: `survivor-${Date.now()}-${index}`,
    name: survivorName(index + randInt(0, SURVIVOR_NAME_POOL.length - 1)),
    traitId,
    role: "idle",
  }, index));
  syncSurvivorRoster(state);
  addResource(state, "morale", 1);
  const recruit = state.survivors.roster[state.survivors.roster.length - 1];
  addLog(state, `${recruit.name} agrees to stay. Trait: ${SURVIVOR_TRAITS[recruit.traitId].label}.`, "crew");
  return true;
}

export function adjustSurvivorRole(state, roleId, delta) {
  if (!SURVIVOR_ROLES[roleId]) {
    return false;
  }
  syncSurvivorRoster(state);
  if (delta > 0) {
    const survivor = idleSurvivor(state);
    if (!survivor) {
      return false;
    }
    survivor.role = roleId;
  } else {
    const survivor = assignedSurvivor(state, roleId);
    if (!survivor) {
      return false;
    }
    survivor.role = "idle";
  }
  syncSurvivorRoster(state);
  return true;
}

export function getAvailableRadioInvestigations(state) {
  return RADIO_INVESTIGATIONS.filter((investigation) => {
    if (investigation.id === "tower_grid" && !state.unlockedSections.includes("radio")) {
      return false;
    }
    if (investigation.id === "sublevel_echo" && state.story.radioProgress < 1 && !hasItem(state, "relay_key")) {
      return false;
    }
    if (investigation.id === "anomaly_trace" && state.story.radioProgress < 2 && !state.flags.bunkerRouteKnown) {
      return false;
    }
    return true;
  });
}

export function setRadioInvestigation(state, investigationId) {
  if (!RADIO_INVESTIGATIONS_BY_ID[investigationId] || state.radio.investigation === investigationId) {
    return false;
  }

  state.radio.investigation = investigationId;
  addLog(state, `Receiver target set: ${RADIO_INVESTIGATIONS_BY_ID[investigationId].label}.`, "radio");
  return true;
}

function radioMilestoneReady(state, investigationId, milestone) {
  if (state.radio.resolved.includes(milestone.id)) {
    return false;
  }
  if ((state.radio.traces[investigationId] || 0) < milestone.at) {
    return false;
  }
  if (milestone.id === "anomaly_dead_static" && !hasItem(state, "bunker_pass")) {
    return false;
  }
  return true;
}

function resolveRadioMilestones(state, investigationId) {
  const investigation = radioInvestigation(investigationId);
  investigation.milestones.forEach((milestone) => {
    if (!radioMilestoneReady(state, investigationId, milestone)) {
      return;
    }

    state.radio.resolved.push(milestone.id);
    applyEffectBundle(state, milestone.effects);
    addLog(state, milestone.text, "radio");
  });

  if (
    investigationId === "anomaly_trace"
    && (state.radio.traces.anomaly_trace || 0) >= 5
    && hasItem(state, "bunker_pass")
    && !state.flags.worldReveal
  ) {
    state.flags.worldReveal = true;
    state.story.radioProgress += 1;
    state.story.secretProgress += 1;
    addLog(state, "The anomaly trace resolves against bunker records. Dead Static was infrastructure wearing the face of an outbreak.", "radio");
  }
}

export function getRadioBoard(state) {
  return getAvailableRadioInvestigations(state).map((investigation) => {
    const trace = state.radio.traces[investigation.id] || 0;
    const resolved = investigation.milestones.filter((milestone) => state.radio.resolved.includes(milestone.id));
    const next = investigation.milestones.find((milestone) => !state.radio.resolved.includes(milestone.id)) || null;
    return {
      id: investigation.id,
      label: investigation.label,
      short: investigation.short,
      trace,
      resolvedCount: resolved.length,
      totalMilestones: investigation.milestones.length,
      nextAt: next?.at || null,
      nextText: next?.text || "Track exhausted.",
      active: state.radio.investigation === investigation.id,
    };
  });
}

export function scanRadio(state) {
  if (!canAfford(state, { fuel: 1, parts: 1 })) {
    return false;
  }

  const derived = getDerivedState(state);
  const systems = getShelterSystems(state, derived);
  const investigation = radioInvestigation(state.radio.investigation);
  const faction = factionConsequences(state);
  spendResources(state, { fuel: 1, parts: 1 });
  advanceTime(state, 1);
  state.stats.radioScans += 1;
  let traceGain = 1 + derived.signalGain + derived.radioDepth * 0.24 + systems.coverage * 0.06 - systems.powerGap * 0.16;
  if (investigation.id === "anomaly_trace") {
    traceGain += derived.anomalyGain;
    traceGain -= faction.anomalyPenalty || 0;
  }
  if (faction.objectiveBias?.signal && investigation.id === "tower_grid") {
    traceGain += faction.objectiveBias.signal;
  }
  if (systems.maintenanceState === "failing") {
    traceGain -= 0.18;
  }

  state.radio.traces[investigation.id] = Number(((state.radio.traces[investigation.id] || 0) + Math.max(0.5, traceGain)).toFixed(2));
  state.radio.lastSweep = {
    investigationId: investigation.id,
    gain: Number(Math.max(0.5, traceGain).toFixed(2)),
    stamp: getTimeStamp(state),
  };
  addLog(
    state,
    `You work ${investigation.label.toLowerCase()}. ${investigation.traceLabel} +${state.radio.lastSweep.gain}.${systems.powerState !== "stable" ? ` The line is running ${systems.powerState}.` : ""}`,
    "radio",
  );
  runEvent(state, `radio:${investigation.id}`);
  resolveRadioMilestones(state, investigation.id);
  evaluateProgression(state);
  return true;
}

function discountedCost(cost = {}, discount = 0) {
  const adjusted = {};
  Object.entries(cost).forEach(([resourceId, amount]) => {
    adjusted[resourceId] = resourceId === "relics"
      ? amount
      : Math.max(1, Math.round(amount * (1 - discount)));
  });
  return adjusted;
}

function offerAvailable(state, offer, channelId) {
  if (offer.cost.relics && state.story.radioProgress < 2) {
    return false;
  }
  if (offer.id === "rifle_cache" && !state.unlockedSections.includes("trader")) {
    return false;
  }
  if (channelId && offer.channels && !offer.channels.includes(channelId)) {
    return false;
  }
  return true;
}

export function requestTraderChannel(state, channelId = state.trader.channel || "open_market") {
  const channel = TRADER_CHANNELS_BY_ID[channelId];
  if (!channelAvailable(state, channel)) {
    return false;
  }

  state.trader.channel = channelId;
  state.trader.offers = TRADER_OFFERS
    .filter((offer) => offerAvailable(state, offer, channelId))
    .map((offer) => offer.id);
  state.trader.lastContact = {
    channelId,
    stamp: getTimeStamp(state),
  };
  state.stats.traderRefreshes += 1;
  addLog(state, `${channel.name} answers. Prices arrive clean and personal.`, "trade");
  return true;
}

export function refreshTraderOffers(state) {
  return requestTraderChannel(state, state.trader.channel || "open_market");
}

export function getTraderOfferCost(state, offer) {
  return discountedCost(offer.cost, getDerivedState(state).traderDiscount);
}

export function buyTraderOffer(state, offerId) {
  const offer = TRADER_OFFERS.find((candidate) => candidate.id === offerId);
  const adjustedCost = discountedCost(offer?.cost || {}, getDerivedState(state).traderDiscount);
  if (!offer || !state.trader.offers.includes(offerId) || !canAfford(state, adjustedCost)) {
    return false;
  }

  spendResources(state, adjustedCost);
  applyEffectBundle(state, offer.reward);
  Object.keys(offer.reward.radioTrace || {}).forEach((traceId) => resolveRadioMilestones(state, traceId));
  state.trader.offers = state.trader.offers.filter((id) => id !== offerId);
  addLog(state, `Trade made: ${offer.name}.`, "trade");
  evaluateProgression(state);
  return true;
}

export function chooseFaction(state, factionId) {
  if (state.faction.aligned || !FACTIONS_BY_ID[factionId]) {
    return false;
  }

  state.faction.aligned = factionId;
  addResource(state, "reputation", 4);
  addLog(state, `You align with ${FACTIONS_BY_ID[factionId].name}. The city starts answering differently.`, "radio");
  const channelId = FACTIONS_BY_ID[factionId]?.consequences?.tradeChannel;
  if (channelId) {
    requestTraderChannel(state, channelId);
  }
  return true;
}

export function processRealtimeTick(state, seconds = 1) {
  const derived = getDerivedState(state);
  let changed = false;

  RESOURCE_ORDER.forEach((resourceId) => {
    const rate = derived.passive[resourceId];
    if (rate <= 0) {
      return;
    }
    state.buffers.resources[resourceId] += rate * seconds;
    const whole = Math.floor(state.buffers.resources[resourceId]);
    if (whole > 0) {
      state.buffers.resources[resourceId] -= whole;
      addResource(state, resourceId, whole);
      changed = true;
    }
  });

  if (derived.conditionRegen > 0 && state.condition < derived.maxCondition) {
    state.buffers.condition += derived.conditionRegen * seconds;
    const whole = Math.floor(state.buffers.condition);
    if (whole > 0) {
      state.buffers.condition -= whole;
      state.condition = clamp(state.condition + whole, 0, derived.maxCondition);
      changed = true;
    }
  }

  if (changed) {
    evaluateProgression(state);
  }

  return changed;
}

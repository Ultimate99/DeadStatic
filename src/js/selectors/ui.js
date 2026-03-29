import { ITEMS, RARITY_DEFS, RARITY_ORDER } from "../data.js";
import { FACTIONS, SEARCH_LOOT_TABLE, UPGRADES_BY_ID } from "../content.js";
import {
  canAfford,
  getExpeditionPreview,
  getNightForecast,
  getVisibleUpgrades,
  hasItem,
  hasMaterials,
} from "../engine.js";
import { countLogCategories } from "./log.js";
import { listRequirementGaps, stateMeetsRequirements } from "./requirements.js";

export const TAB_DEFS = [
  { id: "overview", label: "Overview", hint: "control", icon: "overview", count: (state) => state.stats.searches || null },
  { id: "craft", label: "Craft", hint: "build queue", icon: "craft", unlock: "upgrades", count: (state) => getVisibleUpgrades(state).filter((upgrade) => !state.upgrades.includes(upgrade.id)).length || null },
  { id: "inventory", label: "Inventory", hint: "gear hold", icon: "inventory", unlock: "inventory" },
  { id: "shelter", label: "Shelter", hint: "survival", icon: "shelter", unlock: "shelter" },
  { id: "shelter_map", label: "Shelter Map", hint: "compound", icon: "shelter_map", unlock: "shelter" },
  { id: "map", label: "Map", hint: "routes", icon: "map", unlock: "map", count: (state) => state.unlockedZones.length || null },
  { id: "survivors", label: "Crew", hint: "assignments", icon: "crew", unlock: "survivors", count: (state) => state.survivors.total || null },
  { id: "radio", label: "Radio", hint: "signals", icon: "radio", unlock: "radio", count: (state) => state.story.radioProgress || null },
  { id: "trade", label: "Trade", hint: "market", icon: "trade", unlock: "trader", count: (state) => state.trader.offers.length || null },
  { id: "factions", label: "Factions", hint: "alignment", icon: "factions", unlock: "factions" },
  { id: "leaderboard", label: "Leaderboard", hint: "hosted", icon: "leaderboard" },
  { id: "log", label: "Log", hint: "history", icon: "log" },
];

export const DEFAULT_LOG_CATEGORIES = ["loot", "build", "night", "expedition", "radio", "combat", "trade", "notable"];

function contentAvailable(state, requirements = {}) {
  return stateMeetsRequirements(state, requirements, hasItem);
}

function lootMatchesSource(entry, sourceId) {
  return !sourceId || !entry.sources || entry.sources.includes(sourceId);
}

export function getSourceVisibleEntries(state, sourceId = null) {
  return SEARCH_LOOT_TABLE.filter((entry) => lootMatchesSource(entry, sourceId) && contentAvailable(state, entry.requires));
}

export function getSourceRarityCeiling(state, sourceId) {
  const visibleRarity = [...RARITY_ORDER]
    .reverse()
    .find((rarityId) => getSourceVisibleEntries(state, sourceId).some((entry) => entry.rarity === rarityId)) || "common";

  return {
    id: visibleRarity,
    label: RARITY_DEFS[visibleRarity]?.label || visibleRarity,
  };
}

export function getSourceUnlockDescription(state, source) {
  return listRequirementGaps(state, source.requires, {
    hasItem,
    labelForUpgrade: (upgradeId) => UPGRADES_BY_ID[upgradeId]?.name || upgradeId,
    labelForItem: (itemId) => ITEMS[itemId]?.name || itemId,
  }).join(" / ") || "ready";
}

export function getVisibleTabs(state) {
  return TAB_DEFS.filter((tab) => !tab.unlock || state.unlockedSections.includes(tab.unlock));
}

export function getSubtitle(state) {
  if (state.flags.worldReveal) {
    return "The outbreak had a transmission layer. You are standing inside its residue.";
  }
  if (state.unlockedSections.includes("factions")) {
    return "Everyone left alive wants the signal for a different kind of future.";
  }
  if (state.unlockedSections.includes("radio")) {
    return "The static stops sounding random once it realizes you are listening.";
  }
  if (state.unlockedSections.includes("map")) {
    return "The shelter holds. The city starts offering routes and prices.";
  }
  if (state.unlockedSections.includes("upgrades")) {
    return "Rubble stops being debris the second you learn how to sort it.";
  }
  return "The streets went quiet. The wires did not.";
}

export function getSummaryPills(state, derived) {
  const pills = [
    { label: "Warmth", value: state.shelter.warmth.toFixed(1), icon: "warmth" },
    { label: "Threat", value: state.shelter.threat.toFixed(1), icon: "threat" },
    { label: "Noise", value: state.shelter.noise.toFixed(1), icon: "noise" },
  ];

  if (state.discoveredResources.includes("food")) {
    pills.push({ label: "Hunger", value: `${state.clocks.hunger}/6h`, icon: "food" });
  }
  if (state.discoveredResources.includes("water")) {
    pills.push({ label: "Thirst", value: `${state.clocks.thirst}/4h`, icon: "water" });
  }
  if (state.unlockedSections.includes("survivors")) {
    pills.push({ label: "Crew", value: `${state.survivors.total}/${derived.survivorCap}`, icon: "crew" });
  }
  if (state.unlockedSections.includes("radio")) {
    pills.push({ label: "Signal", value: `${state.story.radioProgress}`, icon: "radio" });
  }

  return pills;
}

function readyUpgradeCandidate(state, upgrades) {
  return upgrades.find((upgrade) => canAfford(state, upgrade.cost) && hasMaterials(state, upgrade.materials)) || null;
}

export function getCurrentDirective(state, availableUpgrades) {
  const readyUpgrade = readyUpgradeCandidate(state, availableUpgrades);

  if (state.combat) {
    return {
      title: "Combat contact",
      detail: "Clear the contact first.",
    };
  }
  if (!state.flags.burnUnlocked) {
    return {
      title: "Stabilize the room",
      detail: `${Math.max(0, 3 - state.stats.searches)} more searches unlock warmth.`,
    };
  }
  if (readyUpgrade) {
    return {
      title: `Build ${readyUpgrade.name}`,
      detail: "A funded build is waiting.",
    };
  }
  if (state.expedition.selectedZone) {
    const preview = getExpeditionPreview(state, state.expedition.selectedZone, state.expedition.approach);
    if (preview) {
      return {
        title: `Launch ${preview.zone.name}`,
        detail: `${preview.approach.label} / ${preview.hours}h / ${Math.round(preview.encounterChance * 100)}% contact.`,
      };
    }
  }
  if (state.unlockedSections.includes("radio") && state.resources.fuel > 0 && state.resources.parts > 0) {
    return {
      title: "Sweep the band",
      detail: "Fuel and parts are ready.",
    };
  }
  if (state.unlockedSections.includes("map") && !state.expedition.selectedZone) {
    return {
      title: "Prepare a route",
      detail: "Stage the next zone.",
    };
  }

  return {
    title: "Push the scavenging lanes",
    detail: "Keep the salvage loop moving.",
  };
}

export function getCommandDeskModel(state, derived, availableSources, availableUpgrades) {
  const forecast = getNightForecast(state);
  const readyUpgrade = readyUpgradeCandidate(state, availableUpgrades);
  const preview = state.expedition.selectedZone
    ? getExpeditionPreview(state, state.expedition.selectedZone, state.expedition.approach)
    : null;

  return {
    forecast,
    preview,
    readyUpgrade,
    directive: getCurrentDirective(state, availableUpgrades),
    routeTitle: preview ? preview.zone.name : "No route staged",
    routeDetail: preview
      ? `${preview.approach.label} / ${preview.hours}h / ${Math.round(preview.encounterChance * 100)}% encounter`
      : state.unlockedSections.includes("map")
        ? "Pick a zone in Map and stage an approach before launch."
        : "Routes surface later. Keep leaning on the city.",
    signalTitle: state.unlockedSections.includes("radio") ? `Signal ${state.story.radioProgress}` : "Receiver dark",
    growthStats: [
      { label: "Lanes", value: availableSources.length },
      { label: "Builds", value: availableUpgrades.length },
      { label: "Crew", value: `${state.survivors.total}/${derived.survivorCap}` },
      { label: "Morale", value: state.resources.morale },
    ],
  };
}

export function getCrewPressureBands(state) {
  return [
    { label: "Scavengers", value: state.survivors.assigned.scavenger, note: "slow salvage income" },
    { label: "Guards", value: state.survivors.assigned.guard, note: "night defense" },
    { label: "Medics", value: state.survivors.assigned.medic, note: "condition mitigation" },
    { label: "Scouts", value: state.survivors.assigned.scout, note: "route yield and escape" },
    { label: "Tuners", value: state.survivors.assigned.tuner, note: "radio depth and pathing" },
  ];
}

export function getFactionStatus(state) {
  const aligned = FACTIONS.find((faction) => faction.id === state.faction.aligned) || null;
  return {
    aligned,
    bonuses: aligned ? aligned.bonuses : ["independent", "all offers open"],
    description: aligned ? aligned.description : "You are still independent. Every side is watching.",
  };
}

export function getLogPulseEntries(logEntries) {
  return countLogCategories(logEntries, DEFAULT_LOG_CATEGORIES);
}

export function getSignalBandCount(state) {
  return Math.max(1, Math.min(6, state.story.radioProgress + (state.flags.worldReveal ? 2 : 1)));
}

export function getAnomalyTraceModel(state) {
  return {
    heat: Math.min(6, Math.max(1, state.story.radioProgress + Math.floor(state.story.secretProgress / 2) + (state.flags.worldReveal ? 1 : 0))),
    fragments: [
      "carrier echo / tower should be dead",
      "civil band bleed / impossible handoff",
      state.flags.bunkerRouteKnown ? "sub-level route / bunker latch humming" : "sub-level route / not yet fixed",
      state.flags.worldReveal ? "dead static / engineered residue confirmed" : "dead static / origin still hidden",
    ],
  };
}

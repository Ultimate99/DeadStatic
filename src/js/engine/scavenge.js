import { SCAVENGE_SOURCES_BY_ID, SEARCH_LOOT_TABLE } from "../content/index.js";
import { runEvent } from "./event-runner.js";
import {
  addLog,
  addResource,
  evaluateProgression,
  getDerivedState,
  requirementsMet,
} from "./shared.js";
import {
  addLootFind,
  applyLootBundle,
  applySourceDirectResources,
  createLootBundle,
  formatLootFinds,
  maybeRecordNotableFind,
  pickBonusRarity,
  rollLootTable,
  rollSourceRarities,
} from "./loot.js";
import { advanceTime } from "./time.js";
import { chance, clamp, randInt } from "./utils.js";

function sourceAvailable(state, source) {
  return Boolean(source && requirementsMet(state, source.requires));
}

export function runScavengeSource(state, sourceId = "rubble") {
  const source = SCAVENGE_SOURCES_BY_ID[sourceId];
  if (!sourceAvailable(state, source)) {
    return false;
  }

  const derived = getDerivedState(state);
  advanceTime(state, source.hours || 1);
  state.stats.searches += 1;
  state.stats.scavengeSources[sourceId] = (state.stats.scavengeSources[sourceId] || 0) + 1;
  state.shelter.threat = clamp(state.shelter.threat + (source.threat || 0.35), 0, 12);
  state.shelter.noise = clamp(state.shelter.noise + (source.noise || 0.4), 0, 10);

  const scrapMin = Math.max(0, derived.searchScrapMin + (source.scrapMod?.min || 0));
  const scrapMax = Math.max(scrapMin, derived.searchScrapMax + (source.scrapMod?.max || 0));
  const directScrap = randInt(scrapMin, scrapMax);
  const lootBundle = createLootBundle();
  addResource(state, "scrap", directScrap);
  applySourceDirectResources(lootBundle, source);
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
  if (chance(source.eventChance || 0.42)) {
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
  if (state.resources.scrap < 10) {
    return false;
  }

  state.resources.scrap -= 10;
  state.stats.burnUses += 1;
  state.shelter.warmth = clamp(state.shelter.warmth + 3, 0, 10);
  state.shelter.noise = clamp(state.shelter.noise + 0.2, 0, 10);
  state.condition = clamp(state.condition + derived.burnCondition, 0, derived.maxCondition);
  addLog(state, "You feed the fire with old metal and buy yourself another stretch of feeling alive.", "build");
  evaluateProgression(state);
  return true;
}

export function forageFood(state) {
  advanceTime(state, 1);
  state.stats.foodSearches += 1;
  state.shelter.noise = clamp(state.shelter.noise + 0.24, 0, 10);
  addResource(state, "food", randInt(1, 3));
  addResource(state, "water", randInt(0, 2));
  if (chance(0.25)) {
    addResource(state, "medicine", 1);
  }
  if (chance(0.18)) {
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
  state.condition = clamp(state.condition + 5, 0, getDerivedState(state).maxCondition);
  addLog(state, "You drink slowly and let your hands stop shaking.");
  return true;
}

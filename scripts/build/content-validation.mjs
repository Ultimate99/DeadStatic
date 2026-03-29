import { ITEMS, RARITY_ORDER, RESOURCE_DEFS, SURVIVOR_ROLES } from "../../src/js/data/index.js";
import {
  ENEMIES,
  EXPEDITION_APPROACHES,
  FACTIONS,
  SCAVENGE_SOURCES,
  SEARCH_LOOT_TABLE,
  TRADER_OFFERS,
  UPGRADES,
  ZONES,
} from "../../src/js/content/index.js";
import { EVENTS } from "../../src/js/events/index.js";

const KNOWN_UNLOCK_SECTIONS = new Set(["upgrades", "inventory", "shelter", "map", "survivors", "radio", "trader", "factions"]);
const KNOWN_EVENT_POOLS = new Set(["search", "food", "night", "radio"]);
const RESOURCE_IDS = new Set(Object.keys(RESOURCE_DEFS));
const ITEM_IDS = new Set(Object.keys(ITEMS));
const UPGRADE_IDS = new Set(UPGRADES.map((upgrade) => upgrade.id));
const ZONE_IDS = new Set(ZONES.map((zone) => zone.id));
const ENEMY_IDS = new Set(Object.keys(ENEMIES));
const FACTION_IDS = new Set(FACTIONS.map((faction) => faction.id));
const SOURCE_IDS = new Set(SCAVENGE_SOURCES.map((source) => source.id));
const APPROACH_IDS = new Set(EXPEDITION_APPROACHES.map((approach) => approach.id));
const SURVIVOR_ROLE_IDS = new Set(Object.keys(SURVIVOR_ROLES));

function pushInvalidRefs(errors, values, validSet, context, noun) {
  (values || []).forEach((value) => {
    if (!validSet.has(value)) {
      errors.push(`${context}: unknown ${noun} '${value}'`);
    }
  });
}

function validateResourceBag(errors, bag, context) {
  Object.keys(bag || {}).forEach((resourceId) => {
    if (!RESOURCE_IDS.has(resourceId)) {
      errors.push(`${context}: unknown resource '${resourceId}'`);
    }
  });
}

function validateItemBag(errors, bag, context) {
  Object.keys(bag || {}).forEach((itemId) => {
    if (!ITEM_IDS.has(itemId)) {
      errors.push(`${context}: unknown item '${itemId}'`);
    }
  });
}

function validateEffects(errors, effects = {}, context) {
  validateResourceBag(errors, effects.resources, `${context}.resources`);
  validateItemBag(errors, effects.grantItems, `${context}.grantItems`);
  validateResourceBag(errors, effects.passive, `${context}.passive`);
  pushInvalidRefs(errors, effects.discoverResources, RESOURCE_IDS, `${context}.discoverResources`, "resource");
  pushInvalidRefs(errors, effects.unlockSections, KNOWN_UNLOCK_SECTIONS, `${context}.unlockSections`, "section");
  pushInvalidRefs(errors, effects.unlockZones, ZONE_IDS, `${context}.unlockZones`, "zone");
}

function validateRequirements(errors, requirements = {}, context) {
  pushInvalidRefs(errors, requirements.upgrades, UPGRADE_IDS, `${context}.upgrades`, "upgrade");
  pushInvalidRefs(errors, requirements.items, ITEM_IDS, `${context}.items`, "item");
}

function validateAmountRange(errors, amount, context) {
  if (!Array.isArray(amount) || amount.length !== 2 || amount.some((value) => typeof value !== "number")) {
    errors.push(`${context}: invalid amount range`);
  }
}

function collectDuplicateIds(rows, label, getId = (row) => row.id) {
  const seen = new Set();
  const duplicates = [];
  rows.forEach((row) => {
    const id = getId(row);
    if (seen.has(id)) {
      duplicates.push(`${label}: duplicate id '${id}'`);
      return;
    }
    seen.add(id);
  });
  return duplicates;
}

function validateUpgrades(errors) {
  UPGRADES.forEach((upgrade) => {
    validateResourceBag(errors, upgrade.cost, `upgrade:${upgrade.id}.cost`);
    validateItemBag(errors, upgrade.materials, `upgrade:${upgrade.id}.materials`);
    validateRequirements(errors, upgrade.requires, `upgrade:${upgrade.id}.requires`);
    validateEffects(errors, upgrade.effects, `upgrade:${upgrade.id}.effects`);
  });
}

function validateEnemies(errors) {
  Object.values(ENEMIES).forEach((enemy) => {
    validateResourceBag(errors, enemy.reward, `enemy:${enemy.id}.reward`);
  });
}

function validateZones(errors) {
  ZONES.forEach((zone) => {
    pushInvalidRefs(errors, zone.enemies, ENEMY_IDS, `zone:${zone.id}.enemies`, "enemy");
    pushInvalidRefs(errors, zone.itemPool, ITEM_IDS, `zone:${zone.id}.itemPool`, "item");
    validateResourceBag(errors, zone.loot, `zone:${zone.id}.loot`);
  });
}

function validateFactions(errors) {
  FACTIONS.forEach((faction) => {
    if (!FACTION_IDS.has(faction.id)) {
      errors.push(`faction:${faction.id}: missing faction id`);
    }
    validateEffects(errors, faction.effects, `faction:${faction.id}.effects`);
  });
}

function validateTrader(errors) {
  TRADER_OFFERS.forEach((offer) => {
    validateResourceBag(errors, offer.cost, `trade:${offer.id}.cost`);
    validateEffects(errors, offer.reward, `trade:${offer.id}.reward`);
  });
}

function validateScavengeSources(errors) {
  SCAVENGE_SOURCES.forEach((source) => {
    validateResourceBag(errors, source.directResources, `source:${source.id}.directResources`);
    validateRequirements(errors, source.requires, `source:${source.id}.requires`);
    pushInvalidRefs(errors, source.guaranteed, new Set(RARITY_ORDER), `source:${source.id}.guaranteed`, "rarity");
    (source.rolls || []).forEach((roll, index) => {
      pushInvalidRefs(errors, [roll.rarity], new Set(RARITY_ORDER), `source:${source.id}.rolls[${index}]`, "rarity");
      validateRequirements(errors, roll.requires, `source:${source.id}.rolls[${index}].requires`);
    });
  });
}

function validateApproaches(errors) {
  EXPEDITION_APPROACHES.forEach((approach) => {
    validateResourceBag(errors, approach.cost, `approach:${approach.id}.cost`);
  });
}

function validateLoot(errors) {
  SEARCH_LOOT_TABLE.forEach((entry) => {
    pushInvalidRefs(errors, [entry.rarity], new Set(RARITY_ORDER), `loot:${entry.id}`, "rarity");
    if (entry.type === "resource") {
      validateResourceBag(errors, { [entry.key]: 1 }, `loot:${entry.id}.key`);
    } else if (entry.type === "item") {
      validateItemBag(errors, { [entry.key]: 1 }, `loot:${entry.id}.key`);
    } else {
      errors.push(`loot:${entry.id}: invalid type '${entry.type}'`);
    }
    validateAmountRange(errors, entry.amount, `loot:${entry.id}.amount`);
    validateRequirements(errors, entry.requires, `loot:${entry.id}.requires`);
    pushInvalidRefs(errors, entry.sources, SOURCE_IDS, `loot:${entry.id}.sources`, "source");
  });
}

function validateEvents(errors) {
  EVENTS.forEach((event) => {
    if (event.pool.startsWith("travel:")) {
      pushInvalidRefs(errors, [event.pool.slice("travel:".length)], APPROACH_IDS, `event:${event.id}.pool`, "approach");
    } else if (event.pool.startsWith("zone:")) {
      pushInvalidRefs(errors, [event.pool.slice("zone:".length)], ZONE_IDS, `event:${event.id}.pool`, "zone");
    } else if (!KNOWN_EVENT_POOLS.has(event.pool)) {
      errors.push(`event:${event.id}: unknown pool '${event.pool}'`);
    }

    validateRequirements(errors, event.requires, `event:${event.id}.requires`);
    validateEffects(errors, event.effects, `event:${event.id}.effects`);
  });
}

function validateItems(errors) {
  Object.values(ITEMS).forEach((item) => {
    validateResourceBag(errors, item.resources, `item:${item.id}.resources`);
  });
}

export function collectContentValidationErrors() {
  const errors = [
    ...collectDuplicateIds(UPGRADES, "upgrades"),
    ...collectDuplicateIds(ZONES, "zones"),
    ...collectDuplicateIds(FACTIONS, "factions"),
    ...collectDuplicateIds(TRADER_OFFERS, "trader_offers"),
    ...collectDuplicateIds(SCAVENGE_SOURCES, "scavenge_sources"),
    ...collectDuplicateIds(EXPEDITION_APPROACHES, "expedition_approaches"),
    ...collectDuplicateIds(SEARCH_LOOT_TABLE, "search_loot_table"),
    ...collectDuplicateIds(EVENTS, "events"),
  ];

  validateItems(errors);
  validateUpgrades(errors);
  validateEnemies(errors);
  validateZones(errors);
  validateFactions(errors);
  validateTrader(errors);
  validateScavengeSources(errors);
  validateApproaches(errors);
  validateLoot(errors);
  validateEvents(errors);

  return errors;
}

export function validateContentGraph() {
  const errors = collectContentValidationErrors();
  if (errors.length) {
    const error = new Error(`Content validation failed with ${errors.length} issue(s).`);
    error.validationErrors = errors;
    throw error;
  }

  return {
    upgrades: UPGRADES.length,
    items: ITEM_IDS.size,
    zones: ZONES.length,
    enemies: ENEMY_IDS.size,
    factions: FACTIONS.length,
    events: EVENTS.length,
  };
}

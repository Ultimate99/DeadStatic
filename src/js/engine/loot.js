import { ITEMS, RARITY_ORDER, RESOURCE_DEFS } from "../data.js";
import { SEARCH_LOOT_TABLE, ZONES_BY_ID } from "../content/index.js";
import { addLog, addResource, applyEffectBundle, getTimeStamp, grantItem, hasUpgrade, requirementsMet } from "./shared.js";
import { chance, pickOne, randInt } from "./utils.js";

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

export function createLootBundle() {
  return {
    resources: {},
    items: {},
    finds: [],
  };
}

export function addLootFind(bundle, entry, amount) {
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

export function applyLootBundle(state, bundle) {
  Object.entries(bundle.resources).forEach(([resourceId, amount]) => addResource(state, resourceId, amount));
  Object.entries(bundle.items).forEach(([itemId, amount]) => grantItem(state, itemId, amount));
}

function rarityRank(rarityId) {
  return Math.max(0, RARITY_ORDER.indexOf(rarityId));
}

export function maybeRecordNotableFind(state, source, finds = []) {
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

export function formatLootFinds(finds = []) {
  return finds
    .map((find) => `${find.rarity === "lane" ? "" : `${find.rarity} `}${find.label} +${find.amount}`.trim())
    .join(", ");
}

function lootMatchesSource(entry, sourceId) {
  return !entry.sources || entry.sources.includes(sourceId);
}

export function rollLootTable(table, rarity, state, sourceId = null) {
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

export function pickBonusRarity(source, state, derived) {
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

export function applySourceDirectResources(bundle, source) {
  Object.entries(source.directResources || {}).forEach(([resourceId, range]) => {
    const amount = randInt(range[0], range[1]);
    addDirectResourceFind(bundle, resourceId, amount);
  });
}

export function rollSourceRarities(source, state, derived, bundle) {
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

function zoneRewardMultiplier(baseAmount, bonus) {
  return Math.max(0, Math.round(baseAmount * (1 + bonus)));
}

export function generateZoneRewards(zone, derived, lootBonus = 0) {
  const rewards = {
    resources: {},
    grantItems: {},
  };

  Object.entries(zone.loot).forEach(([resourceId, range]) => {
    const amount = randInt(range[0], range[1]);
    rewards.resources[resourceId] = zoneRewardMultiplier(amount, derived.expeditionLootBonus + lootBonus);
  });

  if (chance(zone.itemChance + derived.scoutBonus * 0.2 + Math.max(0, lootBonus) * 0.16)) {
    const itemId = pickOne(zone.itemPool);
    if (itemId) {
      rewards.grantItems[itemId] = 1;
    }
  }

  return rewards;
}

export function applyZoneRewards(state, zoneId, rewards) {
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

  addLog(state, `You return from ${zone.name} with ${fragments.join(" and ")}.`, "expedition");
}

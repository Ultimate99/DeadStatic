import { EXPEDITION_APPROACHES_BY_ID, ZONES_BY_ID } from "../content/index.js";
import { runEvent } from "./event-runner.js";
import { generateZoneRewards, applyZoneRewards } from "./loot.js";
import { advanceTime } from "./time.js";
import { startCombat } from "./combat.js";
import { addLog, canAfford, evaluateProgression, getDerivedState, markZoneVisited, spendResources } from "./shared.js";
import { chance, clamp, pickOne } from "./utils.js";

function expeditionApproach(approachId) {
  return EXPEDITION_APPROACHES_BY_ID[approachId] || EXPEDITION_APPROACHES_BY_ID.standard;
}

export function prepareExpedition(state, zoneId) {
  if (!ZONES_BY_ID[zoneId] || !state.unlockedZones.includes(zoneId)) {
    return false;
  }

  state.expedition.selectedZone = zoneId;
  if (!EXPEDITION_APPROACHES_BY_ID[state.expedition.approach]) {
    state.expedition.approach = "standard";
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

export function getExpeditionPreview(state, zoneId = state.expedition.selectedZone, approachId = state.expedition.approach) {
  const zone = ZONES_BY_ID[zoneId];
  const approach = expeditionApproach(approachId);
  const derived = getDerivedState(state);

  if (!zone) {
    return null;
  }

  const hours = Math.max(1, zone.hours + approach.hours);
  const encounterChance = clamp(zone.encounterChance + approach.encounterDelta - derived.scoutBonus, 0.08, 0.92);
  const lootBonus = derived.expeditionLootBonus + approach.lootBonus;
  const threat = clamp(0.7 + zone.risk * 0.25 + approach.threat, 0.2, 2.4);
  const noise = approach.noise + zone.risk * 0.12;

  return {
    zone,
    approach,
    hours,
    encounterChance,
    lootBonus,
    threat,
    noise,
    cost: approach.cost,
    canLaunch: canAfford(state, approach.cost),
  };
}

export function launchPreparedExpedition(state) {
  if (!state.expedition.selectedZone) {
    return false;
  }
  return scavengeZone(state, state.expedition.selectedZone, state.expedition.approach);
}

export function scavengeZone(state, zoneId, approachId = state.expedition.approach || "standard") {
  const zone = ZONES_BY_ID[zoneId];
  if (!zone || !state.unlockedZones.includes(zoneId) || state.combat) {
    return false;
  }

  const preview = getExpeditionPreview(state, zoneId, approachId);
  if (!preview || !preview.canLaunch) {
    return false;
  }

  const derived = getDerivedState(state);
  spendResources(state, preview.cost);
  advanceTime(state, preview.hours);
  state.stats.expeditions += 1;
  markZoneVisited(state, zoneId);
  state.shelter.threat = clamp(state.shelter.threat + preview.threat, 0, 12);
  state.shelter.noise = clamp(state.shelter.noise + preview.noise, 0, 10);
  state.expedition.selectedZone = zoneId;
  state.expedition.approach = preview.approach.id;
  addLog(state, `Route set: ${zone.name} via ${preview.approach.label.toLowerCase()} approach.`, "expedition");
  if (chance(preview.approach.travelEventChance)) {
    runEvent(state, `travel:${preview.approach.id}`);
  }

  const rewards = generateZoneRewards(zone, derived, preview.lootBonus);
  if (chance(preview.encounterChance)) {
    startCombat(state, pickOne(zone.enemies), zoneId, rewards);
  } else {
    applyZoneRewards(state, zoneId, rewards);
    runEvent(state, `zone:${zoneId}`);
  }

  evaluateProgression(state);
  return true;
}

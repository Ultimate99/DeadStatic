import { addLog, addResource, getDerivedState, getTimeStamp, hasUpgrade } from "./shared.js";
import { addStructureDamage, damageLabel, pickDamageTarget } from "./structures.js";
import { runEvent } from "./event-runner.js";
import { chance, clamp, randInt } from "./utils.js";

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

function nightPlan(state) {
  return NIGHT_PLANS[state.night.plan] || NIGHT_PLANS.hold_fast;
}

function guardStrength(state) {
  return state.survivors.assigned.guard + (hasUpgrade(state, "watch_post") ? 1 : 0);
}

export function getNightForecast(state) {
  const derived = getDerivedState(state);
  const plan = nightPlan(state);
  const adjustedDefense = Math.max(0, derived.defense + plan.defense);
  const adjustedNoise = clamp(state.shelter.noise + plan.noise, 0, 10);
  const guardBonus = guardStrength(state) * 0.45;
  const signalBonus = state.survivors.assigned.tuner * 0.08;
  const dangerScore = clamp(
    state.shelter.threat * 1.32
      + adjustedNoise * 1.16
      + Math.max(0, state.time.day - 1) * 0.28
      - adjustedDefense * 0.92
      - state.shelter.warmth * 0.36
      - guardBonus
      - signalBonus,
    0,
    14,
  );

  const infectedChance = clamp(0.12 + state.shelter.threat * 0.07 + adjustedNoise * 0.045 - adjustedDefense * 0.02, 0.06, 0.82);
  const raidChance = clamp((state.time.day >= 4 ? 0.08 : 0.02) + adjustedNoise * 0.05 + state.resources.reputation * 0.008 + plan.raidBias - adjustedDefense * 0.014, 0.03, 0.62);
  const breachChance = clamp(0.06 + Math.max(0, dangerScore - 2) * 0.05 + plan.breachBias - adjustedDefense * 0.018, 0.02, 0.58);
  const quietChance = clamp(1 - (infectedChance * 0.46 + raidChance * 0.36 + breachChance * 0.34), 0.08, 0.7);
  const hoursUntilNight = state.time.hour < 21 ? 21 - state.time.hour : 24 - state.time.hour + 21;

  let severity = "Quiet";
  if (dangerScore >= 3) {
    severity = "Tense";
  }
  if (dangerScore >= 5.5) {
    severity = "Rough";
  }
  if (dangerScore >= 8) {
    severity = "Critical";
  }

  return {
    plan,
    adjustedDefense,
    adjustedNoise,
    dangerScore,
    infectedChance,
    raidChance,
    breachChance,
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

export function maybeUseFood(state) {
  if (state.resources.food > 0) {
    state.resources.food -= 1;
    state.condition = clamp(state.condition + 2, 0, getDerivedState(state).maxCondition);
  } else {
    state.condition = clamp(state.condition - 6, 0, getDerivedState(state).maxCondition);
    state.resources.morale = Math.max(0, state.resources.morale - 1);
    addLog(state, "Hunger turns sharp. The room feels smaller.");
  }
}

export function maybeUseWater(state) {
  if (state.resources.water > 0) {
    state.resources.water -= 1;
    state.condition = clamp(state.condition + 1, 0, getDerivedState(state).maxCondition);
  } else {
    state.condition = clamp(state.condition - 4, 0, getDerivedState(state).maxCondition);
    state.resources.morale = Math.max(0, state.resources.morale - 1);
    addLog(state, "Your mouth dries to paper. The static sounds closer.");
  }
}

export function runNightPressure(state, derived) {
  const forecast = getNightForecast(state);
  const plan = forecast.plan;
  const roll = Math.random();
  const raidRoll = forecast.raidChance;
  const breachRoll = forecast.breachChance;
  const infectedRoll = forecast.infectedChance;
  let eventType = "quiet";

  if (roll < breachRoll) {
    eventType = "breach";
  } else if (roll < breachRoll + raidRoll) {
    eventType = "raiders";
  } else if (roll < breachRoll + raidRoll + infectedRoll) {
    eventType = "infected";
  }

  const basePressure = Math.max(0, Math.round(forecast.dangerScore + randInt(0, 2) - forecast.adjustedDefense * 0.28));
  const damagedStructures = [];
  let conditionLoss = 0;
  let moraleDelta = plan.morale;
  let stolen = {};
  let summary = "The line holds through a mostly quiet night.";

  if (eventType === "quiet") {
    const relief = Math.max(1, Math.round((forecast.adjustedDefense + state.shelter.warmth) / 6));
    addResource(state, "morale", 1 + Math.max(0, plan.morale));
    state.condition = clamp(state.condition + relief, 0, derived.maxCondition);
    summary = "The night stays tense but uneventful. The shelter keeps its shape.";
  }

  if (eventType === "infected") {
    conditionLoss = Math.max(2, Math.round(basePressure * 0.8));
    moraleDelta -= 1;
    const target = pickDamageTarget(state, ["basic_barricade", "watch_post"]);
    addStructureDamage(state, target, 1);
    damagedStructures.push(target);
    summary = "Infected pressure drags along the walls and finds weak points before dawn.";
  }

  if (eventType === "raiders") {
    conditionLoss = Math.max(3, Math.round(basePressure * 0.7));
    moraleDelta -= 2;
    stolen = {
      scrap: Math.min(state.resources.scrap, randInt(2, 6)),
      parts: Math.min(state.resources.parts, chance(0.5) ? 1 : 0),
    };
    Object.entries(stolen).forEach(([resourceId, amount]) => {
      state.resources[resourceId] -= amount;
    });
    const target = pickDamageTarget(state, ["basic_barricade", "radio_rig", "watch_post"]);
    addStructureDamage(state, target, 1);
    damagedStructures.push(target);
    addResource(state, "reputation", 1);
    summary = "Raiders probe the perimeter, steal what they can reach, and vanish before first light.";
  }

  if (eventType === "breach") {
    conditionLoss = Math.max(5, Math.round(basePressure * 1.05));
    moraleDelta -= 3;
    const firstTarget = pickDamageTarget(state, ["basic_barricade", "shelter_core"]);
    const secondTarget = pickDamageTarget(state, ["watch_post", "campfire", "radio_rig", "crafting_bench", "shelter_core"]);
    addStructureDamage(state, firstTarget, 1);
    addStructureDamage(state, secondTarget, 1);
    damagedStructures.push(firstTarget, secondTarget);
    summary = "Something gets into the line. The room survives, but not cleanly.";
  }

  if (conditionLoss > 0) {
    state.condition = clamp(state.condition - conditionLoss, 0, derived.maxCondition);
  }
  if (moraleDelta > 0) {
    addResource(state, "morale", moraleDelta);
  } else if (moraleDelta < 0) {
    state.resources.morale = Math.max(0, state.resources.morale + moraleDelta);
  }

  state.shelter.noise = clamp(state.shelter.noise * 0.62, 0, 10);
  state.shelter.threat = clamp(state.shelter.threat + (eventType === "quiet" ? -0.3 : 0.45), 0, 12);
  state.night.lastReport = {
    stamp: getTimeStamp(state),
    eventType,
    severity: forecast.severity,
    conditionLoss,
    moraleDelta,
    damagedStructures: [...new Set(damagedStructures.filter(Boolean))],
    stolen,
    summary,
  };

  addLog(state, summary, "night");
  if (state.night.lastReport.damagedStructures.length) {
    addLog(state, `Night damage: ${state.night.lastReport.damagedStructures.map((target) => damageLabel(target)).join(", ")}.`, "night");
  }
  if ((stolen.scrap || 0) + (stolen.parts || 0) > 0) {
    addLog(state, `Raid losses: Scrap ${stolen.scrap || 0}${stolen.parts ? ` / Parts ${stolen.parts}` : ""}.`, "night");
  }

  runEvent(state, "night");
}

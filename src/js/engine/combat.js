import { ENEMIES, ZONES_BY_ID } from "../content/index.js";
import { ITEMS } from "../data.js";
import { runEvent } from "./event-runner.js";
import { applyZoneRewards } from "./loot.js";
import { addLog, applyEffectBundle, evaluateProgression, getDerivedState } from "./shared.js";
import { clamp, randInt } from "./utils.js";

export function startCombat(state, enemyId, zoneId, rewards) {
  state.combat = {
    enemyId,
    zoneId,
    enemyHp: ENEMIES[enemyId].hp,
    rewards,
  };
  addLog(state, `${ENEMIES[enemyId].name} closes in near ${ZONES_BY_ID[zoneId].name}.`, "combat");
}

function resolveCombatVictory(state) {
  const enemy = ENEMIES[state.combat.enemyId];
  const zoneId = state.combat.zoneId;
  applyEffectBundle(state, { resources: enemy.reward });
  applyZoneRewards(state, zoneId, state.combat.rewards);
  state.stats.combatsWon += 1;
  addLog(state, `${enemy.name} drops hard. The noise it made keeps moving without it.`, "combat");
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
  addLog(state, `You drag yourself home, leaving Scrap ${lostScrap} and Food ${lostFood} behind with the blood.`, "combat");
  state.combat = null;
}

export function attackCombat(state) {
  if (!state.combat) {
    return false;
  }

  const derived = getDerivedState(state);
  const enemy = ENEMIES[state.combat.enemyId];
  const weapon = ITEMS[state.equipped.weapon];
  let damage = randInt(derived.attack, derived.attack + 3);

  if (weapon?.ammoPerAttack) {
    if (state.resources.ammo >= weapon.ammoPerAttack) {
      state.resources.ammo -= weapon.ammoPerAttack;
      damage += 2;
    } else {
      damage = randInt(1, 3);
      addLog(state, `The ${weapon.name} clicks empty. You attack anyway.`, "combat");
    }
  }

  state.combat.enemyHp = Math.max(0, state.combat.enemyHp - damage);
  if (state.combat.enemyHp <= 0) {
    addLog(state, `You hit ${enemy.name} for ${damage}.`, "combat");
    resolveCombatVictory(state);
    return true;
  }

  const incoming = randInt(enemy.attack[0], enemy.attack[1]);
  const reduced = Math.max(1, incoming - Math.floor(derived.defense * 0.75));
  state.condition = clamp(state.condition - reduced, 0, derived.maxCondition);
  addLog(state, `You hit ${enemy.name} for ${damage}. It answers with ${reduced}.`, "combat");
  if (state.condition <= 0) {
    resolveCombatLoss(state);
  }
  return true;
}

export function retreatCombat(state) {
  if (!state.combat) {
    return false;
  }

  const derived = getDerivedState(state);
  const zoneRisk = ZONES_BY_ID[state.combat.zoneId].risk;
  const escapeChance = clamp(0.45 + derived.scoutBonus - zoneRisk * 0.04, 0.2, 0.8);
  if (Math.random() < escapeChance) {
    addLog(state, `You break line of sight and lose the ${ENEMIES[state.combat.enemyId].name} in the dark.`, "combat");
    state.combat = null;
    return true;
  }

  const enemy = ENEMIES[state.combat.enemyId];
  const strike = Math.max(1, randInt(enemy.attack[0], enemy.attack[1]) - Math.floor(derived.defense * 0.5));
  state.condition = clamp(state.condition - strike, 0, derived.maxCondition);
  addLog(state, `You almost get away. The ${enemy.name} leaves ${strike} condition behind.`, "combat");
  if (state.condition <= 0) {
    resolveCombatLoss(state);
  }
  return true;
}

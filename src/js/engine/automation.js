import { RESOURCE_ORDER } from "../data.js";
import { refreshTraderOffers } from "./market.js";
import { addResource, evaluateProgression, getDerivedState } from "./shared.js";

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
      state.condition = Math.min(derived.maxCondition, state.condition + whole);
      changed = true;
    }
  }

  if (!state.trader.offers.length && state.unlockedSections.includes("trader") && state.stats.traderRefreshes === 0) {
    refreshTraderOffers(state);
    changed = true;
  }

  if (changed) {
    evaluateProgression(state);
  }

  return changed;
}

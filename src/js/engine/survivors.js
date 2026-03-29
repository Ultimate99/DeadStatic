import { SURVIVOR_ROLES } from "../data.js";
import { addLog, addResource, canAfford, getDerivedState, spendResources } from "./shared.js";

export function recruitSurvivor(state) {
  const derived = getDerivedState(state);
  if (state.survivors.total >= derived.survivorCap) {
    return false;
  }
  if (!canAfford(state, { scrap: 18, food: 3 })) {
    return false;
  }

  spendResources(state, { scrap: 18, food: 3 });
  state.survivors.total += 1;
  state.survivors.idle += 1;
  addResource(state, "morale", 1);
  addLog(state, "A tired stranger agrees to stay for food, a dry corner, and a locked door.", "crew");
  return true;
}

export function adjustSurvivorRole(state, roleId, delta) {
  if (!SURVIVOR_ROLES[roleId]) {
    return false;
  }
  if (delta > 0) {
    if (state.survivors.idle < 1) {
      return false;
    }
    state.survivors.idle -= 1;
    state.survivors.assigned[roleId] += 1;
  } else {
    if (state.survivors.assigned[roleId] < 1) {
      return false;
    }
    state.survivors.assigned[roleId] -= 1;
    state.survivors.idle += 1;
  }
  return true;
}

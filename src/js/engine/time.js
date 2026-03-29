import { addLog, getDerivedState } from "./shared.js";
import { maybeUseFood, maybeUseWater, runNightPressure } from "./night.js";
import { clamp } from "./utils.js";

export function advanceTime(state, hours) {
  for (let index = 0; index < hours; index += 1) {
    const derived = getDerivedState(state);
    state.time.hour += 1;
    if (state.time.hour >= 24) {
      state.time.hour = 0;
      state.time.day += 1;
    }

    state.shelter.warmth = Math.max(0, state.shelter.warmth - 0.35);
    state.shelter.threat = clamp(state.shelter.threat + 0.28, 0, 12);
    state.shelter.noise = clamp(state.shelter.noise - 0.08, 0, 10);
    state.clocks.hunger += 1;
    state.clocks.thirst += 1;

    if (state.clocks.hunger >= 6) {
      state.clocks.hunger = 0;
      maybeUseFood(state);
    }

    if (state.clocks.thirst >= 4) {
      state.clocks.thirst = 0;
      maybeUseWater(state);
    }

    if (state.time.hour === 21) {
      runNightPressure(state, derived);
    }

    if (state.time.hour === 6 && state.time.day > 1) {
      state.stats.nightsSurvived += 1;
      state.shelter.threat = clamp(state.shelter.threat - derived.defense * 0.4, 0, 12);
      state.shelter.noise = clamp(state.shelter.noise - 1.1, 0, 10);
      addLog(state, "A grey dawn leaks over the shelter. You are still here.", "night");
    }
  }
}

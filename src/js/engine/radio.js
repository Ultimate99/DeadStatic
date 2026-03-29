import { runEvent } from "./event-runner.js";
import { advanceTime } from "./time.js";
import { addLog, canAfford, evaluateProgression, spendResources } from "./shared.js";

export function scanRadio(state) {
  if (!canAfford(state, { fuel: 1, parts: 1 })) {
    return false;
  }

  spendResources(state, { fuel: 1, parts: 1 });
  advanceTime(state, 1);
  state.stats.radioScans += 1;
  addLog(state, "You sweep the band and wait for the static to decide what mood it is in.", "radio");
  runEvent(state, "radio");
  evaluateProgression(state);
  return true;
}

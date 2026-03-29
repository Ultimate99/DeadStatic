import { SAVE_KEY } from "../data.js";
import { createInitialState } from "./schema.js";
import { migrateState } from "./migrations.js";

export function loadState() {
  try {
    const serialized = window.localStorage.getItem(SAVE_KEY);
    if (!serialized) {
      return createInitialState();
    }

    return migrateState(JSON.parse(serialized));
  } catch (_error) {
    return createInitialState();
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (_error) {
    // Allow play to continue even when the browser blocks local storage for local files.
  }
}

export function clearSave() {
  try {
    window.localStorage.removeItem(SAVE_KEY);
  } catch (_error) {
    // Ignore storage failures so reset can still rebuild in-memory state.
  }
}

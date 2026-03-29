import { evaluateProgression, processRealtimeTick } from "./engine.js";
import { createActionDispatcher } from "./app/action-registry.js";
import { renderGame } from "./render.js";
import { initLeaderboard, refreshLeaderboard } from "./services/leaderboard.js";
import { importSaveFromFile } from "./services/save-transfer.js";
import { clearSave, createInitialState, loadState, saveState } from "./state.js";

let state = loadState();
evaluateProgression(state);

const saveStatus = document.getElementById("autosave-status");
const saveImportInput = document.getElementById("save-import-input");

function setSaveStatus(text) {
  saveStatus.textContent = text;
}

function rerender() {
  renderGame(state);
}

function persist(label) {
  saveState(state);
  setSaveStatus(label);
}

async function applyImportedState(nextState, label) {
  evaluateProgression(nextState);
  state = nextState;
  persist(label);
  rerender();
}

const handleAction = createActionDispatcher({
  getState: () => state,
  setState: (nextState) => {
    state = nextState;
  },
  saveState,
  clearSave,
  createInitialState,
  evaluateProgression,
  persist,
  rerender,
  setSaveStatus,
});

initLeaderboard({
  onChange: rerender,
});

document.body.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  handleAction(button.dataset.action, button);
});

saveImportInput?.addEventListener("change", async () => {
  const file = saveImportInput.files?.[0];
  if (!file) {
    return;
  }

  try {
    const nextState = await importSaveFromFile(file);
    await applyImportedState(nextState, "imported save");
  } catch (error) {
    setSaveStatus(error.message || "import failed");
    if (typeof window.alert === "function") {
      window.alert(error.message || "Could not import save.");
    }
  } finally {
    saveImportInput.value = "";
  }
});

rerender();
setSaveStatus("autosave armed");

window.setInterval(() => {
  if (processRealtimeTick(state, 1)) {
    rerender();
  }
}, 1000);

window.setInterval(() => {
  persist("autosaved");
}, 15000);

window.setInterval(() => {
  refreshLeaderboard({ silent: true });
}, 60000);

import { evaluateProgression, processRealtimeTick } from "./engine.js";
import { createActionDispatcher } from "./app/action-registry.js";
import { renderGame } from "./render.js";
import { initLeaderboard, refreshLeaderboard } from "./services/leaderboard.js";
import { clearSave, createInitialState, loadState, saveState } from "./state.js";

let state = loadState();
evaluateProgression(state);

const saveStatus = document.getElementById("autosave-status");

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

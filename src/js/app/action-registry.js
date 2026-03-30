import {
  adjustSurvivorRole,
  attackCombat,
  burnForWarmth,
  buyTraderOffer,
  chooseFaction,
  craftAmmo,
  drinkWater,
  eatRation,
  equipItem,
  forageFood,
  launchPreparedExpedition,
  patchBarricade,
  prepareExpedition,
  refreshTraderOffers,
  repairStructure,
  recruitSurvivor,
  retreatCombat,
  runScavengeSource,
  scanRadio,
  scavengeZone,
  searchRubble,
  startWorkJob,
  setExpeditionApproach,
  setNightPlan,
  useBestMedicalItem,
  useItem,
} from "../engine.js";
import {
  promptForCallsign,
  refreshLeaderboard,
  submitLeaderboardScore,
} from "../services/leaderboard.js";
import {
  copySaveCode,
  downloadSaveFile,
  importSaveFromCode,
} from "../services/save-transfer.js";

function actionResult(changed = false, options = {}) {
  return {
    changed,
    stop: false,
    ...options,
  };
}

export function createActionDispatcher({
  getState,
  setState,
  saveState,
  clearSave,
  createInitialState,
  evaluateProgression,
  persist,
  rerender,
  setSaveStatus,
}) {
  const handlers = {
    "search-rubble": ({ state }) => actionResult(searchRubble(state)),
    "search-source": ({ state, button }) => actionResult(runScavengeSource(state, button.dataset.source)),
    "burn-warmth": ({ state }) => actionResult(burnForWarmth(state)),
    "forage-food": ({ state }) => {
      forageFood(state);
      return actionResult(true);
    },
    "start-work-job": ({ state, button }) => actionResult(startWorkJob(state, button.dataset.upgrade)),
    "buy-upgrade": ({ state, button }) => actionResult(startWorkJob(state, button.dataset.upgrade)),
    "inspect-structure": ({ state, button }) => {
      if (state.ui.inspectedStructure === button.dataset.structure) {
        return actionResult(false);
      }
      state.ui.inspectedStructure = button.dataset.structure;
      return actionResult(true);
    },
    "repair-structure": ({ state, button }) => actionResult(repairStructure(state, button.dataset.structure)),
    "set-night-plan": ({ state, button }) => actionResult(setNightPlan(state, button.dataset.plan)),
    "equip-item": ({ state, button }) => actionResult(equipItem(state, button.dataset.item)),
    "use-item": ({ state, button }) => actionResult(useItem(state, button.dataset.item)),
    "eat-ration": ({ state }) => actionResult(eatRation(state)),
    "patch-barricade": ({ state }) => actionResult(patchBarricade(state)),
    "craft-ammo": ({ state }) => actionResult(craftAmmo(state)),
    "drink-water": ({ state }) => actionResult(drinkWater(state)),
    recruit: ({ state }) => actionResult(recruitSurvivor(state)),
    "adjust-role": ({ state, button }) => actionResult(adjustSurvivorRole(state, button.dataset.role, Number(button.dataset.delta))),
    "prepare-zone": ({ state, button }) => actionResult(prepareExpedition(state, button.dataset.zone)),
    "set-approach": ({ state, button }) => actionResult(setExpeditionApproach(state, button.dataset.approach)),
    "launch-prepared": ({ state }) => actionResult(launchPreparedExpedition(state)),
    "scavenge-zone": ({ state, button }) => actionResult(scavengeZone(state, button.dataset.zone)),
    "scan-radio": ({ state }) => actionResult(scanRadio(state)),
    "refresh-trader": ({ state }) => actionResult(refreshTraderOffers(state)),
    "buy-offer": ({ state, button }) => actionResult(buyTraderOffer(state, button.dataset.offer)),
    "choose-faction": ({ state, button }) => actionResult(chooseFaction(state, button.dataset.faction)),
    "set-callsign": () => {
      promptForCallsign();
      return actionResult(false, { stop: true });
    },
    "refresh-leaderboard": () => {
      refreshLeaderboard();
      return actionResult(false, { stop: true });
    },
    "submit-leaderboard": ({ state }) => {
      submitLeaderboardScore(state);
      return actionResult(false, { stop: true });
    },
    "download-save-file": ({ state }) => {
      downloadSaveFile(state);
      setSaveStatus("save file downloaded");
      return actionResult(false, { stop: true });
    },
    "copy-save-code": ({ state }) => {
      copySaveCode(state)
        .then(() => setSaveStatus("save code copied"))
        .catch(() => setSaveStatus("could not copy save code"));
      return actionResult(false, { stop: true });
    },
    "trigger-save-import": () => {
      document.getElementById("save-import-input")?.click();
      return actionResult(false, { stop: true });
    },
    "import-save-code": ({ state }) => {
      const raw = typeof window.prompt === "function"
        ? window.prompt("Paste a Dead Static save code or raw JSON save.")
        : "";
      if (!raw) {
        return actionResult(false, { stop: true });
      }

      try {
        const nextState = importSaveFromCode(raw);
        evaluateProgression(nextState);
        setState(nextState);
        persist("save imported");
        rerender();
      } catch (error) {
        setSaveStatus(error.message || "import failed");
        if (typeof window.alert === "function") {
          window.alert(error.message || "Could not import save.");
        }
      }
      return actionResult(false, { stop: true });
    },
    "combat-attack": ({ state }) => actionResult(attackCombat(state)),
    "combat-heal": ({ state }) => actionResult(useBestMedicalItem(state)),
    "combat-retreat": ({ state }) => actionResult(retreatCombat(state)),
    "set-tab": ({ state, button }) => {
      if (state.ui.activeTab !== button.dataset.tab) {
        state.ui.activeTab = button.dataset.tab;
        saveState(state);
        setSaveStatus("view saved");
        rerender();
      }
      return actionResult(false, { stop: true });
    },
    "save-game": () => {
      persist("saved to local storage");
      rerender();
      return actionResult(false, { stop: true });
    },
    "reset-game": () => {
      if (window.confirm("Reset Dead Static and erase the current local save?")) {
        clearSave();
        const nextState = createInitialState();
        evaluateProgression(nextState);
        setState(nextState);
        persist("save wiped");
        rerender();
      }
      return actionResult(false, { stop: true });
    },
  };

  return function dispatchAction(action, button) {
    const handler = handlers[action];
    if (!handler) {
      return false;
    }

    const result = handler({
      state: getState(),
      button,
    });

    if (result.changed) {
      persist(result.label || "autosaved");
      rerender();
    }

    return true;
  };
}

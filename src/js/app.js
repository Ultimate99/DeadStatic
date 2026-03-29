import {
  adjustSurvivorRole,
  attackCombat,
  braceCombat,
  burnForWarmth,
  buyTraderOffer,
  buyUpgrade,
  chooseFaction,
  craftAmmo,
  drinkWater,
  eatRation,
  equipItem,
  evaluateProgression,
  forageFood,
  launchPreparedExpedition,
  patchBarricade,
  processRealtimeTick,
  prepareExpedition,
  repairStructure,
  recruitSurvivor,
  requestTraderChannel,
  retreatCombat,
  runScavengeSource,
  scanRadio,
  scavengeZone,
  searchRubble,
  setExpeditionApproach,
  setExpeditionObjective,
  setNightPlan,
  setRadioInvestigation,
  useBestMedicalItem,
  useItem,
} from "./engine.js";
import { renderGame } from "./render.js";
import { clearSave, createInitialState, loadState, saveState } from "./state.js";

let state = loadState();
evaluateProgression(state);

const saveStatus = document.getElementById("autosave-status");

function isMobileViewport() {
  return typeof window !== "undefined" && Number(window.innerWidth || 0) <= 720;
}

function normalizeMobileTabTarget(tabId) {
  if (!isMobileViewport()) {
    return { tabId, shelterMode: null };
  }

  if (tabId === "shelter_map") {
    return { tabId: "shelter", shelterMode: "map" };
  }

  if (tabId === "shelter") {
    return { tabId: "shelter", shelterMode: "ops" };
  }

  return { tabId, shelterMode: null };
}

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

function handleAction(action, button) {
  let changed = false;

  switch (action) {
    case "search-rubble":
      searchRubble(state);
      changed = true;
      break;
    case "search-source":
      changed = runScavengeSource(state, button.dataset.source);
      break;
    case "burn-warmth":
      changed = burnForWarmth(state);
      break;
    case "forage-food":
      forageFood(state);
      changed = true;
      break;
    case "buy-upgrade":
      changed = buyUpgrade(state, button.dataset.upgrade);
      break;
    case "inspect-structure":
      if (state.ui.inspectedStructure !== button.dataset.structure) {
        state.ui.inspectedStructure = button.dataset.structure;
        changed = true;
      }
      if (isMobileViewport()) {
        state.ui.mobileInspectorStructure = button.dataset.structure;
        state.ui.mobileShelterMode = "map";
        changed = true;
      }
      break;
    case "repair-structure":
      changed = repairStructure(state, button.dataset.structure);
      break;
    case "set-night-plan":
      changed = setNightPlan(state, button.dataset.plan);
      break;
    case "equip-item":
      changed = equipItem(state, button.dataset.item);
      break;
    case "use-item":
      changed = useItem(state, button.dataset.item);
      break;
    case "eat-ration":
      changed = eatRation(state);
      break;
    case "patch-barricade":
      changed = patchBarricade(state);
      break;
    case "craft-ammo":
      changed = craftAmmo(state);
      break;
    case "drink-water":
      changed = drinkWater(state);
      break;
    case "recruit":
      changed = recruitSurvivor(state);
      break;
    case "adjust-role":
      changed = adjustSurvivorRole(state, button.dataset.role, Number(button.dataset.delta));
      break;
    case "prepare-zone":
      changed = prepareExpedition(state, button.dataset.zone);
      break;
    case "set-approach":
      changed = setExpeditionApproach(state, button.dataset.approach);
      break;
    case "set-objective":
      changed = setExpeditionObjective(state, button.dataset.objective);
      break;
    case "launch-prepared":
      changed = launchPreparedExpedition(state);
      break;
    case "scavenge-zone":
      changed = scavengeZone(state, button.dataset.zone);
      break;
    case "scan-radio":
      changed = scanRadio(state);
      break;
    case "set-radio-investigation":
      changed = setRadioInvestigation(state, button.dataset.investigation);
      break;
    case "request-trader-channel":
      changed = requestTraderChannel(state, button.dataset.channel);
      break;
    case "buy-offer":
      changed = buyTraderOffer(state, button.dataset.offer);
      break;
    case "choose-faction":
      changed = chooseFaction(state, button.dataset.faction);
      break;
    case "combat-attack":
      changed = attackCombat(state);
      break;
    case "combat-heal":
      changed = useBestMedicalItem(state);
      break;
    case "combat-brace":
      changed = braceCombat(state);
      break;
    case "combat-retreat":
      changed = retreatCombat(state);
      break;
    case "set-tab":
      {
        const nextTarget = normalizeMobileTabTarget(button.dataset.tab);
        const nextTab = nextTarget.tabId;
        const nextShelterMode = nextTarget.shelterMode;

        state.ui.mobileMoreOpen = false;
        state.ui.mobileResourceDrawerOpen = false;
        if (nextTab !== "shelter") {
          state.ui.mobileInspectorStructure = null;
        }
        if (nextShelterMode) {
          state.ui.mobileShelterMode = nextShelterMode;
        }

        if (state.ui.activeTab !== nextTab) {
          state.ui.activeTab = nextTab;
          saveState(state);
          setSaveStatus("view saved");
          rerender();
          return;
        }

        if (nextShelterMode && state.ui.mobileShelterMode !== nextShelterMode) {
          state.ui.mobileShelterMode = nextShelterMode;
          saveState(state);
          setSaveStatus("view saved");
          rerender();
          return;
        }

        saveState(state);
        setSaveStatus("view saved");
        rerender();
        return;
      }
    case "toggle-mobile-more":
      state.ui.mobileMoreOpen = !state.ui.mobileMoreOpen;
      if (state.ui.mobileMoreOpen) {
        state.ui.mobileResourceDrawerOpen = false;
      }
      changed = true;
      break;
    case "close-mobile-more":
      if (state.ui.mobileMoreOpen) {
        state.ui.mobileMoreOpen = false;
        changed = true;
      }
      break;
    case "toggle-mobile-resource-drawer":
      state.ui.mobileResourceDrawerOpen = !state.ui.mobileResourceDrawerOpen;
      if (state.ui.mobileResourceDrawerOpen) {
        state.ui.mobileMoreOpen = false;
      }
      changed = true;
      break;
    case "close-mobile-resource-drawer":
      if (state.ui.mobileResourceDrawerOpen) {
        state.ui.mobileResourceDrawerOpen = false;
        changed = true;
      }
      break;
    case "set-mobile-shelter-mode":
      if (button.dataset.mode && state.ui.mobileShelterMode !== button.dataset.mode) {
        state.ui.mobileShelterMode = button.dataset.mode;
        if (button.dataset.mode === "ops") {
          state.ui.mobileInspectorStructure = null;
        }
        changed = true;
      }
      break;
    case "close-mobile-inspector":
      if (state.ui.mobileInspectorStructure) {
        state.ui.mobileInspectorStructure = null;
        changed = true;
      }
      break;
    case "toggle-setting":
      if (Object.prototype.hasOwnProperty.call(state.settings, button.dataset.setting)) {
        state.settings[button.dataset.setting] = !state.settings[button.dataset.setting];
        changed = true;
      }
      break;
    case "skip-tutorial":
      state.settings.tutorialHints = false;
      changed = true;
      break;
    case "set-username": {
      const nextUsername = typeof window.prompt === "function"
        ? window.prompt("Choose a username for this run.", state.player.username || "")
        : null;
      if (typeof nextUsername === "string") {
        const trimmed = nextUsername.trim().slice(0, 18);
        if (trimmed && trimmed !== state.player.username) {
          state.player.username = trimmed;
          changed = true;
        }
      }
      break;
    }
    case "save-game":
      persist("saved to local storage");
      rerender();
      return;
    case "reset-game":
      if (!state.settings.confirmReset || window.confirm("Reset Dead Static and erase the current local save?")) {
        clearSave();
        state = createInitialState();
        evaluateProgression(state);
        persist("save wiped");
        rerender();
      }
      return;
    default:
      return;
  }

  if (changed) {
    persist("autosaved");
    rerender();
  }
}

document.body.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  handleAction(button.dataset.action, button);
});

rerender();
setSaveStatus("autosave armed");

if (typeof window.addEventListener === "function") {
  window.addEventListener("resize", () => {
    rerender();
  });
}

window.setInterval(() => {
  if (processRealtimeTick(state, 1)) {
    rerender();
  }
}, 1000);

window.setInterval(() => {
  persist("autosaved");
}, 15000);

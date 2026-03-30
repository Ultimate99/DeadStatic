import {
  adjustSurvivorRole,
  attackCombat,
  braceCombat,
  burnForWarmth,
  buyTraderOffer,
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
  startWorkJob,
  setExpeditionApproach,
  setExpeditionObjective,
  setNightPlan,
  setRadioInvestigation,
  useBestMedicalItem,
  useItem,
} from "./engine.js";
import { renderGame } from "./render.js";
import { builtPlaceableStructures, canPlaceShelterStructure } from "./shelter-layout.js";
import { clearSave, createInitialState, loadState, saveState } from "./state.js";
import {
  getLeaderboardState,
  initLeaderboard,
  promptForCallsign,
  refreshLeaderboard,
  setLeaderboardUsername,
  submitLeaderboardScore,
} from "./services/leaderboard.js";
import {
  copySaveCode,
  downloadSaveFile,
  importSaveFromCode,
} from "./services/save-transfer.js";

let state = loadState();
evaluateProgression(state);

const saveStatus = document.getElementById("autosave-status");
const tooltipRoot = document.getElementById("ui-tooltip-root");
let tooltipTarget = null;

function isMobileViewport() {
  return typeof window !== "undefined" && Number(window.innerWidth || 0) <= 720;
}

function normalizeTabId(tabId) {
  const legacyMap = {
    overview: "ops",
    player: "survivor",
    inventory: "survivor",
    craft: "workshop",
    shelter: "base",
    shelter_map: "base",
    map: "routes",
    survivors: "crew",
  };
  return legacyMap[tabId] || tabId;
}

function normalizeMobileTabTarget(tabId) {
  const normalized = normalizeTabId(tabId);
  if (!isMobileViewport()) {
    return { tabId: normalized, shelterMode: null };
  }

  if (tabId === "shelter_map") {
    return { tabId: "base", shelterMode: "map" };
  }

  if (normalized === "base") {
    return { tabId: "base", shelterMode: "ops" };
  }

  return { tabId: normalized, shelterMode: null };
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

function syncUsernameWithLeaderboard({ save = false } = {}) {
  const board = getLeaderboardState();
  const boardUsername = board.profile.codename || "";

  if (state.player.username && state.player.username !== boardUsername) {
    setLeaderboardUsername(state.player.username, { silent: true });
    return;
  }

  if (!state.player.username && boardUsername) {
    state.player.username = boardUsername;
    if (save) {
      saveState(state);
    }
  }
}

function clearTooltip() {
  if (!tooltipRoot) {
    return;
  }
  tooltipTarget = null;
  tooltipRoot.innerHTML = "";
  tooltipRoot.dataset.active = "false";
}

function tooltipSource(target) {
  return target?.closest?.("[data-tooltip], [data-tooltip-body], [data-tooltip-title]") || null;
}

function placeTooltip(x, y) {
  if (!tooltipRoot) {
    return;
  }
  const width = Number(window.innerWidth || 0);
  const rootWidth = 260;
  const left = Math.max(16, Math.min(x + 16, width - rootWidth - 16));
  const top = Math.max(16, y + 18);
  tooltipRoot.style.left = `${left}px`;
  tooltipRoot.style.top = `${top}px`;
}

function showTooltip(target, x = 0, y = 0) {
  if (!tooltipRoot || isMobileViewport()) {
    clearTooltip();
    return;
  }
  const title = target.dataset.tooltipTitle || "";
  const meta = target.dataset.tooltipMeta || "";
  const body = target.dataset.tooltipBody || target.dataset.tooltip || target.getAttribute?.("title") || "";
  if (!title && !body) {
    clearTooltip();
    return;
  }
  tooltipTarget = target;
  tooltipRoot.dataset.active = "true";
  tooltipRoot.innerHTML = `
    <div class="ui-tooltip-panel">
      ${meta ? `<span class="ui-tooltip-meta">${meta}</span>` : ""}
      ${title ? `<h4>${title}</h4>` : ""}
      ${body ? `<p>${body}</p>` : ""}
    </div>
  `;
  placeTooltip(x, y);
}

initLeaderboard({ onChange: rerender });
syncUsernameWithLeaderboard({ save: true });

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
    case "start-work-job":
    case "buy-upgrade":
      changed = startWorkJob(state, button.dataset.upgrade);
      break;
    case "inspect-structure":
      if (state.ui.selectedStructureId !== button.dataset.structure) {
        state.ui.selectedStructureId = button.dataset.structure;
        state.ui.inspectedStructure = button.dataset.structure;
        changed = true;
      }
      state.ui.pendingPlacementStructureId = null;
      if (isMobileViewport()) {
        state.ui.mobileInspectorStructure = button.dataset.structure;
        state.ui.mobileShelterMode = "map";
        changed = true;
      }
      break;
    case "start-placing-structure":
      if (button.dataset.structure && state.ui.pendingPlacementStructureId !== button.dataset.structure) {
        state.ui.pendingPlacementStructureId = button.dataset.structure;
        state.ui.selectedStructureId = button.dataset.structure;
        state.ui.inspectedStructure = button.dataset.structure;
        changed = true;
      }
      if (isMobileViewport()) {
        state.ui.mobileShelterMode = "map";
      }
      break;
    case "clear-placement":
      if (state.ui.pendingPlacementStructureId) {
        state.ui.pendingPlacementStructureId = null;
        changed = true;
      }
      break;
    case "place-structure": {
      const structureId = button.dataset.structure;
      const x = Number(button.dataset.x);
      const y = Number(button.dataset.y);
      const builtIds = builtPlaceableStructures(state.upgrades).map((structure) => structure.id);
      if (
        structureId
        && Number.isFinite(x)
        && Number.isFinite(y)
        && canPlaceShelterStructure(state.shelter.layout.placed || {}, structureId, x, y, builtIds)
      ) {
        state.shelter.layout.placed = {
          ...(state.shelter.layout?.placed || {}),
          [structureId]: { x, y },
        };
        state.ui.pendingPlacementStructureId = null;
        state.ui.selectedStructureId = structureId;
        state.ui.inspectedStructure = structureId;
        if (isMobileViewport()) {
          state.ui.mobileInspectorStructure = structureId;
          state.ui.mobileShelterMode = "map";
        }
        changed = true;
      } else if (structureId) {
        setSaveStatus("blocked: choose a highlighted open tile");
        rerender();
        return;
      }
      break;
    }
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
    case "set-callsign": {
      const before = state.player.username;
      if (!promptForCallsign()) {
        return;
      }
      const nextUsername = getLeaderboardState().profile.codename || "";
      if (nextUsername && nextUsername !== state.player.username) {
        state.player.username = nextUsername;
        changed = true;
      } else if (!nextUsername && state.player.username) {
        state.player.username = "";
        changed = true;
      } else {
        setSaveStatus(before ? "username updated" : "username ready");
        rerender();
        return;
      }
      break;
    }
    case "refresh-leaderboard":
      refreshLeaderboard();
      return;
    case "submit-leaderboard":
      if (state.player.username) {
        setLeaderboardUsername(state.player.username, { silent: true });
      }
      submitLeaderboardScore(state);
      return;
    case "download-save-file":
      downloadSaveFile(state);
      setSaveStatus("save file downloaded");
      return;
    case "copy-save-code":
      copySaveCode(state)
        .then(() => setSaveStatus("save code copied"))
        .catch(() => setSaveStatus("could not copy save code"));
      return;
    case "import-save-code": {
      const raw = typeof window.prompt === "function"
        ? window.prompt("Paste a Dead Static save code or raw JSON save.")
        : "";
      if (!raw) {
        return;
      }

      try {
        const nextState = importSaveFromCode(raw);
        evaluateProgression(nextState);
        state = nextState;
        syncUsernameWithLeaderboard();
        persist("save imported");
        rerender();
      } catch (error) {
        setSaveStatus(error.message || "import failed");
        if (typeof window.alert === "function") {
          window.alert(error.message || "Could not import save.");
        }
      }
      return;
    }
    case "set-tab":
      {
        const nextTarget = normalizeMobileTabTarget(button.dataset.tab);
        const nextTab = nextTarget.tabId;
        const nextShelterMode = nextTarget.shelterMode;

        state.ui.mobileMoreOpen = false;
        state.ui.mobileResourceDrawerOpen = false;
        if (nextTab !== "base") {
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
      const boardUsername = getLeaderboardState().profile.codename || "";
      const nextUsername = typeof window.prompt === "function"
        ? window.prompt("Choose a username for this run.", state.player.username || boardUsername || "")
        : null;
      if (typeof nextUsername === "string") {
        const trimmed = nextUsername.trim().slice(0, 18);
        if (trimmed && trimmed !== state.player.username) {
          state.player.username = trimmed;
          setLeaderboardUsername(trimmed, { silent: true });
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
        syncUsernameWithLeaderboard();
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

document.body.addEventListener("mouseover", (event) => {
  const nextTarget = tooltipSource(event.target);
  if (!nextTarget) {
    return;
  }
  showTooltip(nextTarget, event.clientX || 0, event.clientY || 0);
});

document.body.addEventListener("mousemove", (event) => {
  if (!tooltipTarget || isMobileViewport()) {
    return;
  }
  placeTooltip(event.clientX || 0, event.clientY || 0);
});

document.body.addEventListener("mouseout", (event) => {
  const nextTarget = tooltipSource(event.target);
  if (!nextTarget || tooltipTarget !== nextTarget) {
    return;
  }
  clearTooltip();
});

document.body.addEventListener("focusin", (event) => {
  const nextTarget = tooltipSource(event.target);
  if (!nextTarget) {
    return;
  }
  showTooltip(nextTarget, 220, 120);
});

document.body.addEventListener("focusout", (event) => {
  const nextTarget = tooltipSource(event.target);
  if (!nextTarget) {
    return;
  }
  clearTooltip();
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

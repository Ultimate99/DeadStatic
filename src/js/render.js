import { getDerivedState } from "./engine.js";
import {
  byId,
  ensureActiveTab,
  isMobileViewport,
  renderCondition,
  renderMobileBottomNav,
  renderMobileSheets,
  renderMobileSurvivalStrip,
  renderResourceBar,
  renderSubtitle,
  renderSummaryStrip,
  renderTabBar,
} from "./render/shared.js";
import { renderTabStage } from "./render/stage.js";
import { renderShelterMapTab } from "./render/shelter-map.js";
import {
  renderCraftTab,
  renderInventoryTab,
  renderMapTab,
  renderOverviewTab,
  renderShelterTab,
} from "./render/tabs-primary.js";
import {
  renderCombatBanner,
  renderFactionTab,
  renderHelpTab,
  renderLeaderboardTab,
  renderLogTab,
  renderRadioTab,
  renderSettingsTab,
  renderSurvivorTab,
  renderTradeTab,
} from "./render/tabs-secondary.js";

function renderTabContent(state, derived) {
  const isMobile = isMobileViewport();
  switch (state.ui.activeTab) {
    case "craft":
      return renderCraftTab(state, isMobile);
    case "inventory":
      return renderInventoryTab(state, derived, isMobile);
    case "shelter":
      return renderShelterTab(state, derived, isMobile);
    case "shelter_map":
      return renderShelterMapTab(state);
    case "map":
      return renderMapTab(state, isMobile);
    case "survivors":
      return renderSurvivorTab(state, derived, isMobile);
    case "radio":
      return renderRadioTab(state, isMobile);
    case "trade":
      return renderTradeTab(state, isMobile);
    case "factions":
      return renderFactionTab(state, isMobile);
    case "leaderboard":
      return renderLeaderboardTab(state, isMobile);
    case "log":
      return renderLogTab(state, isMobile);
    case "help":
      return renderHelpTab(state, isMobile);
    case "settings":
      return renderSettingsTab(state, isMobile);
    case "overview":
    default:
      return renderOverviewTab(state, derived, isMobile);
  }
}

export function renderGame(state) {
  const derived = getDerivedState(state);
  const isMobile = isMobileViewport();
  const tabs = ensureActiveTab(state, isMobile);
  const tabContent = byId("tab-content");

  byId("day-clock").textContent = `Day ${state.time.day} / ${String(state.time.hour).padStart(2, "0")}:00`;
  renderSubtitle(state);
  renderResourceBar(state, isMobile);
  renderCondition(state, derived);
  renderSummaryStrip(state, derived);
  renderMobileSurvivalStrip(state, derived);
  renderCombatBanner(state);
  renderTabBar(state, isMobile ? [] : tabs);
  if (isMobile) {
    renderMobileBottomNav(state, tabs);
    renderMobileSheets(state, tabs);
  } else {
    byId("mobile-bottom-nav").innerHTML = "";
    byId("mobile-sheet-layer").innerHTML = "";
  }
  tabContent.dataset.tab = state.ui.activeTab;
  tabContent.dataset.mobile = isMobile ? "true" : "false";
  document.body.dataset.activeTab = state.ui.activeTab;
  document.body.dataset.mobile = isMobile ? "true" : "false";
  document.body.dataset.motion = state.settings.reducedMotion ? "reduced" : "full";
  document.body.dataset.copy = state.settings.briefStageCopy ? "brief" : "full";
  tabContent.innerHTML = renderTabStage(state, derived, renderTabContent(state, derived), isMobile);
}

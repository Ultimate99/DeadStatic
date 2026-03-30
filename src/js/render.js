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
import {
  renderBaseTab,
  renderOpsTab,
  renderRoutesTab,
  renderWorkshopTab,
} from "./render/tabs-primary.js";
import {
  renderCombatBanner,
  renderCrewTab,
  renderHelpTab,
  renderLeaderboardTab,
  renderLogTab,
  renderRadioTab,
  renderSettingsTab,
  renderSurvivorTab,
} from "./render/tabs-secondary.js";

function renderTabContent(state, derived) {
  const isMobile = isMobileViewport();
  switch (state.ui.activeTab) {
    case "survivor":
      return renderSurvivorTab(state, derived, isMobile);
    case "workshop":
      return renderWorkshopTab(state, derived, isMobile);
    case "base":
      return renderBaseTab(state, derived, isMobile);
    case "routes":
      return renderRoutesTab(state, derived, isMobile);
    case "radio":
      return renderRadioTab(state, isMobile);
    case "crew":
      return renderCrewTab(state, derived, isMobile);
    case "leaderboard":
      return renderLeaderboardTab(state, isMobile);
    case "log":
      return renderLogTab(state, isMobile);
    case "help":
      return renderHelpTab(state, isMobile);
    case "settings":
      return renderSettingsTab(state, isMobile);
    case "ops":
    default:
      return renderOpsTab(state, derived, isMobile);
  }
}

export function renderGame(state) {
  const derived = getDerivedState(state);
  const isMobile = isMobileViewport();
  const tabs = ensureActiveTab(state);
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

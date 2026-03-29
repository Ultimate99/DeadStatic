import { getDerivedState } from "./engine.js";
import {
  byId,
  ensureActiveTab,
  renderCondition,
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
  renderLogTab,
  renderRadioTab,
  renderSurvivorTab,
  renderTradeTab,
} from "./render/tabs-secondary.js";

function renderTabContent(state, derived) {
  switch (state.ui.activeTab) {
    case "craft":
      return renderCraftTab(state);
    case "inventory":
      return renderInventoryTab(state, derived);
    case "shelter":
      return renderShelterTab(state, derived);
    case "shelter_map":
      return renderShelterMapTab(state);
    case "map":
      return renderMapTab(state);
    case "survivors":
      return renderSurvivorTab(state, derived);
    case "radio":
      return renderRadioTab(state);
    case "trade":
      return renderTradeTab(state);
    case "factions":
      return renderFactionTab(state);
    case "log":
      return renderLogTab(state);
    case "overview":
    default:
      return renderOverviewTab(state, derived);
  }
}

export function renderGame(state) {
  const derived = getDerivedState(state);
  const tabs = ensureActiveTab(state);
  const tabContent = byId("tab-content");

  byId("day-clock").textContent = `Day ${state.time.day} / ${String(state.time.hour).padStart(2, "0")}:00`;
  renderSubtitle(state);
  renderResourceBar(state);
  renderCondition(state, derived);
  renderSummaryStrip(state, derived);
  renderCombatBanner(state);
  renderTabBar(state, tabs);
  tabContent.dataset.tab = state.ui.activeTab;
  document.body.dataset.activeTab = state.ui.activeTab;
  tabContent.innerHTML = renderTabStage(state, derived, renderTabContent(state, derived));
}

import { RESOURCE_DEFS, RESOURCE_ORDER } from "../data.js";
import { getVisibleResourceIds } from "../selectors/resources.js";
import { TAB_DEFS, getSubtitle, getSummaryPills, getVisibleTabs } from "../selectors/ui.js";
import { byId } from "./primitives.js";

const RESOURCE_TOKENS = {
  scrap: "SC",
  food: "FD",
  water: "WT",
  cloth: "CL",
  fuel: "FL",
  parts: "PT",
  wire: "WR",
  medicine: "MD",
  ammo: "AM",
  electronics: "EL",
  chemicals: "CH",
  morale: "MO",
  reputation: "RP",
  relics: "RL",
};

function meterClass(percent) {
  if (percent <= 30) {
    return "danger";
  }
  if (percent <= 60) {
    return "warn";
  }
  return "good";
}

export { TAB_DEFS };

export function ensureActiveTab(state) {
  const tabs = getVisibleTabs(state);
  if (!tabs.some((tab) => tab.id === state.ui.activeTab)) {
    state.ui.activeTab = tabs[0]?.id || "overview";
  }
  return tabs;
}

export function renderResourceBar(state) {
  const resourceIds = getVisibleResourceIds(state, RESOURCE_ORDER);

  byId("resource-bar").innerHTML = resourceIds
    .map((resourceId) => `
      <div class="resource-pill tier-${RESOURCE_DEFS[resourceId].tier}">
        <div class="resource-pill-key">
          <span class="resource-token tier-${RESOURCE_DEFS[resourceId].tier}">${RESOURCE_TOKENS[resourceId] || RESOURCE_DEFS[resourceId].label.slice(0, 2).toUpperCase()}</span>
          <span>${RESOURCE_DEFS[resourceId].label}</span>
        </div>
        <strong>${state.resources[resourceId]}</strong>
      </div>
    `)
    .join("");
}

export function renderCondition(state, derived) {
  const percent = Math.round((state.condition / derived.maxCondition) * 100);
  byId("condition-readout").textContent = `Condition ${state.condition}/${derived.maxCondition}`;
  byId("condition-bar").innerHTML = `<div class="meter-fill ${meterClass(percent)}" style="width:${percent}%"></div>`;
}

export function renderSummaryStrip(state, derived) {
  const pills = getSummaryPills(state, derived);

  byId("summary-strip").innerHTML = pills
    .map((pill) => `
      <div class="summary-pill">
        <span class="summary-badge" aria-hidden="true">${pill.icon || pill.label.slice(0, 2).toUpperCase()}</span>
        <div class="summary-pill-top">
          <span>${pill.label}</span>
          <strong>${pill.value}</strong>
        </div>
      </div>
    `)
    .join("");
}

export function renderSubtitle(state) {
  byId("world-subtitle").textContent = getSubtitle(state);
}

export function renderTabBar(state, tabs) {
  byId("tab-bar").innerHTML = tabs
    .map((tab) => {
      const count = typeof tab.count === "function" ? tab.count(state) : null;
      return `
        <button
          type="button"
          class="tab-button ${state.ui.activeTab === tab.id ? "is-active" : ""}"
          data-action="set-tab"
          data-tab="${tab.id}"
        >
          <span class="tab-icon" aria-hidden="true">${tab.icon || tab.label.slice(0, 2).toUpperCase()}</span>
          <span class="tab-copy">
            <strong>${tab.label}</strong>
          </span>
          ${count ? `<span class="tab-count">${count}</span>` : ""}
        </button>
      `;
    })
    .join("");
}

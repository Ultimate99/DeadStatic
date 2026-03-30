import { ITEMS, RESOURCE_DEFS, RESOURCE_ORDER } from "../data.js";
import {
  getActiveWorkJob,
  getNightForecast,
  getShelterSystems,
  getShelterUpkeep,
  getVisibleUpgrades,
} from "../engine.js";
import { iconMarkup } from "./icons.js";
import { navSprite, renderItemSprite } from "./sprites.js";

export const TAB_DEFS = [
  {
    id: "ops",
    label: "Ops",
    hint: "directive",
    icon: "overview",
    count: (state) => state.stats.searches || null,
  },
  {
    id: "survivor",
    label: "Survivor",
    hint: "loadout",
    icon: "player",
    count: (state) => Object.values(state.inventory).reduce((sum, amount) => sum + amount, 0) || null,
  },
  {
    id: "workshop",
    label: "Workshop",
    hint: "plans",
    icon: "craft",
    unlock: "upgrades",
    count: (state) => getVisibleUpgrades(state).filter((upgrade) => !state.upgrades.includes(upgrade.id)).length || null,
  },
  {
    id: "base",
    label: "Base",
    hint: "compound",
    icon: "shelter",
    unlock: "shelter",
    count: (state) => state.upgrades.filter((upgradeId) => upgradeId !== "basic_barricade").length || null,
  },
  {
    id: "routes",
    label: "Routes",
    hint: "zones",
    icon: "map",
    unlock: "map",
    count: (state) => state.unlockedZones.length || null,
  },
  {
    id: "radio",
    label: "Radio",
    hint: "signals",
    icon: "radio",
    unlock: "radio",
    count: (state) => state.story.radioProgress || null,
  },
  {
    id: "crew",
    label: "Crew",
    hint: "roster",
    icon: "crew",
    unlock: "survivors",
    count: (state) => state.survivors.total || null,
  },
  {
    id: "leaderboard",
    label: "Board",
    hint: "hosted",
    icon: "leaderboard",
    utility: true,
  },
  {
    id: "log",
    label: "Log",
    hint: "archive",
    icon: "log",
    utility: true,
  },
  {
    id: "help",
    label: "Help",
    hint: "guide",
    icon: "generic",
    utility: true,
  },
  {
    id: "settings",
    label: "Settings",
    hint: "options",
    icon: "generic",
    utility: true,
  },
];

export const MOBILE_PRIMARY_TABS = ["ops", "workshop", "base", "routes"];
export const MOBILE_MORE_TABS = ["survivor", "crew", "radio", "leaderboard", "log", "help", "settings"];

export function byId(id) {
  return document.getElementById(id);
}

export function isMobileViewport() {
  return typeof window !== "undefined" && Number(window.innerWidth || 0) <= 720;
}

export function escapeAttribute(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function tooltipPayload(value) {
  if (!value) {
    return { title: "", meta: "", body: "" };
  }
  if (typeof value === "string") {
    return { title: "", meta: "", body: value };
  }
  return {
    title: value.title || "",
    meta: value.meta || "",
    body: value.body || value.text || "",
  };
}

export function tooltipAttrs(value) {
  const payload = tooltipPayload(value);
  if (!payload.title && !payload.body && !payload.meta) {
    return "";
  }
  const fallback = [payload.title, payload.body].filter(Boolean).join(" — ");
  return ` data-tooltip="true" data-tooltip-title="${escapeAttribute(payload.title)}" data-tooltip-meta="${escapeAttribute(payload.meta)}" data-tooltip-body="${escapeAttribute(payload.body)}" title="${escapeAttribute(fallback)}"`;
}

function resourceDef(resourceId) {
  return RESOURCE_DEFS[resourceId] || { label: resourceId.replace(/_/g, " "), icon: resourceId };
}

export function resourceLabel(resourceId) {
  return resourceDef(resourceId).label;
}

export function itemLabel(itemId) {
  return ITEMS[itemId]?.name || itemId.replace(/_/g, " ");
}

function tabVisible(state, tab) {
  if (!tab.unlock) {
    return true;
  }
  return state.unlockedSections.includes(tab.unlock);
}

export function ensureActiveTab(state) {
  const tabs = TAB_DEFS.filter((tab) => tabVisible(state, tab));
  if (!tabs.some((tab) => tab.id === state.ui.activeTab)) {
    state.ui.activeTab = tabs[0]?.id || "ops";
  }
  return tabs;
}

export function surfaceCard({ title = "", meta = "", body = "", className = "" }) {
  return `
    <section class="surface-card ${className}">
      ${(title || meta)
        ? `
          <header class="surface-head">
            <div>
              ${title ? `<h3>${title}</h3>` : ""}
            </div>
            ${meta ? `<span class="tag">${meta}</span>` : ""}
          </header>
        `
        : ""}
      <div class="surface-body">${body}</div>
    </section>
  `;
}

export function actionButton({
  action,
  label,
  meta = "",
  disabled = false,
  variant = "",
  data = {},
  icon = "",
  tooltip = "",
}) {
  const attrs = Object.entries(data)
    .map(([key, value]) => `data-${key}="${escapeAttribute(value)}"`)
    .join(" ");
  const iconMarkupText = icon ? `<span class="button-icon">${iconMarkup(icon)}</span>` : "";
  return `
    <button
      type="button"
      class="action-button ${variant}"
      data-action="${action}"
      ${attrs}
      ${disabled ? "disabled" : ""}
      ${tooltipAttrs(tooltip)}
    >
      ${iconMarkupText}
      <span class="button-copy">
        <strong>${label}</strong>
        ${meta ? `<small>${meta}</small>` : ""}
      </span>
    </button>
  `;
}

export function tagList(values = []) {
  return values
    .filter(Boolean)
    .map((value) => `<span class="chip">${value}</span>`)
    .join("");
}

export function renderSplitPane(leftColumn = [], rightColumn = []) {
  return `
    <div class="split-pane">
      <div class="split-column">${leftColumn.join("")}</div>
      <div class="split-column">${rightColumn.join("")}</div>
    </div>
  `;
}

function countMarkup(tab, state) {
  if (!tab.count) {
    return "";
  }
  const count = tab.count(state);
  if (!count) {
    return "";
  }
  return `<span class="tab-count">${count}</span>`;
}

function resourcePillMarkup(state, resourceId, compact = false) {
  const def = resourceDef(resourceId);
  const value = state.resources?.[resourceId] || 0;
  const tooltip = {
    title: def.label,
    meta: "resource",
    body: `${def.label} in reserve: ${value}.`,
  };
  return `
    <button type="button" class="resource-pill ${compact ? "is-compact" : ""}" ${tooltipAttrs(tooltip)}>
      <span class="resource-pill-key">
        <span class="resource-icon">${iconMarkup(def.icon || "generic")}</span>
        <span>${def.label}</span>
      </span>
      <strong>${value}</strong>
    </button>
  `;
}

function sortedDiscoveredResources(state) {
  const known = new Set(state.discoveredResources || []);
  return RESOURCE_ORDER.filter((resourceId) => known.has(resourceId));
}

function conditionClass(percent) {
  if (percent <= 24) return "danger";
  if (percent <= 50) return "warn";
  return "good";
}

export function renderSubtitle(state) {
  const subtitle = byId("world-subtitle");
  if (!subtitle) {
    return;
  }
  if (state.story.secretProgress >= 3) {
    subtitle.textContent = "The shelter is holding. The signal is getting closer.";
    return;
  }
  if (state.story.radioProgress >= 2) {
    subtitle.textContent = "Static now sounds like intent, not noise.";
    return;
  }
  subtitle.textContent = "Hold the room. Keep the fire alive. Listen when the wires start talking.";
}

export function renderResourceBar(state, isMobile = false) {
  const resourceBar = byId("resource-bar");
  if (!resourceBar) {
    return;
  }
  const ids = sortedDiscoveredResources(state).slice(0, isMobile ? 4 : 8);
  resourceBar.innerHTML = ids.map((resourceId) => resourcePillMarkup(state, resourceId, isMobile)).join("");
}

export function renderCondition(state, derived) {
  const percent = Math.max(0, Math.min(100, Math.round((state.condition / derived.maxCondition) * 100)));
  const readout = byId("condition-readout");
  const meter = byId("condition-bar");
  if (!readout || !meter) {
    return;
  }
  readout.textContent = `Condition ${state.condition}/${derived.maxCondition}`;
  meter.innerHTML = `<div class="meter-fill ${conditionClass(percent)}" style="width:${percent}%"></div>`;
}

function summaryTile(label, value, tooltip = "") {
  return `
    <div class="summary-pill"${tooltipAttrs(tooltip)}>
      <div class="summary-pill-top">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    </div>
  `;
}

export function renderSummaryStrip(state, derived) {
  const strip = byId("summary-strip");
  if (!strip) {
    return;
  }
  const upkeep = getShelterUpkeep(state);
  const systems = getShelterSystems(state, derived);
  const activeJob = getActiveWorkJob(state);
  const forecast = getNightForecast(state);
  strip.innerHTML = [
    summaryTile("Warmth", state.shelter.warmth.toFixed(1), { title: "Warmth", meta: "shelter", body: "Low warmth drags condition and weakens the shelter through long nights." }),
    summaryTile("Threat", state.shelter.threat.toFixed(1), { title: "Threat", meta: "pressure", body: "Threat grows from noise, time, poor defenses, and bad nights." }),
    summaryTile("Noise", state.shelter.noise.toFixed(1), { title: "Noise", meta: "pressure", body: "Noise invites infected attention and raises bad-contact risk." }),
    summaryTile("Meal", `${upkeep.mealHoursLeft}h`, { title: "Meal due", meta: "upkeep", body: `Crew eats ${upkeep.mealCost} food every ${upkeep.mealHours}h.` }),
    summaryTile("Water", `${upkeep.waterHoursLeft}h`, { title: "Water due", meta: "upkeep", body: `Crew drinks ${upkeep.waterCost} water every ${upkeep.waterHours}h.` }),
    summaryTile("Queue", activeJob ? `${activeJob.hoursRemaining}h` : "idle", { title: "Active work", meta: activeJob ? activeJob.kind : "queue", body: activeJob ? `${activeJob.label} completes at ${activeJob.completesAt}.` : "No active build or craft job." }),
    summaryTile("Night", forecast.siege ? "siege" : forecast.breachChance > 0.42 ? "hard" : "watch", { title: "Night forecast", meta: "forecast", body: `Danger ${forecast.dangerScore.toFixed(1)}. Breach ${(forecast.breachChance * 100).toFixed(0)}%. Siege ${forecast.siege ? "possible" : "unlikely"}.` }),
    summaryTile("Power", `${systems.powerSupply}/${systems.powerDemand || 0}`, { title: "Shelter power", meta: systems.powerState, body: `Power ${systems.powerSupply} vs demand ${systems.powerDemand}. ${systems.powerState}.` }),
  ].join("");
}

export function renderMobileSurvivalStrip(state, derived) {
  const mobileStrip = byId("mobile-survival-strip");
  if (!mobileStrip) {
    return;
  }
  const percent = Math.max(0, Math.min(100, Math.round((state.condition / derived.maxCondition) * 100)));
  const resourceIds = sortedDiscoveredResources(state);
  const topResources = resourceIds.slice(0, 4);
  const overflowCount = Math.max(0, resourceIds.length - topResources.length);
  mobileStrip.innerHTML = `
    <div class="mobile-survival-head">
      <span class="mobile-condition-label">Condition</span>
      <strong>${state.condition}/${derived.maxCondition}</strong>
    </div>
    <div class="mobile-condition-meter">
      <div class="meter-fill ${conditionClass(percent)}" style="width:${percent}%"></div>
    </div>
    <div class="mobile-resource-row">
      ${topResources.map((resourceId) => resourcePillMarkup(state, resourceId, true)).join("")}
      ${overflowCount
        ? `
          <button type="button" class="resource-pill resource-pill-overflow" data-action="toggle-mobile-resource-drawer">
            <span class="resource-pill-key"><span>More</span></span>
            <strong>+${overflowCount}</strong>
          </button>
        `
        : ""}
    </div>
  `;
}

export function renderTabBar(state, tabs) {
  const tabBar = byId("tab-bar");
  if (!tabBar) {
    return;
  }
  tabBar.innerHTML = tabs
    .map((tab) => `
      <button
        type="button"
        class="rail-button ${state.ui.activeTab === tab.id ? "is-active" : ""} ${tab.utility ? "is-utility" : ""}"
        data-action="set-tab"
        data-tab="${tab.id}"
      >
        <span class="rail-icon">${navSprite(tab.icon || "generic")}</span>
        <span class="rail-copy">
          <strong>${tab.label}</strong>
          <small>${tab.hint || "section"}</small>
        </span>
        ${countMarkup(tab, state)}
      </button>
    `)
    .join("");
}

export function renderMobileBottomNav(state, tabs) {
  const nav = byId("mobile-bottom-nav");
  if (!nav) {
    return;
  }
  const primaryTabs = MOBILE_PRIMARY_TABS.map((tabId) => tabs.find((tab) => tab.id === tabId)).filter(Boolean);
  const moreActive = !MOBILE_PRIMARY_TABS.includes(state.ui.activeTab) || state.ui.mobileMoreOpen;
  nav.innerHTML = `
    ${primaryTabs.map((tab) => `
      <button type="button" class="mobile-nav-button ${state.ui.activeTab === tab.id ? "is-active" : ""}" data-action="set-tab" data-tab="${tab.id}">
        <span class="mobile-nav-icon">${navSprite(tab.icon || "generic")}</span>
        <span>${tab.label}</span>
      </button>
    `).join("")}
    <button type="button" class="mobile-nav-button ${moreActive ? "is-active" : ""}" data-action="toggle-mobile-more">
      <span class="mobile-nav-icon">${navSprite("generic")}</span>
      <span>More</span>
    </button>
  `;
}

export function renderMobileSheets(state, tabs) {
  const layer = byId("mobile-sheet-layer");
  if (!layer) {
    return;
  }
  const resourceIds = sortedDiscoveredResources(state);
  const secondaryTabs = MOBILE_MORE_TABS.map((tabId) => tabs.find((tab) => tab.id === tabId)).filter(Boolean);

  if (state.ui.mobileResourceDrawerOpen) {
    layer.innerHTML = `
      <button type="button" class="mobile-sheet-backdrop" data-action="close-mobile-resource-drawer" aria-label="Close resources"></button>
      <section class="mobile-sheet mobile-resource-drawer">
        <div class="mobile-sheet-head">
          <div>
            <span class="note-label">Resources</span>
            <h3>Field reserves</h3>
          </div>
          <button type="button" class="action-button compact" data-action="close-mobile-resource-drawer"><span class="button-copy"><strong>Close</strong></span></button>
        </div>
        <div class="mobile-sheet-body mobile-resource-grid">
          ${resourceIds.map((resourceId) => resourcePillMarkup(state, resourceId)).join("")}
        </div>
      </section>
    `;
    return;
  }

  if (state.ui.mobileMoreOpen) {
    layer.innerHTML = `
      <button type="button" class="mobile-sheet-backdrop" data-action="close-mobile-more" aria-label="Close menu"></button>
      <section class="mobile-sheet mobile-more-sheet">
        <div class="mobile-sheet-head">
          <div>
            <span class="note-label">Sections</span>
            <h3>More</h3>
          </div>
          <button type="button" class="action-button compact" data-action="close-mobile-more"><span class="button-copy"><strong>Close</strong></span></button>
        </div>
        <div class="mobile-sheet-body mobile-more-grid">
          ${secondaryTabs.map((tab) => `
            <button type="button" class="mobile-more-button ${state.ui.activeTab === tab.id ? "is-active" : ""}" data-action="set-tab" data-tab="${tab.id}">
              <span class="mobile-nav-icon">${navSprite(tab.icon || "generic")}</span>
              <span>${tab.label}</span>
            </button>
          `).join("")}
        </div>
      </section>
    `;
    return;
  }

  layer.innerHTML = "";
}

export function renderTutorialBanner(state) {
  if (!state.settings.tutorialHints) {
    return "";
  }
  const hints = [];
  if (!state.player.username) {
    hints.push("Set Username");
  }
  if ((state.stats.searches || 0) < 4) {
    hints.push("Search rubble");
  }
  if (!state.upgrades.includes("campfire")) {
    hints.push("Build heat");
  }
  if (!hints.length) {
    return "";
  }
  return `
    <section class="tutorial-strip ${isMobileViewport() ? "tutorial-strip-mobile" : ""}">
      <div class="tutorial-copy">
        <span class="note-label">Guide</span>
        <strong>New player guide</strong>
        <span>${hints.join(" / ")}</span>
      </div>
      <div class="tutorial-actions">
        ${!state.player.username ? actionButton({ action: "set-username", label: "Set Username", icon: "username", variant: "compact" }) : ""}
        ${actionButton({ action: "skip-tutorial", label: "Skip", icon: "retreat", variant: "compact" })}
      </div>
    </section>
  `;
}

export function renderMiniLog(state, limit = 5) {
  const entries = state.log.slice(0, limit);
  return `
    <div class="mini-log">
      ${entries.map((entry) => `
        <div class="mini-log-line">
          <span>${entry.stamp}</span>
          <p>${entry.text}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function itemPrimaryLine(item, amount) {
  if (!item) {
    return "";
  }
  const parts = [];
  if (item.attack) parts.push(`atk ${item.attack}`);
  if (item.defense) parts.push(`def ${item.defense}`);
  if (item.heal) parts.push(`heal ${item.heal}`);
  if (item.backpackSlots) parts.push(`carry +${item.backpackSlots}`);
  if (item.toolRole) parts.push(item.toolRole.replace(/_/g, " "));
  if (item.resources) {
    Object.entries(item.resources).forEach(([resourceId, value]) => {
      parts.push(`${resourceLabel(resourceId)} +${value}`);
    });
  }
  if (!parts.length && amount > 1) {
    parts.push(`x${amount}`);
  }
  return parts.join(" / ");
}

function itemTooltipText(item, amount) {
  const lines = [item.name, `Type: ${item.type}`];
  const primary = itemPrimaryLine(item, amount);
  if (primary) {
    lines.push(primary);
  }
  if (item.description) {
    lines.push(item.description);
  }
  return lines.join(" • ");
}

export function renderInventoryItemCard(itemId, amount, options = {}) {
  const item = ITEMS[itemId];
  if (!item) {
    return "";
  }
  const tooltip = {
    title: item.name,
    meta: item.type,
    body: itemTooltipText(item, amount),
  };
  let actionMarkup = "";
  if (options.showAction !== false) {
    if (item.type === "weapon" || item.type === "armor" || item.type === "backpack") {
      actionMarkup = actionButton({
        action: "equip-item",
        label: "Equip",
        icon: "gear",
        variant: "compact",
        data: { item: itemId },
        tooltip,
      });
    } else if (item.type === "consumable") {
      actionMarkup = actionButton({
        action: "use-item",
        label: "Use",
        icon: "use",
        variant: "compact",
        data: { item: itemId },
        tooltip,
      });
    }
  }

  return `
    <div class="inventory-sprite-card"${tooltipAttrs(tooltip)}>
      <div class="inventory-sprite-top">
        <span class="inventory-sprite-wrap">${renderItemSprite(itemId, item, options.large ? 40 : 24)}</span>
        <span class="inventory-amount">${amount}</span>
      </div>
      <div class="inventory-sprite-copy">
        <strong>${item.name}</strong>
        <small>${itemPrimaryLine(item, amount) || item.type}</small>
      </div>
      ${actionMarkup}
    </div>
  `;
}

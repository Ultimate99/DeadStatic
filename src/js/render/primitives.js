import { ITEMS, RESOURCE_DEFS } from "../data.js";
import { iconMarkup } from "./icons.js";

export function byId(id) {
  return document.getElementById(id);
}

function actionToken(action, label) {
  const tokens = {
    "search-rubble": "search",
    "search-source": "scavenge",
    "buy-upgrade": "build",
    "burn-warmth": "warmth",
    "forage-food": "food",
    "drink-water": "water",
    "eat-ration": "food",
    "patch-barricade": "barricade",
    "craft-ammo": "ammo",
    "set-night-plan": "night",
    "prepare-zone": "map",
    "set-approach": "route",
    "launch-prepared": "launch",
    "equip-item": "gear",
    "use-item": "use",
    "adjust-role": "crew",
    "recruit": "recruit",
    "scan-radio": "radio",
    "refresh-trader": "trade",
    "buy-offer": "trade",
    "choose-faction": "factions",
    "refresh-leaderboard": "sync",
    "submit-leaderboard": "upload",
    "set-callsign": "username",
    "download-save-file": "save_file",
    "copy-save-code": "copy",
    "trigger-save-import": "load_file",
    "import-save-code": "code",
    "combat-attack": "combat",
    "combat-heal": "heal",
    "combat-retreat": "retreat",
  };

  return tokens[action] || "generic";
}

export function actionButton({ action, label, meta = "", disabled = false, variant = "", data = {}, icon = "" }) {
  const dataAttrs = Object.entries(data)
    .map(([key, value]) => ` data-${key}="${value}"`)
    .join("");
  const classes = ["action-button", variant].filter(Boolean).join(" ");
  const badge = icon || actionToken(action, label);

  return `
    <button
      type="button"
      class="${classes}"
      data-action="${action}"${dataAttrs}
      ${disabled ? "disabled" : ""}
    >
      <span class="action-icon" aria-hidden="true">${iconMarkup(badge)}</span>
      <span class="action-copy">
        <span class="action-label">${label}</span>
        ${meta ? `<span class="action-meta">${meta}</span>` : ""}
      </span>
    </button>
  `;
}

export function tagList(values = []) {
  return values.map((value) => `<span class="chip">${value}</span>`).join("");
}

export function resourceLabel(resourceId) {
  return RESOURCE_DEFS[resourceId]?.label || resourceId;
}

export function itemLabel(itemId) {
  return ITEMS[itemId]?.name || itemId;
}

export function surfaceCard({ title, meta = "", body = "", className = "" }) {
  return `
    <article class="surface-card ${className}">
      <div class="surface-head">
        <h3>${title}</h3>
        ${meta ? `<span class="tag">${meta}</span>` : ""}
      </div>
      <div class="surface-body">${body}</div>
    </article>
  `;
}

export function renderMiniLog(logEntries, limit) {
  return `
    <div class="mini-log">
      ${logEntries.slice(0, limit).map((entry) => `
        <div class="mini-log-line log-${entry.category || "general"}">
          <span>${entry.stamp}</span>
          <p>${entry.text}</p>
        </div>
      `).join("")}
    </div>
  `;
}

export function renderSplitPane(mainCards, sideCards, className = "") {
  return `
    <div class="tab-columns ${className}">
      <div class="tab-main-column">${mainCards.join("")}</div>
      <div class="tab-side-column">${sideCards.join("")}</div>
    </div>
  `;
}

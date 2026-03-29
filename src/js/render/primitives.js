import { ITEMS, RESOURCE_DEFS } from "../data.js";

export function byId(id) {
  return document.getElementById(id);
}

function tokenFromLabel(label) {
  const words = String(label || "")
    .replace(/[^a-z0-9 ]/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return "DO";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function actionToken(action, label) {
  const tokens = {
    "search-rubble": "SR",
    "search-source": "SV",
    "buy-upgrade": "MK",
    "burn-warmth": "HT",
    "forage-food": "FD",
    "drink-water": "WT",
    "eat-ration": "FD",
    "patch-barricade": "BR",
    "craft-ammo": "AM",
    "set-night-plan": "NT",
    "prepare-zone": "RT",
    "set-approach": "AP",
    "launch-prepared": "GO",
    "equip-item": "EQ",
    "use-item": "US",
    "adjust-role": "CR",
    "recruit": "+1",
    "scan-radio": "RX",
    "refresh-trader": "TR",
    "buy-offer": "$$",
    "choose-faction": "FX",
    "refresh-leaderboard": "LB",
    "submit-leaderboard": "UP",
    "set-callsign": "ID",
    "download-save-file": "SV",
    "copy-save-code": "CP",
    "trigger-save-import": "IN",
    "import-save-code": "CD",
    "combat-attack": "AT",
    "combat-heal": "MD",
    "combat-retreat": "EX",
  };

  return tokens[action] || tokenFromLabel(label);
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
      <span class="action-icon" aria-hidden="true">${badge}</span>
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

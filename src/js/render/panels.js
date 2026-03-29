import { ITEMS } from "../data.js";
import { RARITY_DEFS, RARITY_ORDER } from "../data.js";
import {
  getAnomalyTraceModel,
  getCommandDeskModel,
  getCrewPressureBands,
  getFactionStatus,
  getLogPulseEntries,
  getSignalBandCount,
  getSourceRarityCeiling,
  getSourceUnlockDescription,
  getSourceVisibleEntries,
} from "../selectors/ui.js";
import { actionButton, tagList } from "./primitives.js";

export function sourceRarityCeiling(state, sourceId) {
  return getSourceRarityCeiling(state, sourceId);
}

export function sourceRunCount(state, sourceId) {
  return state.stats.scavengeSources?.[sourceId] || 0;
}

export function describeSourceUnlock(state, source) {
  return getSourceUnlockDescription(state, source);
}

export function lootBandMarkup(state, sourceId = null) {
  const rows = RARITY_ORDER
    .map((rarityId) => {
      const rarity = RARITY_DEFS[rarityId];
      const entries = getSourceVisibleEntries(state, sourceId).filter((entry) => entry.rarity === rarityId);
      if (!entries.length) {
        return "";
      }

      return `
        <div class="rarity-row tier-${rarityId}">
          <div class="surface-head">
            <div>
              <span class="note-label">${rarity.label}</span>
              <h4>${rarity.hint || rarity.label}</h4>
            </div>
            <span class="tag">${entries.length}</span>
          </div>
          <div class="chip-row">${tagList(entries.map((entry) => entry.label || entry.item || entry.resource || entry.id))}</div>
        </div>
      `;
    })
    .filter(Boolean)
    .join("");

  return rows || `<p class="empty-state">Nothing visible on this band yet.</p>`;
}

export function renderCommandDesk(state, derived, availableSources, availableUpgrades) {
  const model = getCommandDeskModel(state, derived, availableSources, availableUpgrades);
  const highlightAction = (() => {
    if (model.preview && model.preview.canLaunch && !state.combat) {
      return actionButton({
        action: "launch-prepared",
        label: `Launch ${model.preview.zone.name}`,
        meta: `${model.preview.approach.label} route`,
        variant: "primary compact",
      });
    }
    if (model.readyUpgrade) {
      return actionButton({
        action: "buy-upgrade",
        label: `${model.readyUpgrade.verb || "Build"} ${model.readyUpgrade.name}`,
        meta: "priority build",
        data: { upgrade: model.readyUpgrade.id },
        variant: "primary compact",
      });
    }
    if (state.flags.burnUnlocked) {
      return actionButton({
        action: "burn-warmth",
        label: "Burn for warmth",
        meta: "10 scrap / immediate relief",
        disabled: state.resources.scrap < 10,
        variant: "compact",
      });
    }
    return actionButton({
      action: "search-rubble",
      label: "Search rubble",
      meta: "default salvage loop",
      variant: "primary compact",
    });
  })();

  return `
    <div class="command-desk">
      <div class="command-card command-primary">
        <span class="note-label">Current directive</span>
        <h4>${model.directive.title}</h4>
        <p class="note">${model.directive.detail}</p>
        <div class="command-action">${highlightAction}</div>
      </div>
      <div class="command-card">
        <span class="note-label">Pressure line</span>
        <h4>${model.forecast.severity}</h4>
        <div class="command-stat-row">
          <div><span>Night</span><strong>${model.forecast.hoursUntilNight}h</strong></div>
          <div><span>Threat</span><strong>${state.shelter.threat.toFixed(1)}</strong></div>
          <div><span>Noise</span><strong>${state.shelter.noise.toFixed(1)}</strong></div>
          <div><span>Defense</span><strong>${derived.defense}</strong></div>
        </div>
      </div>
      <div class="command-card">
        <span class="note-label">Route board</span>
        <h4>${model.routeTitle}</h4>
        <p class="note">${model.routeDetail}</p>
      </div>
      <div class="command-card">
        <span class="note-label">Signal + growth</span>
        <h4>${model.signalTitle}</h4>
        <div class="command-stat-row">
          ${model.growthStats.map((entry) => `<div><span>${entry.label}</span><strong>${entry.value}</strong></div>`).join("")}
        </div>
      </div>
    </div>
  `;
}

export function renderInventoryItemCard(itemId, amount) {
  const item = ITEMS[itemId];
  let actionMarkup = `<p class="note">No direct action.</p>`;
  if (item.type === "weapon" || item.type === "armor") {
    actionMarkup = actionButton({
      action: "equip-item",
      label: `Equip ${item.name}`,
      meta: item.type,
      data: { item: itemId },
    });
  } else if (item.type === "consumable") {
    actionMarkup = actionButton({
      action: "use-item",
      label: `Use ${item.name}`,
      meta: item.type,
      data: { item: itemId },
    });
  }

  return `
    <div class="list-block inventory-item-card">
      <div class="surface-head">
        <h4>${item.name}</h4>
        <span class="tag">${item.type} x${amount}</span>
      </div>
      <p class="note">${item.description}</p>
      ${actionMarkup}
    </div>
  `;
}

export function renderSignalSpectrum(state) {
  const activeBands = getSignalBandCount(state);
  return `
    <div class="signal-spectrum ${state.flags.worldReveal ? "is-revealed" : ""}" aria-hidden="true">
      ${Array.from({ length: 6 }, (_, index) => `
        <span class="signal-bar ${index < activeBands ? "is-hot" : ""}"></span>
      `).join("")}
    </div>
  `;
}

export function renderCrewPressure(state) {
  const bands = getCrewPressureBands(state);

  return `
    <div class="crew-band-grid">
      ${bands.map((band) => `
        <div class="crew-band-card">
          <span>${band.label}</span>
          <strong>${band.value}</strong>
          <small>${band.note}</small>
        </div>
      `).join("")}
    </div>
  `;
}

export function renderFactionStatus(state) {
  const status = getFactionStatus(state);

  return `
    <div class="faction-status-board">
      <div class="faction-status-copy">
        <span class="note-label">Alignment status</span>
        <h4>${status.aligned ? status.aligned.name : "No faction chosen"}</h4>
        <p class="note">${status.description}</p>
      </div>
      <div class="chip-row">${tagList(status.bonuses)}</div>
    </div>
  `;
}

export function renderLogPulse(state) {
  const counts = getLogPulseEntries(state.log);

  return `
    <div class="log-pulse-stack">
      ${counts.length ? counts.map((entry) => `
        <div class="log-pulse-row log-${entry.category}">
          <span>${entry.category}</span>
          <strong>${entry.amount}</strong>
        </div>
      `).join("") : `<p class="empty-state">No categorized entries yet.</p>`}
    </div>
  `;
}

export function renderAnomalyTrace(state) {
  const model = getAnomalyTraceModel(state);

  return `
    <div class="detail-list">
      <div class="anomaly-trace ${state.flags.worldReveal ? "is-open" : ""}" aria-hidden="true">
        ${Array.from({ length: 6 }, (_, index) => `
          <span class="trace-node ${index < model.heat ? "is-hot" : ""}"></span>
        `).join("")}
      </div>
      <div class="ghost-feed">
        ${model.fragments.map((fragment, index) => `
          <div class="ghost-line">
            <span>trace ${String(index + 1).padStart(2, "0")}</span>
            <p>${fragment}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

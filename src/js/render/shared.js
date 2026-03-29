import {
  ITEMS,
  RARITY_DEFS,
  RARITY_ORDER,
  RESOURCE_DEFS,
  RESOURCE_ORDER,
} from "../data.js";
import {
  FACTIONS,
  SEARCH_LOOT_TABLE,
  UPGRADES_BY_ID,
} from "../content.js";
import {
  canAfford,
  formatCost,
  formatMaterials,
  getExpeditionPreview,
  getNightForecast,
  getVisibleUpgrades,
  hasMaterials,
  hasItem,
} from "../engine.js";

export const TAB_DEFS = [
  { id: "overview", label: "Overview", hint: "control", count: (state) => state.stats.searches || null },
  { id: "craft", label: "Craft", hint: "build queue", unlock: "upgrades", count: (state) => getVisibleUpgrades(state).filter((upgrade) => !state.upgrades.includes(upgrade.id)).length || null },
  { id: "inventory", label: "Inventory", hint: "gear hold", unlock: "inventory" },
  { id: "shelter", label: "Shelter", hint: "survival", unlock: "shelter" },
  { id: "shelter_map", label: "Shelter Map", hint: "compound", unlock: "shelter" },
  { id: "map", label: "Map", hint: "routes", unlock: "map", count: (state) => state.unlockedZones.length || null },
  { id: "survivors", label: "Crew", hint: "assignments", unlock: "survivors", count: (state) => state.survivors.total || null },
  { id: "radio", label: "Radio", hint: "signals", unlock: "radio", count: (state) => state.story.radioProgress || null },
  { id: "trade", label: "Trade", hint: "market", unlock: "trader", count: (state) => state.trader.offers.length || null },
  { id: "factions", label: "Factions", hint: "alignment", unlock: "factions" },
  { id: "log", label: "Log", hint: "history" },
  { id: "help", label: "Help", hint: "guide" },
  { id: "settings", label: "Settings", hint: "options" },
];

export function byId(id) {
  return document.getElementById(id);
}

function meterClass(percent) {
  if (percent <= 30) {
    return "danger";
  }
  if (percent <= 60) {
    return "warn";
  }
  return "good";
}

export function actionButton({ action, label, meta = "", disabled = false, variant = "", data = {} }) {
  const dataAttrs = Object.entries(data)
    .map(([key, value]) => ` data-${key}="${value}"`)
    .join("");
  const classes = ["action-button", variant].filter(Boolean).join(" ");

  return `
    <button
      type="button"
      class="${classes}"
      data-action="${action}"${dataAttrs}
      ${disabled ? "disabled" : ""}
    >
      <span class="action-label">${label}</span>
      ${meta ? `<span class="action-meta">${meta}</span>` : ""}
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

function contentAvailable(state, requirements = {}) {
  if (requirements.searches && state.stats.searches < requirements.searches) {
    return false;
  }
  if (requirements.burnUses && state.stats.burnUses < requirements.burnUses) {
    return false;
  }
  if (requirements.day && state.time.day < requirements.day) {
    return false;
  }
  if (requirements.radioProgress && state.story.radioProgress < requirements.radioProgress) {
    return false;
  }
  if (requirements.secretProgress && state.story.secretProgress < requirements.secretProgress) {
    return false;
  }
  if (requirements.survivors && state.survivors.total < requirements.survivors) {
    return false;
  }
  if (requirements.zonesVisited && state.stats.zonesVisited < requirements.zonesVisited) {
    return false;
  }
  if (requirements.reputation && state.resources.reputation < requirements.reputation) {
    return false;
  }
  if (requirements.upgrades && !requirements.upgrades.every((upgradeId) => state.upgrades.includes(upgradeId))) {
    return false;
  }
  if (requirements.items && !requirements.items.every((itemId) => hasItem(state, itemId))) {
    return false;
  }
  if (requirements.flags && !requirements.flags.every((flag) => state.flags[flag])) {
    return false;
  }
  return true;
}

function lootMatchesSource(entry, sourceId) {
  return !sourceId || !entry.sources || entry.sources.includes(sourceId);
}

function sourceVisibleEntries(state, sourceId) {
  return SEARCH_LOOT_TABLE.filter((entry) => lootMatchesSource(entry, sourceId) && contentAvailable(state, entry.requires));
}

export function sourceRarityCeiling(state, sourceId) {
  const visibleRarity = [...RARITY_ORDER]
    .reverse()
    .find((rarityId) => sourceVisibleEntries(state, sourceId).some((entry) => entry.rarity === rarityId)) || "common";

  return {
    id: visibleRarity,
    label: RARITY_DEFS[visibleRarity]?.label || visibleRarity,
  };
}

export function sourceRunCount(state, sourceId) {
  return state.stats.scavengeSources?.[sourceId] || 0;
}

export function describeSourceUnlock(state, source) {
  const requirements = source.requires || {};
  const notes = [];

  if (requirements.searches && state.stats.searches < requirements.searches) {
    notes.push(`${requirements.searches - state.stats.searches} searches`);
  }
  if (requirements.upgrades) {
    const missing = requirements.upgrades
      .filter((upgradeId) => !state.upgrades.includes(upgradeId))
      .map((upgradeId) => UPGRADES_BY_ID[upgradeId]?.name || upgradeId);
    if (missing.length) {
      notes.push(missing.join(" + "));
    }
  }
  if (requirements.radioProgress && state.story.radioProgress < requirements.radioProgress) {
    notes.push(`Signal ${requirements.radioProgress}`);
  }
  if (requirements.secretProgress && state.story.secretProgress < requirements.secretProgress) {
    notes.push(`Secret ${requirements.secretProgress}`);
  }

  return notes.join(" / ") || "ready";
}

function getVisibleTabs(state) {
  return TAB_DEFS.filter((tab) => !tab.unlock || state.unlockedSections.includes(tab.unlock));
}

export function ensureActiveTab(state) {
  const tabs = getVisibleTabs(state);
  if (!tabs.some((tab) => tab.id === state.ui.activeTab)) {
    state.ui.activeTab = tabs[0]?.id || "overview";
  }
  return tabs;
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

export function renderResourceBar(state) {
  const resourceIds = [...state.discoveredResources]
    .filter((resourceId) => RESOURCE_ORDER.includes(resourceId))
    .sort((left, right) => RESOURCE_ORDER.indexOf(left) - RESOURCE_ORDER.indexOf(right));

  byId("resource-bar").innerHTML = resourceIds
    .map((resourceId) => `
      <div class="resource-pill tier-${RESOURCE_DEFS[resourceId].tier}">
        <div class="resource-pill-key">
          <i class="tier-dot tier-${RESOURCE_DEFS[resourceId].tier}"></i>
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
  const pills = [
    { label: "Warmth", value: state.shelter.warmth.toFixed(1) },
    { label: "Threat", value: state.shelter.threat.toFixed(1) },
    { label: "Noise", value: state.shelter.noise.toFixed(1) },
  ];

  if (state.discoveredResources.includes("food")) {
    pills.push({ label: "Hunger", value: `${state.clocks.hunger}/6h` });
  }
  if (state.discoveredResources.includes("water")) {
    pills.push({ label: "Thirst", value: `${state.clocks.thirst}/4h` });
  }
  if (state.unlockedSections.includes("survivors")) {
    pills.push({ label: "Crew", value: `${state.survivors.total}/${derived.survivorCap}` });
  }
  if (state.unlockedSections.includes("radio")) {
    pills.push({ label: "Signal", value: `${state.story.radioProgress}` });
  }

  byId("summary-strip").innerHTML = pills
    .map((pill) => `
      <div class="summary-pill">
        <div class="summary-pill-top">
          <span>${pill.label}</span>
          <strong>${pill.value}</strong>
        </div>
      </div>
    `)
    .join("");
}

export function renderSubtitle(state) {
  let subtitle = "The streets went quiet. The wires did not.";
  if (state.unlockedSections.includes("upgrades")) {
    subtitle = "Rubble stops being debris the second you learn how to sort it.";
  }
  if (state.unlockedSections.includes("map")) {
    subtitle = "The shelter holds. The city starts offering routes and prices.";
  }
  if (state.unlockedSections.includes("radio")) {
    subtitle = "The static stops sounding random once it realizes you are listening.";
  }
  if (state.unlockedSections.includes("factions")) {
    subtitle = "Everyone left alive wants the signal for a different kind of future.";
  }
  if (state.flags.worldReveal) {
    subtitle = "The outbreak had a transmission layer. You are standing inside its residue.";
  }
  byId("world-subtitle").textContent = subtitle;
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
          <span class="tab-copy">
            <strong>${tab.label}</strong>
            <small>${tab.hint || "section"}</small>
          </span>
          ${count ? `<span class="tab-count">${count}</span>` : ""}
        </button>
      `;
    })
    .join("");
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

export function lootBandMarkup(state, sourceId = null) {
  const rows = RARITY_ORDER
    .map((rarityId) => {
      const rarity = RARITY_DEFS[rarityId];
      const entries = SEARCH_LOOT_TABLE.filter((entry) => (
        entry.rarity === rarityId
        && lootMatchesSource(entry, sourceId)
        && contentAvailable(state, entry.requires)
      ));
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

function readyUpgradeCandidate(state, upgrades) {
  return upgrades.find((upgrade) => canAfford(state, upgrade.cost) && hasMaterials(state, upgrade.materials)) || null;
}

function currentDirective(state, upgrades) {
  const readyUpgrade = readyUpgradeCandidate(state, upgrades);
  if (state.combat) {
    return {
      title: "Combat contact",
      detail: "Resolve the current encounter before you push any other operation.",
    };
  }
  if (!state.flags.burnUnlocked) {
    return {
      title: "Stabilize the room",
      detail: `${Math.max(0, 3 - state.stats.searches)} more rubble searches unlock warmth control.`,
    };
  }
  if (readyUpgrade) {
    return {
      title: `Build ${readyUpgrade.name}`,
      detail: "A funded upgrade is waiting. Converting salvage into systems is the fastest way forward.",
    };
  }
  if (state.expedition.selectedZone) {
    const preview = getExpeditionPreview(state, state.expedition.selectedZone, state.expedition.approach);
    if (preview) {
      return {
        title: `Launch ${preview.zone.name}`,
        detail: `${preview.approach.label} route is staged. ${preview.hours}h travel with ${Math.round(preview.encounterChance * 100)}% encounter pressure.`,
      };
    }
  }
  if (state.unlockedSections.includes("radio") && state.resources.fuel > 0 && state.resources.parts > 0) {
    return {
      title: "Sweep the band",
      detail: "The receiver has enough fuel and parts. Push signal progress while the line is viable.",
    };
  }
  if (state.unlockedSections.includes("map") && !state.expedition.selectedZone) {
    return {
      title: "Prepare a route",
      detail: "Use the map to stage a zone before the next push. Approach choice now matters.",
    };
  }
  return {
    title: "Push the scavenging lanes",
    detail: "Keep the salvage loop moving until the next system or route unlocks.",
  };
}

// Keep onboarding to one recommendation at a time so guidance clarifies the loop
// instead of turning into another dense information panel.
export function getTutorialStep(state) {
  if (!state.settings.tutorialHints) {
    return null;
  }

  if (!state.player.username) {
    return {
      id: "username",
      title: "Pick a username",
      summary: "Set a handle for this run before the game opens up further.",
      chips: ["one-time setup", "used across the run"],
      tabs: ["overview", "settings"],
      action: {
        action: "set-username",
        label: "Set Username",
        meta: "tutorial step 1",
        variant: "primary compact",
      },
    };
  }

  if (state.combat) {
    return {
      id: "combat",
      title: "Resolve the contact",
      summary: "Combat blocks the rest of the run. Attack for tempo, brace into heavy intents, heal only if needed.",
      chips: ["brace cuts the next hit", "retreat loses ground"],
      tabs: ["overview"],
      action: {
        action: "combat-attack",
        label: "Attack",
        meta: "end the fight",
        variant: "primary compact",
      },
    };
  }

  if (state.stats.searches < 1) {
    return {
      id: "search",
      title: "Start with rubble",
      summary: "Search rubble first. Scrap is the root resource for everything that follows.",
      chips: ["get scrap", "unlock warmth"],
      tabs: ["overview"],
      action: {
        action: "search-rubble",
        label: "Search rubble",
        meta: "tutorial step 2",
        variant: "primary compact",
      },
    };
  }

  if (!state.flags.burnUnlocked) {
    return {
      id: "warmth",
      title: "Unlock warmth control",
      summary: "A few more rubble runs unlock the burn-for-warmth action. That is your first survival stabilizer.",
      chips: [`${Math.max(0, 3 - state.stats.searches)} searches left`, "survive today"],
      tabs: ["overview"],
      action: {
        action: "search-rubble",
        label: "Keep scavenging",
        meta: "unlock warmth",
        variant: "primary compact",
      },
    };
  }

  if (state.unlockedSections.includes("upgrades") && !state.upgrades.includes("shelter_stash")) {
    const stashReady = canAfford(state, UPGRADES_BY_ID.shelter_stash.cost) && hasMaterials(state, UPGRADES_BY_ID.shelter_stash.materials);
    return {
      id: "stash",
      title: "Build Shelter Stash first",
      summary: "The stash is the first real pivot from raw panic into shelter management.",
      chips: ["opens shelter loop", "better survival flow"],
      tabs: ["overview", "craft"],
      action: state.ui.activeTab === "craft" && stashReady
        ? {
            action: "buy-upgrade",
            label: "Build Shelter Stash",
            meta: "first shelter upgrade",
            data: { upgrade: "shelter_stash" },
            variant: "primary compact",
          }
        : {
            action: "set-tab",
            label: "Open Craft",
            meta: stashReady ? "build next" : "check materials",
            data: { tab: "craft" },
            variant: "primary compact",
          },
    };
  }

  if (state.upgrades.includes("shelter_stash") && !state.upgrades.includes("food_search")) {
    const foodReady = canAfford(state, UPGRADES_BY_ID.food_search.cost) && hasMaterials(state, UPGRADES_BY_ID.food_search.materials);
    return {
      id: "food_loop",
      title: "Secure food next",
      summary: "After shelter, hunger and water become the next failure point. Build the food loop before you over-expand.",
      chips: ["food > comfort", "stabilize before routes"],
      tabs: ["overview", "craft"],
      action: state.ui.activeTab === "craft" && foodReady
        ? {
            action: "buy-upgrade",
            label: "Build Simple Food Search",
            meta: "unlock provisions",
            data: { upgrade: "food_search" },
            variant: "primary compact",
          }
        : {
            action: "set-tab",
            label: "Open Craft",
            meta: foodReady ? "build next" : "check materials",
            data: { tab: "craft" },
            variant: "primary compact",
          },
    };
  }

  if (state.unlockedSections.includes("map") && state.stats.expeditions < 1) {
    return {
      id: "first_route",
      title: "Stage the first route",
      summary: "Map runs now need a zone, an objective, and an approach. Start with one clean route instead of trying to learn every system at once.",
      chips: ["pick one zone", "launch one run"],
      tabs: ["overview", "map"],
      action: {
        action: "set-tab",
        label: "Open Map",
        meta: "prepare a route",
        data: { tab: "map" },
        variant: "primary compact",
      },
    };
  }

  if (state.unlockedSections.includes("survivors") && state.survivors.total < 1) {
    return {
      id: "crew",
      title: "Recruit the first survivor",
      summary: "Crew matters once the shelter can feed them. One survivor is enough to start learning roles.",
      chips: ["roles unlock slowly", "do not overstaff early"],
      tabs: ["overview", "survivors"],
      action: {
        action: state.ui.activeTab === "survivors" ? "recruit" : "set-tab",
        label: state.ui.activeTab === "survivors" ? "Recruit survivor" : "Open Crew",
        meta: state.ui.activeTab === "survivors" ? "18 scrap / 3 food" : "crew tab",
        data: state.ui.activeTab === "survivors" ? {} : { tab: "survivors" },
        disabled: state.ui.activeTab === "survivors" && !canAfford(state, { scrap: 18, food: 3 }),
        variant: "primary compact",
      },
    };
  }

  if (state.unlockedSections.includes("radio") && state.stats.radioScans < 1) {
    return {
      id: "radio",
      title: "Pick one radio track",
      summary: "Radio progress is directed now. Repeat one investigation until it gives up a milestone.",
      chips: ["tracks are deterministic", "do not spread scans thin"],
      tabs: ["overview", "radio"],
      action: {
        action: state.ui.activeTab === "radio" ? "scan-radio" : "set-tab",
        label: state.ui.activeTab === "radio" ? "Sweep band" : "Open Radio",
        meta: state.ui.activeTab === "radio" ? "1 fuel / 1 parts" : "start signal work",
        data: state.ui.activeTab === "radio" ? {} : { tab: "radio" },
        disabled: state.ui.activeTab === "radio" && (state.resources.fuel < 1 || state.resources.parts < 1),
        variant: "primary compact",
      },
    };
  }

  if (state.unlockedSections.includes("trader") && !state.trader.offers.length) {
    return {
      id: "trade",
      title: "Open a trade channel",
      summary: "Trade is for fixing shortages, not browsing. Pull a channel only when you know what you need.",
      chips: ["solve bottlenecks", "not a reroll shop"],
      tabs: ["overview", "trade"],
      action: {
        action: state.ui.activeTab === "trade" ? "request-trader-channel" : "set-tab",
        label: state.ui.activeTab === "trade" ? "Open Market" : "Open Trade",
        meta: state.ui.activeTab === "trade" ? "pull current stock" : "channel view",
        data: state.ui.activeTab === "trade" ? { channel: "open_market" } : { tab: "trade" },
        variant: "primary compact",
      },
    };
  }

  return null;
}

export function renderTutorialBanner(state) {
  const step = getTutorialStep(state);
  if (!step) {
    return "";
  }

  const visibleOnThisTab = state.ui.activeTab === "overview" || step.tabs.includes(state.ui.activeTab);
  if (!visibleOnThisTab) {
    return "";
  }

  return `
    <section class="tutorial-strip">
      <div class="tutorial-copy">
        <span class="note-label">New player guide</span>
        <h3>${step.title}</h3>
        <p class="note">${step.summary}</p>
        <div class="chip-row">${tagList(step.chips)}</div>
      </div>
      <div class="tutorial-actions">
        ${actionButton(step.action)}
        ${actionButton({
          action: "skip-tutorial",
          label: "Skip tutorial",
          meta: "can re-enable in Settings",
          variant: "compact",
        })}
      </div>
    </section>
  `;
}

export function renderCommandDesk(state, derived, availableSources, availableUpgrades) {
  const forecast = getNightForecast(state);
  const readyUpgrade = readyUpgradeCandidate(state, availableUpgrades);
  const directive = currentDirective(state, availableUpgrades);
  const preview = state.expedition.selectedZone
    ? getExpeditionPreview(state, state.expedition.selectedZone, state.expedition.approach)
    : null;
  const highlightAction = (() => {
    if (preview && preview.canLaunch && !state.combat) {
      return actionButton({
        action: "launch-prepared",
        label: `Launch ${preview.zone.name}`,
        meta: `${preview.approach.label} route`,
        variant: "primary compact",
      });
    }
    if (readyUpgrade) {
      return actionButton({
        action: "buy-upgrade",
        label: `${readyUpgrade.verb || "Build"} ${readyUpgrade.name}`,
        meta: "priority build",
        data: { upgrade: readyUpgrade.id },
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
        <h4>${directive.title}</h4>
        <p class="note">${directive.detail}</p>
        <div class="command-action">${highlightAction}</div>
      </div>
      <div class="command-card">
        <span class="note-label">Pressure line</span>
        <h4>${forecast.severity}</h4>
        <div class="command-stat-row">
          <div><span>Night</span><strong>${forecast.hoursUntilNight}h</strong></div>
          <div><span>Threat</span><strong>${state.shelter.threat.toFixed(1)}</strong></div>
          <div><span>Noise</span><strong>${state.shelter.noise.toFixed(1)}</strong></div>
          <div><span>Defense</span><strong>${derived.defense}</strong></div>
        </div>
      </div>
      <div class="command-card">
        <span class="note-label">Route board</span>
        <h4>${preview ? preview.zone.name : "No route staged"}</h4>
        <p class="note">${preview
          ? `${preview.approach.label} / ${preview.hours}h / ${Math.round(preview.encounterChance * 100)}% encounter`
          : state.unlockedSections.includes("map")
            ? "Pick a zone in Map and stage an approach before launch."
            : "Routes surface later. Keep leaning on the city."}</p>
      </div>
      <div class="command-card">
        <span class="note-label">Signal + growth</span>
        <h4>${state.unlockedSections.includes("radio") ? `Signal ${state.story.radioProgress}` : "Receiver dark"}</h4>
        <div class="command-stat-row">
          <div><span>Lanes</span><strong>${availableSources.length}</strong></div>
          <div><span>Builds</span><strong>${availableUpgrades.length}</strong></div>
          <div><span>Crew</span><strong>${state.survivors.total}/${derived.survivorCap}</strong></div>
          <div><span>Morale</span><strong>${state.resources.morale}</strong></div>
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
  const activeBands = Math.max(1, Math.min(6, state.story.radioProgress + (state.flags.worldReveal ? 2 : 1)));
  return `
    <div class="signal-spectrum ${state.flags.worldReveal ? "is-revealed" : ""}" aria-hidden="true">
      ${Array.from({ length: 6 }, (_, index) => `
        <span class="signal-bar ${index < activeBands ? "is-hot" : ""}"></span>
      `).join("")}
    </div>
  `;
}

export function renderCrewPressure(state) {
  const bands = [
    { label: "Scavengers", value: state.survivors.assigned.scavenger, note: "slow salvage income" },
    { label: "Guards", value: state.survivors.assigned.guard, note: "night defense" },
    { label: "Medics", value: state.survivors.assigned.medic, note: "condition mitigation" },
    { label: "Scouts", value: state.survivors.assigned.scout, note: "route yield and escape" },
    { label: "Tuners", value: state.survivors.assigned.tuner, note: "radio depth and pathing" },
  ];

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
  const aligned = FACTIONS.find((faction) => faction.id === state.faction.aligned);
  return `
    <div class="faction-status-board">
      <div class="faction-status-copy">
        <span class="note-label">Alignment status</span>
        <h4>${aligned ? aligned.name : "No faction chosen"}</h4>
        <p class="note">${aligned ? aligned.description : "You are still independent. Every side is watching."}</p>
      </div>
      <div class="chip-row">${tagList(aligned ? aligned.bonuses : ["independent", "open market only"])}</div>
      ${aligned?.costs?.length ? `<div class="chip-row">${tagList(aligned.costs)}</div>` : ""}
    </div>
  `;
}

export function renderLogPulse(state) {
  const orderedCategories = ["loot", "build", "night", "expedition", "radio", "combat", "trade", "notable"];
  const counts = orderedCategories
    .map((category) => ({
      category,
      amount: state.log.filter((entry) => (entry.category || "general") === category).length,
    }))
    .filter((entry) => entry.amount > 0);

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
  const heat = Math.min(6, Math.max(1, state.story.radioProgress + Math.floor(state.story.secretProgress / 2) + (state.flags.worldReveal ? 1 : 0)));
  const fragments = [
    "carrier echo / tower should be dead",
    "civil band bleed / impossible handoff",
    state.flags.bunkerRouteKnown ? "sub-level route / bunker latch humming" : "sub-level route / not yet fixed",
    state.flags.worldReveal ? "dead static / engineered residue confirmed" : "dead static / origin still hidden",
  ];

  return `
    <div class="detail-list">
      <div class="anomaly-trace ${state.flags.worldReveal ? "is-open" : ""}" aria-hidden="true">
        ${Array.from({ length: 6 }, (_, index) => `
          <span class="trace-node ${index < heat ? "is-hot" : ""}"></span>
        `).join("")}
      </div>
      <div class="ghost-feed">
        ${fragments.map((fragment, index) => `
          <div class="ghost-line">
            <span>trace ${String(index + 1).padStart(2, "0")}</span>
            <p>${fragment}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

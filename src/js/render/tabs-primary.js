import { ITEMS } from "../data.js";
import { EXPEDITION_APPROACHES, EXPEDITION_OBJECTIVES, ZONES } from "../content.js";
import {
  canAfford,
  formatCost,
  formatMaterials,
  getActiveWorkJob,
  getAvailableScavengeSources,
  getExpeditionPreview,
  getNightForecast,
  getVisibleUpgrades,
  hasMaterials,
  hasRequiredTools,
  missingRequiredTools,
} from "../engine.js";
import { shelterStructureById } from "../shelter-layout.js";
import { renderBaseScreen } from "./shelter-map.js";
import { renderEnemySprite, renderItemSprite, renderStructureSprite } from "./sprites.js";
import {
  actionButton,
  itemLabel,
  renderMiniLog,
  resourceLabel,
  surfaceCard,
  tagList,
  tooltipAttrs,
} from "./shared.js";

const BUILD_UPGRADE_IDS = new Set([
  "shelter_stash",
  "campfire",
  "basic_barricade",
  "food_crate",
  "crafting_bench",
  "weapon_rack",
  "armor_hooks",
  "watch_post",
  "tripwire_grid",
  "ammo_press",
  "repair_rig",
  "rain_collector",
  "water_still",
  "radio_rig",
  "battery_bank",
  "flood_lights",
  "map_board",
  "survivor_cots",
  "smokehouse",
  "trader_beacon",
  "scout_bike",
  "signal_decoder",
  "auto_scavenger",
  "faraday_mesh",
  "relay_tap",
  "bunker_drill",
]);

function workKind(upgrade) {
  if (upgrade.category === "build" || BUILD_UPGRADE_IDS.has(upgrade.id)) {
    return "build";
  }
  return "craft";
}

function upgradeSection(upgrade) {
  if (workKind(upgrade) === "build") return "Base Builds";
  if (upgrade.category === "tool") return "Tools";
  if (upgrade.category === "weapon") return "Weapons";
  if (upgrade.category === "armor") return "Armor";
  return "Consumables";
}

function directiveText(state) {
  if (!state.player.username) {
    return "Set a username, then start the shelter line.";
  }
  if (state.resources.food <= 0) {
    return "Food is thin. Forage or hit dead pantries next.";
  }
  if (!state.upgrades.includes("campfire")) {
    return "Get heat online before the first cold night.";
  }
  if (!state.upgrades.includes("basic_barricade")) {
    return "Fence the edge before the shelter gets loud.";
  }
  if (!state.upgrades.includes("crafting_bench")) {
    return "Build the bench so tools and better gear stop bottlenecking the run.";
  }
  if (!state.equipped.weapon) {
    return "You still need a weapon. Push the workshop or loot the right components.";
  }
  return "Keep the queue moving while the shelter holds.";
}

function sourceActionMarkup(source) {
  if (source.id === "rubble") {
    return { action: "search-rubble", label: "Search", icon: "search" };
  }
  return { action: "search-source", label: "Run lane", icon: "scavenge", data: { source: source.id } };
}

function sourceCard(state, source) {
  const action = sourceActionMarkup(source);
  const chips = [];
  if (source.hours) chips.push(`${source.hours}h`);
  if (typeof source.noise === "number") chips.push(`noise ${source.noise.toFixed(2)}`);
  if (typeof source.threat === "number") chips.push(`threat ${source.threat.toFixed(2)}`);
  (source.tags || []).slice(0, 2).forEach((tag) => chips.push(tag));

  return `
    <div class="ops-source-card"${tooltipAttrs({
      title: source.label,
      meta: "source",
      body: `${source.description || source.label}. ${chips.join(" / ")}`,
    })}>
      <div class="ops-source-head">
        <span class="ops-source-icon">${source.id === "rubble" ? renderEnemySprite("walker", 34) : renderStructureSprite(source.id === "tree_line" ? "watch_post" : "stash", 34)}</span>
        <div>
          <strong>${source.label}</strong>
          <small>${source.description || source.id.replace(/_/g, " ")}</small>
        </div>
      </div>
      <div class="chip-row">${tagList(chips)}</div>
      ${actionButton({
        action: action.action,
        label: action.label,
        meta: source.id === "rubble" ? "manual salvage" : "field run",
        icon: action.icon,
        variant: "compact",
        data: action.data || {},
      })}
    </div>
  `;
}

function renderOpsBoard(state, derived) {
  const sources = getAvailableScavengeSources(state);
  const activeJob = getActiveWorkJob(state);
  const forecast = getNightForecast(state);
  const mainActions = [];

  mainActions.push(actionButton({
    action: "search-rubble",
    label: "Search rubble",
    meta: "salvage + pressure",
    icon: "search",
    variant: "primary",
  }));

  if (sources.some((source) => source.id === "tree_line")) {
    mainActions.push(actionButton({
      action: "search-source",
      label: "Chop trees",
      meta: "wood line",
      icon: "build",
      variant: "compact",
      data: { source: "tree_line" },
    }));
  }

  if (state.upgrades.includes("food_search")) {
    mainActions.push(actionButton({
      action: "forage-food",
      label: "Forage",
      meta: "manual food",
      icon: "food",
      variant: "compact secondary",
    }));
  }

  const directive = surfaceCard({
    title: "Current directive",
    meta: activeJob ? activeJob.kind : "ops",
    className: "ops-directive-card",
    body: `
      <p class="directive-line">${directiveText(state)}</p>
      <div class="action-row action-row-wrap">${mainActions.join("")}</div>
    `,
  });

  const watch = surfaceCard({
    title: "Watch",
    meta: forecast.siege ? "siege" : "night",
    className: "ops-watch-card",
    body: `
      <div class="fact-grid compact-grid">
        <div class="fact"><span>Danger</span><strong>${forecast.dangerScore.toFixed(1)}</strong></div>
        <div class="fact"><span>Breach</span><strong>${Math.round(forecast.breachChance * 100)}%</strong></div>
        <div class="fact"><span>Queue</span><strong>${activeJob ? `${activeJob.hoursRemaining}h` : "idle"}</strong></div>
        <div class="fact"><span>Cond</span><strong>${state.condition}/${derived.maxCondition}</strong></div>
      </div>
    `,
  });

  const sourcesCard = surfaceCard({
    title: "Field lanes",
    meta: `${sources.length}`,
    className: "ops-sources-panel",
    body: `<div class="ops-source-grid">${sources.map((source) => sourceCard(state, source)).join("")}</div>`,
  });

  const logCard = surfaceCard({
    title: "Recent feed",
    meta: `${state.log.length}`,
    className: "ops-log-card",
    body: renderMiniLog(state, 5),
  });

  return `
    <div class="ops-screen">
      <div class="ops-top-row">
        ${directive}
        ${watch}
      </div>
      ${sourcesCard}
      ${logCard}
    </div>
  `;
}

function upgradeResultLabel(upgrade) {
  if (upgrade.resultLabel) {
    return upgrade.resultLabel;
  }
  if (upgrade.effects?.grantItems) {
    const [itemId] = Object.keys(upgrade.effects.grantItems);
    return itemLabel(itemId);
  }
  return upgrade.name;
}

function upgradeTooltip(state, upgrade, missing) {
  const lines = [
    `${upgrade.name}`,
    `Time ${upgrade.hours || 1}h`,
    `Tier ${(upgrade.tier || "field").replace(/_/g, " ")}`,
  ];
  if (upgrade.cost && Object.keys(upgrade.cost).length) {
    lines.push(`Cost: ${formatCost(upgrade.cost)}`);
  }
  if (upgrade.materials && Object.keys(upgrade.materials).length) {
    lines.push(`Materials: ${formatMaterials(upgrade.materials)}`);
  }
  if (upgrade.requiredTools?.length) {
    lines.push(`Tool: ${upgrade.requiredTools.map((itemId) => itemLabel(itemId)).join(" + ")}`);
  }
  if (upgrade.description) {
    lines.push(upgrade.description);
  }
  if (missing.length) {
    lines.push(`Missing: ${missing.join(" / ")}`);
  }
  return {
    title: upgrade.name,
    meta: upgradeSection(upgrade),
    body: lines.join(" • "),
  };
}

function upgradeSprite(upgrade) {
  const structure = shelterStructureById(upgrade.id);
  if (structure) {
    return renderStructureSprite(structure.spriteId, 36);
  }
  if (upgrade.effects?.grantItems) {
    const [itemId] = Object.keys(upgrade.effects.grantItems);
    return renderItemSprite(itemId, ITEMS[itemId], 32);
  }
  return renderStructureSprite("bench", 36);
}

function renderBlueprintCard(state, upgrade) {
  const built = state.upgrades.includes(upgrade.id);
  const ready = !built
    && !getActiveWorkJob(state)
    && canAfford(state, upgrade.cost)
    && hasMaterials(state, upgrade.materials)
    && hasRequiredTools(state, upgrade.requiredTools);
  const missing = [];
  if (!built) {
    Object.entries(upgrade.cost || {}).forEach(([resourceId, amount]) => {
      const have = state.resources[resourceId] || 0;
      if (have < amount) missing.push(`${resourceLabel(resourceId)} ${have}/${amount}`);
    });
    Object.entries(upgrade.materials || {}).forEach(([itemId, amount]) => {
      const have = state.inventory[itemId] || 0;
      if (have < amount) missing.push(`${itemLabel(itemId)} ${have}/${amount}`);
    });
    missingRequiredTools(state, upgrade.requiredTools || []).forEach((itemId) => missing.push(itemLabel(itemId)));
    if (getActiveWorkJob(state) && !ready) {
      missing.push(`queue busy`);
    }
  }
  const toolText = upgrade.requiredTools?.length ? upgrade.requiredTools.map((itemId) => itemLabel(itemId)).join(" + ") : "none";

  return `
    <div class="blueprint-card ${built ? "is-built" : ready ? "is-ready" : "is-blocked"}"${tooltipAttrs(upgradeTooltip(state, upgrade, missing))}>
      <div class="blueprint-card-top">
        <span class="blueprint-sprite">${upgradeSprite(upgrade)}</span>
        <div class="blueprint-copy">
          <strong>${upgrade.name}</strong>
          <small>${upgradeResultLabel(upgrade)}</small>
        </div>
        <span class="tag">${built ? "built" : ready ? "ready" : "blocked"}</span>
      </div>
      <div class="blueprint-facts">
        <span><strong>${formatCost(upgrade.cost || {}) || "free"}</strong></span>
        <span>time ${upgrade.hours || 1}h</span>
        <span>tool ${toolText}</span>
        <span>tier ${(upgrade.tier || "field").replace(/_/g, " ")}</span>
      </div>
      ${!built ? actionButton({
        action: "start-work-job",
        label: ready ? "Queue" : "Blocked",
        meta: ready ? "start job" : missing[0] || "requirements",
        icon: "build",
        variant: "compact",
        disabled: !ready,
        data: { upgrade: upgrade.id },
        tooltip: upgradeTooltip(state, upgrade, missing),
      }) : ""}
    </div>
  `;
}

function renderWorkshopSection(state, title, upgrades) {
  return surfaceCard({
    title,
    meta: `${upgrades.length}`,
    className: "workshop-section-card",
    body: upgrades.length
      ? `<div class="blueprint-grid">${upgrades.map((upgrade) => renderBlueprintCard(state, upgrade)).join("")}</div>`
      : `<p class="empty-state">No ${title.toLowerCase()} ready on the board yet.</p>`,
  });
}

function renderWorkshopQueue(state) {
  const activeJob = getActiveWorkJob(state);
  const body = activeJob
    ? `
      <div class="fact-grid compact-grid">
        <div class="fact"><span>Job</span><strong>${activeJob.label}</strong></div>
        <div class="fact"><span>Kind</span><strong>${activeJob.kind}</strong></div>
        <div class="fact"><span>Left</span><strong>${activeJob.hoursRemaining}h</strong></div>
        <div class="fact"><span>Due</span><strong>${activeJob.completesAt}</strong></div>
      </div>
      <div class="chip-row">${tagList(activeJob.requiredTools?.length ? activeJob.requiredTools.map((itemId) => itemLabel(itemId)) : ["no tool gate"])}</div>
    `
    : `<p class="empty-state">Queue open. Start one build or craft job, then let time pass while the shelter survives.</p>`;

  return surfaceCard({
    title: "Work in Progress",
    meta: activeJob ? "active" : "idle",
    className: "workshop-queue-card",
    body,
  });
}

export function renderWorkshopTab(state) {
  const visible = getVisibleUpgrades(state).filter((upgrade) => !state.upgrades.includes(upgrade.id));
  const sections = {
    "Base Builds": [],
    Tools: [],
    Weapons: [],
    Armor: [],
    Consumables: [],
  };
  visible.forEach((upgrade) => {
    sections[upgradeSection(upgrade)].push(upgrade);
  });

  return `
    <div class="workshop-screen">
      ${renderWorkshopQueue(state)}
      ${Object.entries(sections).map(([title, upgrades]) => renderWorkshopSection(state, title, upgrades)).join("")}
    </div>
  `;
}

function routeObjectiveButtons(state) {
  return EXPEDITION_OBJECTIVES.map((objective) => actionButton({
    action: "set-objective",
    label: objective.label,
    meta: objective.id === state.expedition.objective ? "selected" : "objective",
    icon: "route",
    variant: `compact secondary ${objective.id === state.expedition.objective ? "is-selected" : ""}`,
    data: { objective: objective.id },
    tooltip: {
      title: objective.label,
      meta: "objective",
      body: objective.description || objective.id,
    },
  })).join("");
}

function routeApproachButtons(state) {
  return EXPEDITION_APPROACHES.map((approach) => actionButton({
    action: "set-approach",
    label: approach.label,
    meta: approach.id === state.expedition.approach ? "selected" : "approach",
    icon: "route",
    variant: `compact secondary ${approach.id === state.expedition.approach ? "is-selected" : ""}`,
    data: { approach: approach.id },
    tooltip: {
      title: approach.label,
      meta: "approach",
      body: approach.description || approach.id,
    },
  })).join("");
}

function zoneCard(state, zone) {
  const preview = getExpeditionPreview(state, zone.id, state.expedition.approach);
  const selected = state.expedition.selectedZone === zone.id;
  const enemy = zone.enemies?.[0];
  return `
    <div class="route-zone-card ${selected ? "is-selected" : ""}"${tooltipAttrs({
      title: zone.name,
      meta: zone.tier || "zone",
      body: `${zone.description || zone.name}. Objective ${EXPEDITION_OBJECTIVES.find((objective) => objective.id === state.expedition.objective)?.label || state.expedition.objective}.`,
    })}>
      <div class="route-zone-head">
        <span class="route-zone-icon">${enemy ? renderEnemySprite(enemy, 38) : renderStructureSprite("watch_post", 38)}</span>
        <div>
          <strong>${zone.name}</strong>
          <small>${zone.description || zone.id.replace(/_/g, " ")}</small>
        </div>
        <span class="tag">${zone.tier || "zone"}</span>
      </div>
      <div class="chip-row">${tagList([
        preview ? `time ${preview.timeCost}h` : null,
        preview ? `risk ${preview.riskBand}` : null,
        preview ? `loot ${preview.lootBand}` : null,
      ])}</div>
      <div class="route-zone-actions">
        ${actionButton({
          action: "prepare-zone",
          label: selected ? "Prepared" : "Prepare",
          meta: "staging",
          icon: "route",
          variant: "compact",
          data: { zone: zone.id },
          tooltip: {
            title: zone.name,
            meta: "route",
            body: `Set ${zone.name} as the active route board selection.`,
          },
        })}
      </div>
    </div>
  `;
}

export function renderRoutesTab(state, _derived, isMobile = false) {
  const selectedZoneId = state.expedition.selectedZone || state.unlockedZones[0];
  const preview = selectedZoneId ? getExpeditionPreview(state, selectedZoneId, state.expedition.approach) : null;
  const previewCard = surfaceCard({
    title: "Route package",
    meta: preview ? preview.zone.name : "none",
    className: "route-preview-card",
    body: preview
      ? `
        <div class="fact-grid compact-grid">
          <div class="fact"><span>Objective</span><strong>${EXPEDITION_OBJECTIVES.find((entry) => entry.id === state.expedition.objective)?.label || state.expedition.objective}</strong></div>
          <div class="fact"><span>Approach</span><strong>${preview.approach.label}</strong></div>
          <div class="fact"><span>Time</span><strong>${preview.timeCost}h</strong></div>
          <div class="fact"><span>Risk</span><strong>${preview.riskBand}</strong></div>
        </div>
        <div class="action-row action-row-wrap">
          ${actionButton({
            action: "launch-prepared",
            label: "Launch run",
            meta: "leave shelter",
            icon: "launch",
            variant: "primary",
          })}
        </div>
      `
      : `<p class="empty-state">Choose a route first.</p>`,
  });

  const controlsCard = surfaceCard({
    title: "Route controls",
    meta: "objective / approach",
    className: "route-controls-card",
    body: `
      <div class="route-control-group">
        <span class="note-label">Objective</span>
        <div class="action-row action-row-wrap">${routeObjectiveButtons(state)}</div>
      </div>
      <div class="route-control-group">
        <span class="note-label">Approach</span>
        <div class="action-row action-row-wrap">${routeApproachButtons(state)}</div>
      </div>
    `,
  });

  const zonesCard = surfaceCard({
    title: "Zone board",
    meta: `${state.unlockedZones.length}`,
    className: "routes-zone-panel",
    body: `<div class="route-zone-grid">${ZONES.filter((zone) => state.unlockedZones.includes(zone.id)).map((zone) => zoneCard(state, zone)).join("")}</div>`,
  });

  if (isMobile) {
    return `<div class="tab-mobile-flow tab-mobile-flow-routes">${previewCard}${controlsCard}${zonesCard}</div>`;
  }

  return `
    <div class="routes-screen">
      <div class="routes-top-row">
        ${previewCard}
        ${controlsCard}
      </div>
      ${zonesCard}
    </div>
  `;
}

export function renderOpsTab(state, derived) {
  return renderOpsBoard(state, derived);
}

export function renderBaseTab(state, derived, isMobile = false) {
  return renderBaseScreen(state, derived, isMobile);
}

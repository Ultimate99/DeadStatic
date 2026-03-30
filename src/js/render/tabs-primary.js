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
  getShelterUpkeep,
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
      <div class="chip-row compact-chip-row">${tagList(chips)}</div>
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

function watchThreatTone(forecast) {
  if (forecast.siege) return "danger";
  if (forecast.breachChance >= 0.34) return "warn";
  return "good";
}

function renderOpsBoard(state, derived, isMobile = false) {
  const sources = getAvailableScavengeSources(state);
  const activeJob = getActiveWorkJob(state);
  const forecast = getNightForecast(state);
  const upkeep = getShelterUpkeep(state);
  const lastReport = state.night?.lastReport || null;
  const mainActions = [];

  mainActions.push(actionButton({
    action: "search-rubble",
    label: "Search rubble",
    meta: "salvage + pressure",
    icon: "search",
    variant: "compact primary",
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
      <div class="directive-compact ${isMobile ? "directive-compact-mobile" : ""}">
        <div class="directive-stack">
          <p class="directive-line">${directiveText(state)}</p>
          <div class="chip-row compact-chip-row">${tagList([
            state.player.username ? `user ${state.player.username}` : "user unset",
            state.equipped.weapon ? `armed ${itemLabel(state.equipped.weapon)}` : "unarmed",
            activeJob ? activeJob.kind : "queue open",
          ])}</div>
        </div>
        <div class="directive-support-row ${isMobile ? "directive-support-row-mobile" : ""}">
          <div class="chip-row compact-chip-row">${tagList([
            activeJob ? `${activeJob.label} ${activeJob.hoursRemaining}h` : "queue open",
            `meal ${upkeep.mealHoursLeft}h`,
            `water ${upkeep.waterHoursLeft}h`,
            forecast.siege ? "siege risk" : "watch line",
          ])}</div>
          <div class="action-row action-row-wrap ops-directive-actions ${isMobile ? "mobile-ops-actions" : ""}">${mainActions.join("")}</div>
        </div>
      </div>
    `,
  });

  const watchTone = watchThreatTone(forecast);
  const threatSprite = forecast.siege
    ? renderEnemySprite("screecher", 46)
    : forecast.breachChance >= 0.34
      ? renderEnemySprite("stalker", 46)
      : renderEnemySprite("walker", 46);

  const watch = surfaceCard({
    title: "Watch",
    meta: forecast.siege ? "siege" : "night",
    className: "ops-watch-card",
    body: `
      <div class="watch-threat-shell watch-threat-shell-${watchTone}">
        <div class="watch-threat-head">
          <span class="watch-threat-sprite">${threatSprite}</span>
          <div>
            <span class="note-label">Night state</span>
            <strong>${forecast.severity.toUpperCase()}</strong>
            <small>${forecast.siege ? "Compound under siege pressure." : "Forecast built from threat, noise, and defenses."}</small>
          </div>
          <span class="tag">${forecast.plan.label}</span>
        </div>
        <div class="watch-threat-grid">
          <div class="watch-metric is-danger"><span>Danger</span><strong>${forecast.dangerScore.toFixed(1)}</strong></div>
          <div class="watch-metric is-breach"><span>Breach</span><strong>${Math.round(forecast.breachChance * 100)}%</strong></div>
          <div class="watch-metric"><span>Queue</span><strong>${activeJob ? `${activeJob.hoursRemaining}h` : "idle"}</strong></div>
          <div class="watch-metric"><span>Defense</span><strong>${forecast.adjustedDefense.toFixed(1)}</strong></div>
        </div>
        <div class="chip-row compact-chip-row">${tagList([
          `coverage ${forecast.systems.coverage.toFixed(1)}`,
          `power ${forecast.systems.powerState}`,
          `maint ${forecast.systems.maintenanceState}`,
          forecast.siege ? "breach line hot" : "perimeter holding",
        ])}</div>
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
    body: `
      ${lastReport ? `
        <div class="night-debrief-card">
          <div class="night-debrief-head">
            <span class="note-label">Last night</span>
            <strong>${lastReport.eventType}</strong>
            <span class="tag">${lastReport.severity}</span>
          </div>
          <p>${lastReport.summary}</p>
          <div class="chip-row compact-chip-row">${tagList([
            lastReport.conditionLoss ? `cond -${lastReport.conditionLoss}` : "line held",
            lastReport.damagedStructures?.length ? `damage ${lastReport.damagedStructures.length}` : "no structural hits",
            lastReport.crewHits?.length ? `crew ${lastReport.crewHits.length}` : "crew intact",
          ])}</div>
        </div>
      ` : ""}
      ${renderMiniLog(state, 5)}
    `,
  });

  if (isMobile) {
    return `
      <div class="tab-mobile-flow tab-mobile-flow-ops">
        <div class="mobile-ops-priority">
          ${directive}
          ${watch}
        </div>
        ${sourcesCard}
        ${logCard}
      </div>
    `;
  }

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

function blueprintStatus(state, upgrade) {
  const built = state.upgrades.includes(upgrade.id);
  const queueBusy = Boolean(getActiveWorkJob(state));
  const hasCost = canAfford(state, upgrade.cost);
  const hasMats = hasMaterials(state, upgrade.materials);
  const missingTools = missingRequiredTools(state, upgrade.requiredTools || []);
  const hasTools = missingTools.length === 0;
  const ready = !built && !queueBusy && hasCost && hasMats && hasTools;
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
    missingTools.forEach((itemId) => missing.push(itemLabel(itemId)));
    if (queueBusy && !ready) {
      missing.push("queue busy");
    }
  }

  let status = "ready";
  let blocker = "ready to queue";
  if (built) {
    status = "built";
    blocker = "already completed";
  } else if (!hasTools) {
    status = "tool";
    blocker = `need ${missingTools.map((itemId) => itemLabel(itemId)).join(" + ")}`;
  } else if (!hasCost || !hasMats) {
    status = "materials";
    blocker = missing.find((entry) => entry !== "queue busy") || "missing materials";
  } else if (queueBusy) {
    status = "queue";
    blocker = "queue busy";
  }

  return {
    built,
    ready,
    queueBusy,
    missing,
    status,
    blocker,
  };
}

function renderBlueprintCard(state, upgrade) {
  const info = blueprintStatus(state, upgrade);
  const toolText = upgrade.requiredTools?.length ? upgrade.requiredTools.map((itemId) => itemLabel(itemId)).join(" + ") : "none";

  return `
    <div class="blueprint-card ${info.built ? "is-built" : info.ready ? "is-ready" : "is-blocked"} blueprint-card-${info.status}"${tooltipAttrs(upgradeTooltip(state, upgrade, info.missing))}>
      <div class="blueprint-card-top">
        <span class="blueprint-sprite">${upgradeSprite(upgrade)}</span>
        <div class="blueprint-copy">
          <strong>${upgrade.name}</strong>
          <small>${upgradeResultLabel(upgrade)}</small>
        </div>
        <span class="tag">${info.built ? "built" : info.ready ? "ready" : info.status}</span>
      </div>
      <div class="blueprint-facts blueprint-facts-grid">
        <span>cost <strong>${formatCost(upgrade.cost || {}) || "free"}</strong></span>
        <span>time <strong>${upgrade.hours || 1}h</strong></span>
        <span>tool <strong>${toolText}</strong></span>
        <span>tier <strong>${(upgrade.tier || "field").replace(/_/g, " ")}</strong></span>
      </div>
      <div class="blueprint-status-line">${info.blocker}</div>
      ${!info.built ? actionButton({
        action: "start-work-job",
        label: info.ready ? "Queue" : "Blocked",
        meta: info.ready ? "start job" : info.blocker,
        icon: "build",
        variant: "compact",
        disabled: !info.ready,
        data: { upgrade: upgrade.id },
        tooltip: upgradeTooltip(state, upgrade, info.missing),
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
  const progress = activeJob
    ? Math.max(0, Math.min(100, Math.round(((activeJob.hoursTotal - activeJob.hoursRemaining) / activeJob.hoursTotal) * 100)))
    : 0;
  const body = activeJob
    ? `
      <div class="workshop-queue-strip">
        <div class="workshop-queue-main">
          <span class="note-label">${activeJob.kind}</span>
          <strong>${activeJob.label}</strong>
          <small>Due ${activeJob.completesAt}</small>
        </div>
        <div class="workshop-queue-metrics">
          <div class="watch-metric"><span>Left</span><strong>${activeJob.hoursRemaining}h</strong></div>
          <div class="watch-metric"><span>Tier</span><strong>${activeJob.tier.replace(/_/g, " ")}</strong></div>
          <div class="watch-metric"><span>Tool</span><strong>${activeJob.requiredTools?.length ? activeJob.requiredTools.map((itemId) => itemLabel(itemId)).join(" + ") : "none"}</strong></div>
        </div>
      </div>
      <div class="workshop-progress-bar"><span style="width:${progress}%"></span></div>
      <div class="chip-row compact-chip-row">${tagList(activeJob.requiredTools?.length ? activeJob.requiredTools.map((itemId) => itemLabel(itemId)) : ["no tool gate"])}</div>
    `
    : `
      <div class="workshop-queue-empty">
        <strong>Queue open</strong>
        <p class="note">Pin one job, then use field lanes or the Base board while the bench works.</p>
        <div class="chip-row compact-chip-row">${tagList(["1 shared queue", "strict tool gates", "time passes during work"])}</div>
      </div>
    `;

  return surfaceCard({
    title: "Work in Progress",
    meta: activeJob ? "active" : "idle",
    className: "workshop-queue-card",
    body,
  });
}

function renderMobileWorkshopSection(state, title, upgrades) {
  return `
    <details class="mobile-workshop-section" ${upgrades.length ? "open" : ""}>
      <summary class="mobile-workshop-summary">
        <div>
          <span class="note-label">Plans</span>
          <strong>${title}</strong>
        </div>
        <span class="tag">${upgrades.length}</span>
      </summary>
      ${upgrades.length
        ? `<div class="blueprint-grid mobile-blueprint-grid">${upgrades.map((upgrade) => renderBlueprintCard(state, upgrade)).join("")}</div>`
        : `<p class="empty-state">No ${title.toLowerCase()} ready on the board yet.</p>`}
    </details>
  `;
}

export function renderWorkshopTab(state, _derived, isMobile = false) {
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

  if (isMobile) {
    return `
      <div class="tab-mobile-flow tab-mobile-flow-workshop mobile-workshop-screen">
        ${renderWorkshopQueue(state)}
        <div class="mobile-workshop-stack">
          ${Object.entries(sections).map(([title, upgrades]) => renderMobileWorkshopSection(state, title, upgrades)).join("")}
        </div>
      </div>
    `;
  }

  return `
    <div class="workshop-screen">
      ${renderWorkshopQueue(state)}
      <div class="workshop-board-grid">
        ${Object.entries(sections).map(([title, upgrades]) => renderWorkshopSection(state, title, upgrades)).join("")}
      </div>
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
        <span class="route-zone-icon">${enemy ? renderEnemySprite(enemy, 42) : renderStructureSprite("watch_post", 42)}</span>
        <div class="route-zone-copy">
          <span class="note-label">${preview?.riskBand || zone.tier || "zone"}</span>
          <strong>${zone.name}</strong>
          <small>${zone.description || zone.id.replace(/_/g, " ")}</small>
        </div>
        <span class="tag">${zone.tier || "zone"}</span>
      </div>
      <div class="route-zone-metrics">
        <span class="route-zone-chip">time ${preview ? `${preview.timeCost}h` : "--"}</span>
        <span class="route-zone-chip">risk ${preview ? preview.riskBand : "--"}</span>
        <span class="route-zone-chip">loot ${preview ? preview.lootBand : "--"}</span>
      </div>
      <div class="chip-row compact-chip-row">${tagList([
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
  const selectedEnemy = preview?.zone?.enemies?.[0] || null;
  const previewCard = surfaceCard({
    title: "Route package",
    meta: preview ? preview.zone.name : "none",
    className: "route-preview-card",
    body: preview
      ? `
        <div class="route-briefing-head">
          <span class="route-briefing-sprite">${selectedEnemy ? renderEnemySprite(selectedEnemy, 54) : renderStructureSprite("watch_post", 54)}</span>
          <div class="route-briefing-copy">
            <span class="note-label">Mission brief</span>
            <strong>${preview.zone.name}</strong>
            <small>${preview.zone.description || "Push a route and get back before the line buckles."}</small>
          </div>
        </div>
        <div class="route-briefing-grid">
          <div class="watch-metric"><span>Objective</span><strong>${EXPEDITION_OBJECTIVES.find((entry) => entry.id === state.expedition.objective)?.label || state.expedition.objective}</strong></div>
          <div class="watch-metric"><span>Approach</span><strong>${preview.approach.label}</strong></div>
          <div class="watch-metric"><span>Time</span><strong>${preview.timeCost}h</strong></div>
          <div class="watch-metric"><span>Risk</span><strong>${preview.riskBand}</strong></div>
        </div>
        <div class="chip-row compact-chip-row">${tagList([
          `loot ${preview.lootBand}`,
          `encounter ${(preview.encounterChance * 100).toFixed(0)}%`,
          `cost ${Object.entries(preview.cost || {}).map(([key, value]) => `${resourceLabel(key)} ${value}`).join(" / ") || "none"}`,
        ])}</div>
        <div class="action-row action-row-wrap route-launch-row">
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
        <div class="route-toggle-row">${routeObjectiveButtons(state)}</div>
      </div>
      <div class="route-control-group">
        <span class="note-label">Approach</span>
        <div class="route-toggle-row">${routeApproachButtons(state)}</div>
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
    return `
      <div class="tab-mobile-flow tab-mobile-flow-routes mobile-routes-screen">
        <div class="mobile-routes-priority">
          ${previewCard}
          ${controlsCard}
        </div>
        ${zonesCard}
      </div>
    `;
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

export function renderOpsTab(state, derived, isMobile = false) {
  return renderOpsBoard(state, derived, isMobile);
}

export function renderBaseTab(state, derived, isMobile = false) {
  return renderBaseScreen(state, derived, isMobile);
}

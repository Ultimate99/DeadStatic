import {
  ITEMS,
  RARITY_DEFS,
  RESOURCE_DEFS,
  RESOURCE_ORDER,
} from "../data.js";
import {
  EXPEDITION_OBJECTIVES,
  EXPEDITION_APPROACHES,
  SCAVENGE_SOURCES,
  ZONES,
} from "../content.js";
import {
  NIGHT_PLANS,
  canAfford,
  formatCost,
  getAvailableScavengeSources,
  getExpeditionPreview,
  getNightForecast,
  getShelterUpkeep,
  getVisibleUpgrades,
  hasMaterials,
  hasItem,
} from "../engine.js";
import {
  actionButton,
  describeSourceUnlock,
  itemLabel,
  lootBandMarkup,
  renderCommandDesk,
  renderInventoryItemCard,
  renderMiniLog,
  renderSplitPane,
  resourceLabel,
  sourceRarityCeiling,
  sourceRunCount,
  surfaceCard,
  tagList,
} from "./shared.js";
import {
  SHELTER_MAP_ANNEXES,
  getBuiltShelterStructures,
  getOutpostStage,
  getShelterMapPerimeter,
  renderShelterMapMobilePanel,
  structureByKey,
} from "./shelter-map.js";

const BUILD_UPGRADE_IDS = new Set([
  "shelter_stash",
  "campfire",
  "basic_barricade",
  "food_crate",
  "crafting_bench",
  "weapon_rack",
  "armor_hooks",
  "watch_post",
  "ammo_press",
  "rain_collector",
  "radio_rig",
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

function upgradeDiscipline(upgrade) {
  if (BUILD_UPGRADE_IDS.has(upgrade.id)) {
    return "build";
  }
  return "craft";
}

function upgradeDisciplineLabel(upgrade) {
  return upgradeDiscipline(upgrade) === "build" ? "base build" : "fieldcraft";
}

function getUpgradeMissingNotes(state, upgrade) {
  const missing = [];

  Object.entries(upgrade.cost || {}).forEach(([resourceId, amount]) => {
    const have = state.resources[resourceId] || 0;
    if (have < amount) {
      missing.push(`${resourceLabel(resourceId)} ${have}/${amount}`);
    }
  });

  Object.entries(upgrade.materials || {}).forEach(([itemId, amount]) => {
    const have = state.inventory[itemId] || 0;
    if (have < amount) {
      missing.push(`${itemLabel(itemId)} ${have}/${amount}`);
    }
  });

  return missing;
}

function renderUpgradeQueue(state, title, ready, blocked, emptyText) {
  return `
    <div class="queue-column">
      <div class="surface-head">
        <h4>${title}</h4>
        <span class="tag">${ready.length + blocked.length}</span>
      </div>
      ${ready.length
        ? `<div class="detail-list">${ready.map((upgrade) => renderUpgradeCard(state, upgrade)).join("")}</div>`
        : ""}
      ${blocked.length
        ? `
          <div class="queue-stack">
            <span class="note-label">Need salvage</span>
            <div class="detail-list">${blocked.map((upgrade) => renderUpgradeCard(state, upgrade)).join("")}</div>
          </div>
        `
        : ""}
      ${!ready.length && !blocked.length ? `<p class="empty-state">${emptyText}</p>` : ""}
    </div>
  `;
}

function renderQuickGoals(state) {
  const sources = getAvailableScavengeSources(state);
  const hasVehicleLane = sources.some((source) => source.id === "vehicle_shells");
  const hasFoodLane = sources.some((source) => source.id === "dead_pantries");
  const goals = [
    { label: "Unlock warmth", value: state.flags.burnUnlocked ? "open" : `${Math.max(0, 3 - state.stats.searches)} searches left` },
    { label: "Open second lane", value: hasVehicleLane ? "open" : `${Math.max(0, 4 - state.stats.searches)} searches left` },
    { label: "Food lane", value: hasFoodLane ? "open" : state.upgrades.includes("food_search") ? "ready on board" : "build Simple Food Search" },
    { label: "Bank wood", value: state.resources.wood > 0 ? `${state.resources.wood} in stash` : "still looking" },
    { label: "Find sharp metal", value: hasItem(state, "sharp_metal") ? "recovered" : "rare salvage" },
  ];

  return `
    <div class="fact-grid">
      ${goals.map((goal) => `
        <div class="fact">
          <span>${goal.label}</span>
          <strong>${goal.value}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderOverviewActions(state) {
  const sources = getAvailableScavengeSources(state);
  const utilityButtons = [];

  if (state.flags.burnUnlocked) {
    utilityButtons.push(actionButton({
      action: "burn-warmth",
      label: "Burn 12 scrap for warmth",
      meta: "12 scrap / immediate shelter relief",
      disabled: state.resources.scrap < 12,
      variant: "compact utility-trigger",
    }));
  }

  if (state.upgrades.includes("food_search")) {
    utilityButtons.push(actionButton({
      action: "forage-food",
      label: "Fallback food search",
      meta: "small gain, still noisy, useful when stores collapse",
      variant: "compact utility-trigger",
    }));
  }

  return `
    <div class="overview-action-shell">
      <div class="scavenge-grid ${sources.length === 1 ? "is-solo" : ""}">
        ${sources.map((source) => {
          const ceiling = sourceRarityCeiling(state, source.id);
          return `
            <div class="source-card ceiling-${ceiling.id}">
              <div class="surface-head">
                <div>
                  <span class="note-label">Scavenge lane</span>
                  <h4>${source.label}</h4>
                </div>
                <span class="tag">${sourceRunCount(state, source.id)} runs</span>
              </div>
              <p class="note">${source.detail}</p>
              <div class="lane-metrics">
                <div><span>Travel</span><strong>${source.hours}h</strong></div>
                <div><span>Lead</span><strong>${source.tags[1] || source.tags[0] || "salvage"}</strong></div>
              </div>
              <div class="chip-row">${tagList([...source.tags, `ceiling ${ceiling.label}`])}</div>
              <div class="chip-row">${tagList(source.focus)}</div>
              ${actionButton({
                action: source.id === "rubble" ? "search-rubble" : "search-source",
                label: source.label,
                meta: `${source.hours}h / ${source.tags[1] || "salvage lane"}`,
                variant: source.id === "rubble" ? "primary source-trigger" : "source-trigger",
                data: source.id === "rubble" ? {} : { source: source.id },
              })}
            </div>
          `;
        }).join("")}
      </div>
      ${utilityButtons.length ? `<div class="overview-utility-row">${utilityButtons.join("")}</div>` : ""}
    </div>
  `;
}

function renderUpgradeCard(state, upgrade) {
  const built = state.upgrades.includes(upgrade.id);
  const ready = canAfford(state, upgrade.cost) && hasMaterials(state, upgrade.materials);
  const discipline = upgradeDisciplineLabel(upgrade);
  const meta = [];
  const missing = getUpgradeMissingNotes(state, upgrade);

  meta.push(discipline);
  if (Object.keys(upgrade.cost || {}).length) {
    meta.push(formatCost(upgrade.cost));
  }
  if (upgrade.materials && Object.keys(upgrade.materials).length) {
    meta.push(Object.entries(upgrade.materials).map(([itemId, amount]) => `${ITEMS[itemId]?.name || itemId} x${amount}`).join(" / "));
  }

  return `
    <div class="list-block upgrade-card ${built ? "is-built-upgrade" : ready ? "is-ready-upgrade" : "is-blocked-upgrade"}">
      <div class="surface-head">
        <h4>${upgrade.name}</h4>
        <span class="tag">${built ? "built" : ready ? "ready" : "blocked"}</span>
      </div>
      <p class="note">${upgrade.description}</p>
      ${meta.length ? `<div class="chip-row">${tagList(meta)}</div>` : ""}
      ${!built && missing.length ? `<div class="chip-row">${tagList(missing)}</div>` : ""}
      ${built ? "" : actionButton({
        action: "buy-upgrade",
        label: `${upgrade.verb || "Build"} ${upgrade.name}`,
        meta: ready ? "Permanent unlock" : "Need salvage or tools",
        disabled: !ready,
        data: { upgrade: upgrade.id },
      })}
    </div>
  `;
}

export function renderOverviewTab(state, derived, _isMobile = false) {
  const availableUpgrades = getVisibleUpgrades(state).filter((upgrade) => !state.upgrades.includes(upgrade.id));
  const availableSources = getAvailableScavengeSources(state);
  const lockedSources = SCAVENGE_SOURCES.filter((source) => !availableSources.some((entry) => entry.id === source.id)).slice(0, 3);
  const sections = [
    surfaceCard({
      title: "Operations desk",
      meta: `${getNightForecast(state).severity}`,
      className: "span-12",
      body: renderCommandDesk(state, derived, availableSources, availableUpgrades),
    }),
    surfaceCard({
      title: "Scavenge board",
      meta: `${availableSources.length} lanes`,
      className: "span-8",
      body: `${renderOverviewActions(state)}${!state.unlockedSections.includes("upgrades") ? `<div class="spacer-top">${renderQuickGoals(state)}</div>` : ""}`,
    }),
    surfaceCard({
      title: "What the static remembers",
      meta: `${Math.min(5, state.log.length)} recent`,
      className: "span-4",
      body: renderMiniLog(state.log, 5),
    }),
  ];

  if (state.ui.notableFind) {
    sections.unshift(surfaceCard({
      title: "Notable find",
      meta: `${RARITY_DEFS[state.ui.notableFind.rarity]?.label || state.ui.notableFind.rarity}`,
      className: "span-12",
      body: `
        <div class="feature-find">
          <div>
            <span class="note-label">Recovered from</span>
            <h3>${state.ui.notableFind.label}</h3>
            <p class="note">${state.ui.notableFind.sourceLabel} paid out on ${state.ui.notableFind.stamp}.</p>
          </div>
          <div class="chip-row">${tagList([
            `${state.ui.notableFind.amount} recovered`,
            RARITY_DEFS[state.ui.notableFind.rarity]?.hint || "notable salvage",
          ])}</div>
        </div>
      `,
    }));
  }

  if (state.unlockedSections.includes("upgrades")) {
    sections.push(surfaceCard({
      title: "Lane intel",
      meta: `${availableSources.length} active / ${lockedSources.length} pending`,
      className: "span-7",
      body: `
        <div class="detail-list">
          ${availableSources.map((source) => `
            <div class="list-block compact-block">
              <div class="surface-head">
                <h4>${source.label}</h4>
                <span class="tag">${sourceRarityCeiling(state, source.id).label}</span>
              </div>
              <p class="note">${source.description}</p>
              <div class="chip-row">${tagList(source.focus)}</div>
            </div>
          `).join("")}
          ${lockedSources.length ? lockedSources.map((source) => `
            <div class="list-block compact-block">
              <div class="surface-head">
                <h4>${source.label}</h4>
                <span class="tag">locked</span>
              </div>
              <p class="note">${describeSourceUnlock(state, source)}</p>
            </div>
          `).join("") : ""}
        </div>
      `,
    }));
    sections.push(surfaceCard({
      title: "Ready to build",
      meta: `${availableUpgrades.length} open`,
      className: "span-5",
      body: availableUpgrades.length
        ? `<div class="detail-list">${availableUpgrades.slice(0, 4).map((upgrade) => renderUpgradeCard(state, upgrade)).join("")}</div>`
        : `<p class="empty-state">Nothing new is ready. Push the city harder.</p>`,
    }));
  }

  return `<div class="tab-grid tab-grid-overview">${sections.join("")}</div>`;
}

export function renderCraftTab(state, isMobile = false) {
  const visibleUpgrades = getVisibleUpgrades(state);
  const available = visibleUpgrades.filter((upgrade) => !state.upgrades.includes(upgrade.id));
  const buildUpgrades = available.filter((upgrade) => upgradeDiscipline(upgrade) === "build");
  const craftUpgrades = available.filter((upgrade) => upgradeDiscipline(upgrade) === "craft");
  const readyBuilds = buildUpgrades.filter((upgrade) => canAfford(state, upgrade.cost) && hasMaterials(state, upgrade.materials));
  const blockedBuilds = buildUpgrades.filter((upgrade) => !readyBuilds.includes(upgrade));
  const readyCrafts = craftUpgrades.filter((upgrade) => canAfford(state, upgrade.cost) && hasMaterials(state, upgrade.materials));
  const blockedCrafts = craftUpgrades.filter((upgrade) => !readyCrafts.includes(upgrade));
  const built = state.upgrades
    .map((upgradeId) => visibleUpgrades.find((upgrade) => upgrade.id === upgradeId))
    .filter(Boolean);
  const builtBuilds = built.filter((upgrade) => upgradeDiscipline(upgrade) === "build");
  const builtCrafts = built.filter((upgrade) => upgradeDiscipline(upgrade) === "craft");

  if (isMobile) {
    return `
      <div class="tab-mobile-flow tab-mobile-flow-craft">
        ${surfaceCard({
          title: "Base builds",
          meta: `${readyBuilds.length} ready / ${blockedBuilds.length} blocked`,
          body: `
            <details class="mobile-accordion" open>
              <summary>Open build queue</summary>
              <div class="mobile-accordion-body">
                ${renderUpgradeQueue(state, "Shelter works", readyBuilds, blockedBuilds, "No base structures are open yet.")}
              </div>
            </details>
          `,
        })}
        ${surfaceCard({
          title: "Fieldcraft",
          meta: `${readyCrafts.length} ready / ${blockedCrafts.length} blocked`,
          body: `
            <details class="mobile-accordion" open>
              <summary>Open fieldcraft queue</summary>
              <div class="mobile-accordion-body">
                ${renderUpgradeQueue(state, "Tools and fieldwork", readyCrafts, blockedCrafts, "No fieldcraft jobs are open yet.")}
              </div>
            </details>
          `,
        })}
        ${surfaceCard({
          title: "Systems online",
          meta: `${built.length} total`,
          body: built.length
            ? `
              <details class="mobile-accordion">
                <summary>Show installed systems</summary>
                <div class="detail-list">${built.map((upgrade) => `
                  <div class="list-block compact-block">
                    <div class="surface-head">
                      <h4>${upgrade.name}</h4>
                      <span class="tag">live</span>
                    </div>
                    <div class="chip-row">${tagList([upgradeDisciplineLabel(upgrade), "installed"])}</div>
                  </div>
                `).join("")}</div>
              </details>
            `
            : `<p class="empty-state">No installed systems yet.</p>`,
        })}
      </div>
    `;
  }

  return `
    <div class="tab-grid">
      ${surfaceCard({
        title: "Build + craft board",
        meta: `${available.length} open`,
        className: "span-8",
        body: available.length
          ? `
            <div class="queue-board">
              ${renderUpgradeQueue(state, "Base builds", readyBuilds, blockedBuilds, "No base structures are open yet.")}
              ${renderUpgradeQueue(state, "Fieldcraft", readyCrafts, blockedCrafts, "No fieldcraft jobs are open yet.")}
            </div>
          `
          : `<p class="empty-state">No fresh plans yet. Search deeper.</p>`,
      })}
      ${surfaceCard({
        title: "Systems online",
        meta: `${built.length} total`,
        className: "span-4",
        body: built.length
          ? `
            <div class="detail-list">
              <div class="list-block compact-block">
                <div class="surface-head">
                  <h4>Base builds</h4>
                  <span class="tag">${builtBuilds.length}</span>
                </div>
                ${builtBuilds.length
                  ? `<div class="chip-row">${tagList(builtBuilds.map((upgrade) => upgrade.name))}</div>`
                  : `<p class="empty-state">No base systems live.</p>`}
              </div>
              <div class="list-block compact-block">
                <div class="surface-head">
                  <h4>Fieldcraft</h4>
                  <span class="tag">${builtCrafts.length}</span>
                </div>
                ${builtCrafts.length
                  ? `<div class="chip-row">${tagList(builtCrafts.map((upgrade) => upgrade.name))}</div>`
                  : `<p class="empty-state">No crafted tools online.</p>`}
              </div>
            </div>
          `
          : `<p class="empty-state">You still live hand-to-mouth.</p>`,
      })}
      ${surfaceCard({
        title: "Rarity lanes",
        meta: "loot by source",
        className: "span-12",
        body: lootBandMarkup(state),
      })}
    </div>
  `;
}

export function renderInventoryTab(state, derived, _isMobile = false) {
  const items = Object.entries(state.inventory)
    .filter(([itemId, amount]) => amount > 0 && ITEMS[itemId])
    .sort((left, right) => {
      const leftItem = ITEMS[left[0]];
      const rightItem = ITEMS[right[0]];
      return `${leftItem.type}-${leftItem.name}`.localeCompare(`${rightItem.type}-${rightItem.name}`);
    });

  const weaponName = state.equipped.weapon ? ITEMS[state.equipped.weapon]?.name : "Bare hands";
  const armorName = state.equipped.armor ? ITEMS[state.equipped.armor]?.name : "Street clothes";
  const gearItems = items.filter(([itemId]) => ["weapon", "armor"].includes(ITEMS[itemId].type));
  const fieldItems = items.filter(([itemId]) => ITEMS[itemId].type === "consumable");
  const oddItems = items.filter(([itemId]) => !["weapon", "armor", "consumable"].includes(ITEMS[itemId].type));
  const resourceGroups = ["core", "common", "uncommon", "rare", "social", "mythic"]
    .map((tier) => {
      const entries = state.discoveredResources
        .filter((resourceId) => RESOURCE_DEFS[resourceId]?.tier === tier)
        .sort((left, right) => RESOURCE_ORDER.indexOf(left) - RESOURCE_ORDER.indexOf(right));
      if (!entries.length) {
        return "";
      }
      return `
        <div class="list-block">
          <div class="surface-head">
            <h4>${tier}</h4>
            <span class="tag">${entries.length}</span>
          </div>
          <div class="chip-row">
            ${tagList(entries.map((resourceId) => `${resourceLabel(resourceId)} ${state.resources[resourceId]}`))}
          </div>
        </div>
      `;
    })
    .filter(Boolean)
    .join("");

  return `
    <div class="tab-grid tab-grid-tight">
      ${surfaceCard({
        title: "Stores by tier",
        meta: `${state.discoveredResources.length} tracked`,
        className: "span-12",
        body: resourceGroups
          ? `<div class="resource-tier-grid">${resourceGroups}</div>`
          : `<p class="empty-state">Only scrap has a name so far.</p>`,
      })}
      ${surfaceCard({
        title: "Field loadout",
        meta: `attack ${derived.attack} / defense ${derived.defense}`,
        className: "span-4",
        body: `
          <div class="fact-grid">
            <div class="fact"><span>Weapon</span><strong>${weaponName}</strong></div>
            <div class="fact"><span>Armor</span><strong>${armorName}</strong></div>
            <div class="fact"><span>Items</span><strong>${items.length}</strong></div>
            <div class="fact"><span>Ammo</span><strong>${state.resources.ammo}</strong></div>
          </div>
        `,
      })}
      ${surfaceCard({
        title: "Gear locker",
        meta: `${gearItems.length} ready`,
        className: "span-4",
        body: gearItems.length
          ? `<div class="inventory-card-grid">${gearItems.map(([itemId, amount]) => renderInventoryItemCard(itemId, amount)).join("")}</div>`
          : `<p class="empty-state">No dedicated weapons or armor stored yet.</p>`,
      })}
      ${surfaceCard({
        title: "Field kit",
        meta: `${fieldItems.length} usable`,
        className: "span-4",
        body: fieldItems.length
          ? `<div class="inventory-card-grid">${fieldItems.map(([itemId, amount]) => renderInventoryItemCard(itemId, amount)).join("")}</div>`
          : `<p class="empty-state">No consumables packed right now.</p>`,
      })}
      ${surfaceCard({
        title: "Odd salvage",
        meta: `${oddItems.length} pieces`,
        className: "span-12",
        body: oddItems.length
          ? `<div class="inventory-card-grid">${oddItems.map(([itemId, amount]) => renderInventoryItemCard(itemId, amount)).join("")}</div>`
          : `<p class="empty-state">Nothing unusual is taking up space yet.</p>`,
      })}
    </div>
  `;
}

export function renderNightPlanner(state) {
  const forecast = getNightForecast(state);
  const report = state.night.lastReport;
  const planButtons = Object.values(NIGHT_PLANS).map((plan) => actionButton({
    action: "set-night-plan",
    label: plan.label,
    meta: plan.description,
    disabled: state.night.plan === plan.id,
    data: { plan: plan.id },
    variant: `compact ${state.night.plan === plan.id ? "primary" : ""}`,
  }));

  return `
    <div class="detail-list">
      <div class="fact-grid">
        <div class="fact"><span>Forecast</span><strong>${forecast.severity}</strong></div>
        <div class="fact"><span>Night in</span><strong>${forecast.hoursUntilNight}h</strong></div>
        <div class="fact"><span>Infected</span><strong>${Math.round(forecast.infectedChance * 100)}%</strong></div>
        <div class="fact"><span>Raid</span><strong>${Math.round(forecast.raidChance * 100)}%</strong></div>
        <div class="fact"><span>Breach</span><strong>${Math.round(forecast.breachChance * 100)}%</strong></div>
        <div class="fact"><span>Plan</span><strong>${forecast.plan.label}</strong></div>
      </div>
      <div class="action-stack">${planButtons.join("")}</div>
      ${report ? `
        <div class="list-block compact-block">
          <div class="surface-head">
            <h4>Last night</h4>
            <span class="tag">${report.eventType}</span>
          </div>
          <p class="note">${report.summary}</p>
          ${report.damagedStructures?.length ? `<div class="chip-row">${tagList(report.damagedStructures.map((target) => structureByKey(target).label || target))}</div>` : ""}
        </div>
      ` : `<p class="empty-state">No night report yet.</p>`}
    </div>
  `;
}

export function renderExpeditionPlanner(state) {
  const selectedZoneId = state.expedition.selectedZone || null;
  const preview = selectedZoneId ? getExpeditionPreview(state, selectedZoneId, state.expedition.approach) : null;

  if (!preview) {
    return `<p class="empty-state">Prepare a zone route to choose an approach and launch clean.</p>`;
  }

  return `
    <div class="detail-list">
      <div class="list-block compact-block">
        <div class="surface-head">
          <div>
            <span class="note-label">Prepared zone</span>
            <h4>${preview.zone.name}</h4>
          </div>
          <span class="tag">${preview.approach.label}</span>
        </div>
        <p class="note">${preview.objective.label} objective via ${preview.approach.label.toLowerCase()} route.</p>
        <div class="fact-grid">
          <div class="fact"><span>Travel</span><strong>${preview.hours}h</strong></div>
          <div class="fact"><span>Encounter</span><strong>${Math.round(preview.encounterChance * 100)}%</strong></div>
          <div class="fact"><span>Loot bias</span><strong>${preview.lootBonus >= 0 ? "+" : ""}${Math.round(preview.lootBonus * 100)}%</strong></div>
          <div class="fact"><span>Noise</span><strong>${preview.noise.toFixed(1)}</strong></div>
        </div>
        <div class="chip-row">${tagList([
          preview.objective.short,
          ...(Object.keys(preview.cost).length ? [formatCost(preview.cost)] : ["No prep cost"]),
        ])}</div>
      </div>
      <div class="approach-grid objective-grid">
        ${EXPEDITION_OBJECTIVES.map((objective) => {
          const objectivePreview = getExpeditionPreview(state, selectedZoneId, state.expedition.approach, objective.id);
          return `
            <div class="list-block compact-block ${state.expedition.objective === objective.id ? "is-selected-plan" : ""}">
              <div class="surface-head">
                <h4>${objective.label}</h4>
                <span class="tag">${objective.short}</span>
              </div>
              <div class="compact-fact-grid">
                <div><span>Travel</span><strong>${objectivePreview.hours}h</strong></div>
                <div><span>Encounter</span><strong>${Math.round(objectivePreview.encounterChance * 100)}%</strong></div>
                <div><span>Noise</span><strong>${objectivePreview.noise.toFixed(1)}</strong></div>
                <div><span>Bias</span><strong>${objective.tags[0]}</strong></div>
              </div>
              <div class="chip-row">${tagList(objective.tags)}</div>
              ${actionButton({
                action: "set-objective",
                label: objective.label,
                meta: "objective",
                disabled: state.expedition.objective === objective.id,
                data: { objective: objective.id },
                variant: "compact",
              })}
            </div>
          `;
        }).join("")}
      </div>
      <div class="approach-grid">
        ${EXPEDITION_APPROACHES.map((approach) => {
          const approachPreview = getExpeditionPreview(state, selectedZoneId, approach.id);
          return `
            <div class="list-block compact-block ${state.expedition.approach === approach.id ? "is-selected-plan" : ""}">
              <div class="surface-head">
                <h4>${approach.label}</h4>
                <span class="tag">${approach.short}</span>
              </div>
              <div class="compact-fact-grid">
                <div><span>Travel</span><strong>${approachPreview.hours}h</strong></div>
                <div><span>Encounter</span><strong>${Math.round(approachPreview.encounterChance * 100)}%</strong></div>
                <div><span>Noise</span><strong>${approachPreview.noise.toFixed(1)}</strong></div>
                <div><span>Prep</span><strong>${Object.keys(approach.cost).length ? "supply" : "none"}</strong></div>
              </div>
              <div class="chip-row">${tagList([
                approach.short,
                Object.keys(approach.cost).length ? formatCost(approach.cost) : "no extra cost",
              ])}</div>
              ${actionButton({
                action: "set-approach",
                label: approach.label,
                meta: "route mode",
                disabled: state.expedition.approach === approach.id,
                data: { approach: approach.id },
                variant: "compact",
              })}
            </div>
          `;
        }).join("")}
      </div>
      ${actionButton({
        action: "launch-prepared",
        label: `Launch ${preview.zone.name}`,
        meta: preview.canLaunch ? "prepared route" : `need ${formatCost(preview.cost)}`,
        disabled: !preview.canLaunch || Boolean(state.combat),
        variant: "primary",
      })}
    </div>
  `;
}

export function renderShelterTab(state, derived, isMobile = false) {
  const upkeep = getShelterUpkeep(state);
  const actions = [
    actionButton({
      action: "eat-ration",
      label: "Eat 1 food",
      meta: "Reset your hunger clock and steady yourself.",
      disabled: state.resources.food < 1,
    }),
    actionButton({
      action: "drink-water",
      label: "Drink 1 drinkable water",
      meta: "Reset thirst and steady yourself.",
      disabled: state.resources.water < 1,
    }),
    actionButton({
      action: "patch-barricade",
      label: "Patch barricade line",
      meta: "6 scrap / 2 wood / steadier fence",
      disabled: state.resources.scrap < 6 || state.resources.wood < 2,
    }),
  ];

  if (state.upgrades.includes("ammo_press")) {
    actions.push(actionButton({
      action: "craft-ammo",
      label: "Press ammo",
      meta: "Spend parts, scrap, and chemicals for 5 rounds.",
      disabled: state.resources.parts < 1 || state.resources.scrap < 1 || state.resources.chemicals < 1,
    }));
  }

  const passive = Object.entries(derived.passive)
    .filter(([, rate]) => rate > 0)
    .map(([resourceId, rate]) => `${resourceLabel(resourceId)} +${rate.toFixed(2)}/s`);
  const activeEdges = [
    derived.salvageYieldBonus > 0 ? `salvage +${Math.round(derived.salvageYieldBonus * 100)}%` : "",
    derived.forageYieldBonus > 0 ? `forage +${Math.round(derived.forageYieldBonus * 100)}%` : "",
    derived.signalGain > 0 ? `signal +${derived.signalGain.toFixed(2)}` : "",
    derived.nightMitigation > 0 ? `night shield ${derived.nightMitigation.toFixed(1)}` : "",
  ].filter(Boolean);
  const perimeter = getShelterMapPerimeter(state);
  const liveStructures = getBuiltShelterStructures(state).map((structure) => structure.label);
  if (perimeter) {
    liveStructures.unshift(perimeter.label);
  }
  const liveAnnexes = SHELTER_MAP_ANNEXES
    .filter((entry) => state.upgrades.includes(entry.upgrade))
    .map((entry) => entry.label);
  const mapGuidance = isMobile
    ? "Use the Map mode above for structure checks and repairs."
    : "Use <strong>Shelter Map</strong> for damage and structure checks.";

  const opsMarkup = `
    <div class="tab-grid tab-grid-tight">
      ${surfaceCard({
        title: "Shelter state",
        meta: `defense ${derived.defense}`,
        className: "span-4",
        body: `
          <div class="fact-grid">
            <div class="fact"><span>Warmth</span><strong>${state.shelter.warmth.toFixed(1)}</strong></div>
            <div class="fact"><span>Threat</span><strong>${state.shelter.threat.toFixed(1)}</strong></div>
            <div class="fact"><span>Noise</span><strong>${state.shelter.noise.toFixed(1)}</strong></div>
            <div class="fact"><span>Defense</span><strong>${derived.defense}</strong></div>
            <div class="fact"><span>Morale</span><strong>${state.resources.morale}</strong></div>
            <div class="fact"><span>Food</span><strong>${state.resources.food}</strong></div>
            <div class="fact"><span>Water</span><strong>${state.resources.water}</strong></div>
            <div class="fact"><span>Wood</span><strong>${state.resources.wood}</strong></div>
          </div>
        `,
      })}
      ${surfaceCard({
        title: "Shelter flow",
        meta: `${upkeep.crew} crew / live upkeep`,
        className: "span-4",
        body: `
          <div class="fact-grid">
            <div class="fact"><span>Meal cycle</span><strong>${upkeep.mealCost} / ${upkeep.mealHours}h</strong></div>
            <div class="fact"><span>Water cycle</span><strong>${upkeep.waterCost} / ${upkeep.waterHours}h</strong></div>
            <div class="fact"><span>Meal due</span><strong>${upkeep.mealHoursLeft}h</strong></div>
            <div class="fact"><span>Water due</span><strong>${upkeep.waterHoursLeft}h</strong></div>
            <div class="fact"><span>Crew</span><strong>${upkeep.crew}</strong></div>
            <div class="fact"><span>Beds</span><strong>${derived.survivorCap}</strong></div>
          </div>
          <div class="chip-row">${tagList([
            `${upkeep.mealCost} food every ${upkeep.mealHours}h`,
            `${upkeep.waterCost} water every ${upkeep.waterHours}h`,
          ])}</div>
        `,
      })}
      ${surfaceCard({
        title: "Night line",
        meta: `${getNightForecast(state).severity}`,
        className: "span-4",
        body: renderNightPlanner(state),
      })}
      ${surfaceCard({
        title: "Survival actions",
        meta: "manual control",
        className: "span-4",
        body: `<div class="action-stack">${actions.join("")}</div>`,
      })}
      ${surfaceCard({
        title: "Built shelter systems",
        meta: `${liveStructures.length + liveAnnexes.length} live`,
        className: "span-4",
        body: `
          <div class="detail-list">
            <div class="list-block compact-block">
              <div class="surface-head">
                <h4>Structures</h4>
                <span class="tag">${liveStructures.length}</span>
              </div>
              ${liveStructures.length ? `<div class="chip-row">${tagList(liveStructures)}</div>` : `<p class="empty-state">Still mostly one room.</p>`}
            </div>
            <div class="list-block compact-block">
              <div class="surface-head">
                <h4>Annexes</h4>
                <span class="tag">${liveAnnexes.length}</span>
              </div>
              ${liveAnnexes.length ? `<div class="chip-row">${tagList(liveAnnexes)}</div>` : `<p class="empty-state">No annexes attached.</p>`}
            </div>
          </div>
        `,
      })}
      ${surfaceCard({
        title: "Support edges",
        meta: activeEdges.length ? `${activeEdges.length} active` : "manual only",
        className: "span-4",
        body: `
          ${activeEdges.length ? `<div class="chip-row">${tagList(activeEdges)}</div>` : `<p class="empty-state">Most gains still come from decisions, not automation.</p>`}
          ${passive.length ? `<div class="chip-row">${tagList(passive)}</div>` : ""}
        `,
      })}
      ${surfaceCard({
        title: "Pressure notes",
        meta: `${getOutpostStage(liveStructures.length)}`,
        className: "span-4",
        body: `
          <div class="detail-list">
            <div class="list-block compact-block">
              <p class="note">Warmth falls. Threat rises. Noise paints a target on the fence. Crew now eats and drinks on a timed cycle.</p>
            </div>
            <div class="list-block compact-block">
              <p class="note">${mapGuidance}</p>
            </div>
          </div>
        `,
      })}
    </div>
  `;

  if (isMobile) {
    return `
      <div class="tab-mobile-flow tab-mobile-flow-shelter">
        <div class="mobile-segmented-control">
          <button
            type="button"
            class="mobile-segment ${state.ui.mobileShelterMode !== "map" ? "is-active" : ""}"
            data-action="set-mobile-shelter-mode"
            data-mode="ops"
          >
            Ops
          </button>
          <button
            type="button"
            class="mobile-segment ${state.ui.mobileShelterMode === "map" ? "is-active" : ""}"
            data-action="set-mobile-shelter-mode"
            data-mode="map"
          >
            Map
          </button>
        </div>
        ${state.ui.mobileShelterMode === "map"
          ? renderShelterMapMobilePanel(state)
          : opsMarkup}
      </div>
    `;
  }

  return opsMarkup;
}

export function renderMapTab(state, _isMobile = false) {
  const zones = ZONES.filter((zone) => state.unlockedZones.includes(zone.id));
  return `
    <div class="tab-grid">
      ${surfaceCard({
        title: "Route planner",
        meta: state.expedition.selectedZone ? "prepared" : "idle",
        className: "span-12 route-command",
        body: renderExpeditionPlanner(state),
      })}
      ${zones.length ? zones.map((zone) => surfaceCard({
        title: zone.name,
        meta: state.expedition.selectedZone === zone.id ? `selected / risk ${zone.risk}` : `risk ${zone.risk}`,
        className: `span-4 zone-card ${state.expedition.selectedZone === zone.id ? "is-selected-route" : ""}`,
        body: `
          <p class="note">${zone.description}</p>
          <div class="fact-grid zone-fact-grid">
            <div class="fact"><span>Travel</span><strong>${zone.hours}h</strong></div>
            <div class="fact"><span>Encounter</span><strong>${Math.round(zone.encounterChance * 100)}%</strong></div>
          </div>
          <div class="chip-row">
            ${tagList([
              state.visitedZones.includes(zone.id) ? "visited" : "new route",
              zone.risk,
            ])}
          </div>
          <div class="chip-row">
            ${tagList(Object.entries(zone.loot)
              .filter(([, range]) => range[1] > 0)
              .map(([resourceId, range]) => `${resourceLabel(resourceId)} ${range[0]}-${range[1]}`))}
          </div>
            ${zone.itemPool?.length ? `<div class="chip-row">${tagList(zone.itemPool.map((itemId) => itemLabel(itemId)))}</div>` : ""}
          ${actionButton({
            action: "prepare-zone",
            label: `Prepare ${zone.name}`,
            meta: state.expedition.selectedZone === zone.id ? "selected for planner" : "route planning",
            disabled: Boolean(state.combat),
            data: { zone: zone.id },
          })}
        `,
      })).join("") : surfaceCard({
        title: "Map board",
        meta: "blank",
        className: "span-8",
        body: `<p class="empty-state">No routes marked yet.</p>`,
      })}
    </div>
  `;
}

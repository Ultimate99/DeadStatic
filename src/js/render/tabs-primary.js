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
  formatMaterials,
  getAvailableScavengeSources,
  getActiveWorkJob,
  getExpeditionPreview,
  getNightForecast,
  getShelterSystems,
  getShelterUpkeep,
  getVisibleUpgrades,
  hasRequiredTools,
  hasMaterials,
  hasItem,
  missingRequiredTools,
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
  tooltipAttrs,
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

function upgradeDiscipline(upgrade) {
  if (upgrade.category === "build" || BUILD_UPGRADE_IDS.has(upgrade.id)) {
    return "build";
  }
  return "craft";
}

function upgradeDisciplineLabel(upgrade) {
  if (upgrade.category === "tool") return "tool";
  if (upgrade.category === "weapon") return "weapon";
  if (upgrade.category === "armor") return "armor";
  if (upgrade.category === "consumable") return "consumable";
  return upgradeDiscipline(upgrade) === "build" ? "base build" : "fieldcraft";
}

function upgradeTierLabel(upgrade) {
  return (upgrade.tier || "field").replace(/_/g, " ");
}

function upgradeToolLabel(upgrade) {
  if (!upgrade.requiredTools?.length) {
    return "none";
  }
  return upgrade.requiredTools.map((itemId) => ITEMS[itemId]?.name || itemId).join(" + ");
}

function upgradeResultLabel(upgrade) {
  if (upgrade.resultLabel) {
    return upgrade.resultLabel;
  }
  if (upgrade.effects?.grantItems) {
    const [itemId] = Object.keys(upgrade.effects.grantItems);
    return ITEMS[itemId]?.name || itemId;
  }
  if (upgrade.effects?.unlockZones?.length) {
    const zone = ZONES.find((entry) => entry.id === upgrade.effects.unlockZones[0]);
    return zone?.name || upgrade.effects.unlockZones[0];
  }
  if (upgrade.effects?.unlockSections?.length) {
    return TAB_NAME_BY_SECTION[upgrade.effects.unlockSections[0]] || upgrade.effects.unlockSections[0];
  }
  return upgrade.name;
}

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

function upgradeEffectChips(upgrade) {
  const effects = upgrade.effects || {};
  const chips = [];

  if (effects.attack) chips.push(`atk +${effects.attack}`);
  if (effects.defense) chips.push(`def +${effects.defense}`);
  if (effects.searchBonusRolls) chips.push(`loot rolls +${effects.searchBonusRolls}`);
  if (effects.searchFoodChance) chips.push(`food search +${formatPercent(effects.searchFoodChance)}`);
  if (effects.searchPartChance) chips.push(`parts +${formatPercent(effects.searchPartChance)}`);
  if (effects.conditionRegen) chips.push(`regen +${effects.conditionRegen}/h`);
  if (effects.survivorCap) chips.push(`crew cap +${effects.survivorCap}`);
  if (effects.expeditionLootBonus) chips.push(`expedition loot +${formatPercent(effects.expeditionLootBonus)}`);
  if (effects.scoutBonus) chips.push(`route safety +${formatPercent(effects.scoutBonus)}`);
  if (effects.radioDepth) chips.push(`radio depth +${effects.radioDepth}`);
  if (effects.rareLootBonus) chips.push(`rare loot +${formatPercent(effects.rareLootBonus)}`);
  if (effects.salvageYieldBonus) chips.push(`salvage +${formatPercent(effects.salvageYieldBonus)}`);
  if (effects.forageYieldBonus) chips.push(`forage +${formatPercent(effects.forageYieldBonus)}`);
  if (effects.signalGain) chips.push(`signal +${formatPercent(effects.signalGain)}`);
  if (effects.anomalyGain) chips.push(`anomaly +${formatPercent(effects.anomalyGain)}`);
  if (effects.nightMitigation) chips.push(`night resist +${formatPercent(effects.nightMitigation)}`);
  if (effects.power) chips.push(`power +${effects.power}`);
  if (effects.coverage) chips.push(`coverage +${effects.coverage}`);
  if (effects.repairPower) chips.push(`repairs +${effects.repairPower}`);
  if (effects.maintenance) chips.push(`maintenance +${effects.maintenance}`);
  if (effects.foodSecurity) chips.push(`food security +${effects.foodSecurity}`);
  if (effects.waterSecurity) chips.push(`water security +${effects.waterSecurity}`);
  if (effects.siegeMitigation) chips.push(`siege resist +${formatPercent(effects.siegeMitigation)}`);
  if (effects.burnCondition) chips.push(`burn +${effects.burnCondition} cond`);
  if (effects.weaponSlot) chips.push("weapon slot");
  if (effects.armorSlot) chips.push("armor slot");

  if (effects.passive) {
    Object.entries(effects.passive).forEach(([resourceId, amount]) => {
      chips.push(`${resourceLabel(resourceId)} +${amount}/h`);
    });
  }
  if (effects.grantItems) {
    Object.entries(effects.grantItems).forEach(([itemId, amount]) => {
      chips.push(`grants ${itemLabel(itemId)} x${amount}`);
    });
  }
  if (effects.unlockSections) {
    effects.unlockSections.forEach((sectionId) => {
      chips.push(`opens ${TAB_NAME_BY_SECTION[sectionId] || sectionId}`);
    });
  }
  if (effects.unlockZones) {
    effects.unlockZones.forEach((zoneId) => {
      const zone = ZONES.find((entry) => entry.id === zoneId);
      chips.push(`route ${zone?.name || zoneId}`);
    });
  }

  return chips;
}

const TAB_NAME_BY_SECTION = {
  shelter: "Shelter",
  inventory: "Inventory",
  map: "Map",
  survivors: "Crew",
  radio: "Radio",
  trader: "Trade",
  factions: "Factions",
};

function getUpgradeMissingNotes(state, upgrade) {
  const missing = [];
  const activeJob = getActiveWorkJob(state);

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

  missingRequiredTools(state, upgrade.requiredTools || []).forEach((itemId) => {
    missing.push(`Need ${itemLabel(itemId)}`);
  });

  if (activeJob && activeJob.recipeId !== upgrade.id) {
    missing.push(`Work slot busy: ${activeJob.label}`);
  }

  return missing;
}

function upgradeTooltipText(state, upgrade, built, ready, missing) {
  const lines = [upgrade.name];

  lines.push(`Tier: ${upgradeTierLabel(upgrade)}`);
  lines.push(`Time: ${upgrade.hours || 1}h`);
  lines.push(`Required tool: ${upgradeToolLabel(upgrade)}`);
  lines.push(`Result: ${upgradeResultLabel(upgrade)}`);

  const effectChips = upgradeEffectChips(upgrade);
  if (effectChips.length) {
    lines.push(`Effects: ${effectChips.join(" | ")}`);
  }

  if (upgrade.cost && Object.keys(upgrade.cost).length) {
    lines.push(`Cost: ${formatCost(upgrade.cost)}`);
  }
  if (upgrade.materials && Object.keys(upgrade.materials).length) {
    lines.push(`Materials: ${formatMaterials(upgrade.materials)}`);
  }

  if (upgrade.description) {
    lines.push(upgrade.description);
  }

  if (missing.length) {
    lines.push(`Missing: ${missing.join(" | ")}`);
  } else if (!built && ready) {
    lines.push("Ready to build.");
  }

  if (built) {
    lines.push("Installed.");
  }

  return lines.join(" • ");
}

function renderWorkInProgress(state) {
  const job = getActiveWorkJob(state);
  if (!job) {
    return `
      <div class="list-block compact-block">
        <div class="surface-head">
          <h4>Queue open</h4>
          <span class="tag">idle</span>
        </div>
        <p class="note">No active build or craft job. Start one queue item, then let time pass through scavenging, routes, radio, or the night.</p>
        <div class="chip-row">${tagList(["one shared slot", "cost paid upfront", "auto-completes"])}</div>
      </div>
    `;
  }

  return `
    <div class="list-block compact-block">
      <div class="surface-head">
        <h4>${job.label}</h4>
        <span class="tag">${job.kind}</span>
      </div>
      <div class="fact-grid">
        <div class="fact"><span>Tier</span><strong>${(job.tier || "field").replace(/_/g, " ")}</strong></div>
        <div class="fact"><span>Total</span><strong>${job.hoursTotal}h</strong></div>
        <div class="fact"><span>Left</span><strong>${job.hoursRemaining}h</strong></div>
        <div class="fact"><span>Due</span><strong>${job.completesAt}</strong></div>
      </div>
      <div class="chip-row">${tagList([
        job.kind === "build" ? "base work" : "fieldcraft",
        ...(job.requiredTools?.length ? job.requiredTools.map((itemId) => itemLabel(itemId)) : ["no tool gate"]),
      ])}</div>
    </div>
  `;
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
            <span class="note-label">Blocked</span>
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

  if (state.upgrades.includes("shelter_stash") || state.upgrades.includes("food_search")) {
    utilityButtons.push(actionButton({
      action: "forage-food",
      label: "Forage food",
      meta: "1h / modest food run / use during queue time",
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
  const activeJob = getActiveWorkJob(state);
  const ready = !activeJob && canAfford(state, upgrade.cost) && hasMaterials(state, upgrade.materials) && hasRequiredTools(state, upgrade.requiredTools);
  const missing = getUpgradeMissingNotes(state, upgrade);
  const tooltip = upgradeTooltipText(state, upgrade, built, ready, missing);
  const costLine = Object.keys(upgrade.cost || {}).length ? formatCost(upgrade.cost) : "No cost";
  const detailTags = [
    `time ${upgrade.hours || 1}h`,
    `tool ${upgradeToolLabel(upgrade)}`,
    `result ${upgradeResultLabel(upgrade)}`,
    `tier ${upgradeTierLabel(upgrade)}`,
  ];

  return `
    <div class="list-block upgrade-card has-tooltip ${built ? "is-built-upgrade" : ready ? "is-ready-upgrade" : "is-blocked-upgrade"}"${tooltipAttrs(tooltip)}>
      <div class="surface-head">
        <h4>${upgrade.name}</h4>
        <span class="tag">${built ? "built" : ready ? "ready" : "blocked"}</span>
      </div>
      <p class="upgrade-costline">${costLine}</p>
      <div class="chip-row">${tagList(detailTags)}</div>
      ${built ? "" : actionButton({
        action: "start-work-job",
        label: `${upgrade.verb || "Start"} ${upgrade.name}`,
        meta: ready ? `${upgrade.hours || 1}h queue` : missing[0] || "Need salvage or tools",
        disabled: !ready,
        data: { upgrade: upgrade.id },
        title: tooltip,
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
  const activeJob = getActiveWorkJob(state);
  const built = state.upgrades
    .map((upgradeId) => visibleUpgrades.find((upgrade) => upgrade.id === upgradeId))
    .filter(Boolean);
  const builtBuilds = built.filter((upgrade) => (upgrade.category || upgradeDiscipline(upgrade)) === "build");
  const builtCrafts = built.filter((upgrade) => (upgrade.category || upgradeDiscipline(upgrade)) !== "build");
  const categories = [
    { id: "build", title: "Base Builds", empty: "No base structure jobs are open yet.", className: "span-6" },
    { id: "tool", title: "Tools", empty: "No tool jobs are open yet.", className: "span-6" },
    { id: "weapon", title: "Weapons", empty: "No weapon jobs are open yet.", className: "span-4" },
    { id: "armor", title: "Armor", empty: "No armor jobs are open yet.", className: "span-4" },
    { id: "consumable", title: "Consumables", empty: "No consumable jobs are open yet.", className: "span-4" },
  ];
  const upgradesForCategory = (categoryId) => available.filter((upgrade) => {
    const category = upgrade.category || (upgradeDiscipline(upgrade) === "build" ? "build" : "tool");
    return category === categoryId;
  });
  const renderCategoryBody = (category) => {
    const upgrades = upgradesForCategory(category.id);
    const ready = upgrades.filter((upgrade) => !getUpgradeMissingNotes(state, upgrade).length);
    const blocked = upgrades.filter((upgrade) => !ready.includes(upgrade));
    return renderUpgradeQueue(state, category.title, ready, blocked, category.empty);
  };

  if (isMobile) {
    return `
      <div class="tab-mobile-flow tab-mobile-flow-craft">
        ${surfaceCard({
          title: "Work in Progress",
          meta: activeJob ? `${activeJob.hoursRemaining}h left` : "idle",
          body: renderWorkInProgress(state),
        })}
        ${categories.map((category) => {
          const upgrades = upgradesForCategory(category.id);
          const ready = upgrades.filter((upgrade) => !getUpgradeMissingNotes(state, upgrade).length);
          const blocked = upgrades.filter((upgrade) => !ready.includes(upgrade));
          return surfaceCard({
            title: category.title,
            meta: `${ready.length} ready / ${blocked.length} blocked`,
            body: `
              <details class="mobile-accordion"${category.id === "build" || category.id === "tool" ? " open" : ""}>
                <summary>Open ${category.title.toLowerCase()}</summary>
                <div class="mobile-accordion-body">
                  ${renderCategoryBody(category)}
                </div>
              </details>
            `,
          });
        }).join("")}
        ${surfaceCard({
          title: "Systems online",
          meta: `${built.length} total`,
          body: `
            <details class="mobile-accordion">
              <summary>Show installed systems</summary>
              <div class="detail-list">${built.length ? built.map((upgrade) => `
                <div class="list-block compact-block">
                  <div class="surface-head">
                    <h4>${upgrade.name}</h4>
                    <span class="tag">live</span>
                  </div>
                  <div class="chip-row">${tagList([upgradeDisciplineLabel(upgrade), `tier ${upgradeTierLabel(upgrade)}`, `result ${upgradeResultLabel(upgrade)}`])}</div>
                </div>
              `).join("") : `<p class="empty-state">No installed systems yet.</p>`}</div>
            </details>
          `,
        })}
      </div>
    `;
  }

  return `
    <div class="tab-grid">
      ${surfaceCard({
        title: "Work in Progress",
        meta: activeJob ? `${activeJob.hoursRemaining}h left` : "queue idle",
        className: "span-12",
        body: renderWorkInProgress(state),
      })}
      ${categories.map((category) => {
        const upgrades = upgradesForCategory(category.id);
        const ready = upgrades.filter((upgrade) => !getUpgradeMissingNotes(state, upgrade).length);
        const blocked = upgrades.filter((upgrade) => !ready.includes(upgrade));
        return surfaceCard({
          title: category.title,
          meta: `${ready.length} ready / ${blocked.length} blocked`,
          className: category.className,
          body: renderCategoryBody(category),
        });
      }).join("")}
      ${surfaceCard({
        title: "Systems online",
        meta: `${built.length} total`,
        className: "span-12",
        body: built.length
          ? `
            <div class="queue-board">
              <div class="queue-column">
                <div class="surface-head">
                  <h4>Base Builds</h4>
                  <span class="tag">${builtBuilds.length}</span>
                </div>
                ${builtBuilds.length
                  ? `<div class="chip-row">${tagList(builtBuilds.map((upgrade) => upgrade.name))}</div>`
                  : `<p class="empty-state">No base systems live.</p>`}
              </div>
              <div class="queue-column">
                <div class="surface-head">
                  <h4>Crafted Gear</h4>
                  <span class="tag">${builtCrafts.length}</span>
                </div>
                ${builtCrafts.length
                  ? `<div class="chip-row">${tagList(builtCrafts.map((upgrade) => upgrade.name))}</div>`
                  : `<p class="empty-state">No crafted gear online.</p>`}
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
  const backpackName = state.equipped.backpack ? ITEMS[state.equipped.backpack]?.name : "No pack";
  const gearItems = items.filter(([itemId]) => ["weapon", "armor", "backpack"].includes(ITEMS[itemId].type));
  const fieldItems = items.filter(([itemId]) => ITEMS[itemId].type === "consumable");
  const oddItems = items.filter(([itemId]) => !["weapon", "armor", "backpack", "consumable"].includes(ITEMS[itemId].type));
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
            <div class="fact"><span>Pack</span><strong>${backpackName}</strong></div>
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
  const systems = forecast.systems;
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
        <div class="fact"><span>Siege</span><strong>${Math.round(forecast.siegeChance * 100)}%</strong></div>
        <div class="fact"><span>Infected</span><strong>${Math.round(forecast.infectedChance * 100)}%</strong></div>
        <div class="fact"><span>Raid</span><strong>${Math.round(forecast.raidChance * 100)}%</strong></div>
        <div class="fact"><span>Breach</span><strong>${Math.round(forecast.breachChance * 100)}%</strong></div>
        <div class="fact"><span>Plan</span><strong>${forecast.plan.label}</strong></div>
        <div class="fact"><span>Coverage</span><strong>${systems.coverage.toFixed(1)}</strong></div>
      </div>
      <div class="chip-row">${tagList([
        `power ${systems.powerState}`,
        `maintenance ${systems.maintenanceState}`,
        `siege pressure ${state.night.siegePressure}`,
      ])}</div>
      <div class="action-stack">${planButtons.join("")}</div>
      ${report ? `
        <div class="list-block compact-block">
          <div class="surface-head">
            <h4>Last night</h4>
            <span class="tag">${report.eventType}</span>
          </div>
          <p class="note">${report.summary}</p>
          <div class="fact-grid">
            <div class="fact"><span>Condition hit</span><strong>${report.conditionLoss}</strong></div>
            <div class="fact"><span>Morale swing</span><strong>${report.moraleDelta}</strong></div>
            <div class="fact"><span>Siege pressure</span><strong>${report.siegePressure}</strong></div>
          </div>
          ${report.damagedStructures?.length ? `<div class="chip-row">${tagList(report.damagedStructures.map((target) => structureByKey(target).label || target))}</div>` : ""}
          ${Object.values(report.stolen || {}).some((amount) => amount > 0) ? `<div class="chip-row">${tagList(Object.entries(report.stolen).filter(([, amount]) => amount > 0).map(([resourceId, amount]) => `${resourceLabel(resourceId)} -${amount}`))}</div>` : ""}
          ${report.crewHits?.length ? `<div class="chip-row">${tagList(report.crewHits)}</div>` : ""}
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
        ${state.expedition.lastRouteEvent ? `<div class="chip-row">${tagList([
          `last route event: ${state.expedition.lastRouteEvent.label}`,
          state.expedition.lastRouteEvent.stamp,
        ])}</div>` : ""}
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
              <div class="chip-row">${tagList([
                ...objective.tags,
                objective.traceGain ? "trace gain" : "",
                objective.combatBonus ? "combat edge" : "",
              ].filter(Boolean))}</div>
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
                approach.travelEventChance >= 0.5 ? "more route events" : "lighter route variance",
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
      ${state.expedition.lastOutcome ? `
        <div class="list-block compact-block">
          <div class="surface-head">
            <h4>Last route result</h4>
            <span class="tag">${state.expedition.lastOutcome.stamp}</span>
          </div>
          <div class="chip-row">${tagList([
            state.expedition.lastOutcome.routeEventId ? `event ${state.expedition.lastOutcome.routeEventId}` : "clean route",
            `encounter ${Math.round(state.expedition.lastOutcome.encounterChance * 100)}%`,
            `loot ${state.expedition.lastOutcome.lootBonus >= 0 ? "+" : ""}${Math.round(state.expedition.lastOutcome.lootBonus * 100)}%`,
          ])}</div>
        </div>
      ` : ""}
    </div>
  `;
}

export function renderShelterTab(state, derived, isMobile = false) {
  const upkeep = getShelterUpkeep(state);
  const systems = getShelterSystems(state, derived);
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
    derived.siegeMitigation > 0 ? `siege guard ${derived.siegeMitigation.toFixed(1)}` : "",
    derived.repairPower > 0 ? `repair ${derived.repairPower.toFixed(1)}` : "",
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
            upkeep.maintenanceWood || upkeep.maintenanceParts
              ? `${upkeep.maintenanceWood} wood${upkeep.maintenanceParts ? ` / ${upkeep.maintenanceParts} parts` : ""} every ${upkeep.maintenanceHours}h`
              : "maintenance light",
          ])}</div>
        `,
      })}
      ${surfaceCard({
        title: "Base systems",
        meta: `${systems.maintenanceState} / ${systems.powerState}`,
        className: "span-4",
        body: `
          <div class="fact-grid">
            <div class="fact"><span>Power</span><strong>${systems.powerSupply}/${systems.powerDemand}</strong></div>
            <div class="fact"><span>Coverage</span><strong>${systems.coverage.toFixed(1)}</strong></div>
            <div class="fact"><span>Maintenance</span><strong>${systems.maintenanceSupport.toFixed(1)}</strong></div>
            <div class="fact"><span>Load</span><strong>${systems.maintenanceLoad.toFixed(1)}</strong></div>
            <div class="fact"><span>Food flow</span><strong>${systems.foodFlow >= 0 ? "+" : ""}${systems.foodFlow.toFixed(2)}</strong></div>
            <div class="fact"><span>Water flow</span><strong>${systems.waterFlow >= 0 ? "+" : ""}${systems.waterFlow.toFixed(2)}</strong></div>
          </div>
          <div class="chip-row">${tagList([
            `power ${systems.powerState}`,
            `maintenance ${systems.maintenanceState}`,
            ...systems.adjacency.map((entry) => entry.label),
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
              <p class="note">Warmth falls. Threat rises. Noise paints a target on the fence. Crew eats, drinks, and now drags maintenance behind them if the base outgrows its repair line.</p>
            </div>
            <div class="list-block compact-block">
              <p class="note">${mapGuidance}</p>
            </div>
            <div class="list-block compact-block">
              <p class="note">Power gaps darken signal tools. Weak maintenance means damage snowballs into worse nights.</p>
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
  const preview = state.expedition.selectedZone
    ? getExpeditionPreview(state, state.expedition.selectedZone, state.expedition.approach, state.expedition.objective)
    : null;
  return `
    <div class="tab-grid">
      ${surfaceCard({
        title: "Route planner",
        meta: state.expedition.selectedZone ? "prepared" : "idle",
        className: "span-12 route-command",
        body: renderExpeditionPlanner(state),
      })}
      ${preview ? surfaceCard({
        title: "Route pressure",
        meta: preview.zone.name,
        className: "span-12",
        body: `
          <div class="fact-grid">
            <div class="fact"><span>Objective</span><strong>${preview.objective.label}</strong></div>
            <div class="fact"><span>Approach</span><strong>${preview.approach.label}</strong></div>
            <div class="fact"><span>Travel</span><strong>${preview.hours}h</strong></div>
            <div class="fact"><span>Encounter</span><strong>${Math.round(preview.encounterChance * 100)}%</strong></div>
            <div class="fact"><span>Threat</span><strong>${preview.threat.toFixed(1)}</strong></div>
            <div class="fact"><span>Noise</span><strong>${preview.noise.toFixed(1)}</strong></div>
          </div>
          <div class="chip-row">${tagList([
            ...preview.objective.tags,
            preview.approach.travelEventChance >= 0.5 ? "route likely to swing" : "route more stable",
          ])}</div>
          ${state.expedition.lastRouteEvent ? `<p class="note">Last route event: ${state.expedition.lastRouteEvent.text}</p>` : ""}
        `,
      }) : ""}
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

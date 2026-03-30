import { ITEMS } from "../data.js";
import { UPGRADES_BY_ID } from "../content.js";
import {
  canAfford,
  formatCost,
  formatMaterials,
  getActiveWorkJob,
  getAvailableScavengeSources,
  getDerivedState,
  getShelterSystems,
  getRepairCost,
  getStructureDamage,
  getVisibleUpgrades,
  hasRequiredTools,
  hasMaterials,
  missingRequiredTools,
} from "../engine.js";
import {
  actionButton,
  renderSplitPane,
  resourceLabel,
  sourceRarityCeiling,
  surfaceCard,
  tagList,
} from "./shared.js";

export const SHELTER_MAP_STRUCTURES = [
  { id: "shelter_core", label: "Held Room", short: "HQ", detail: "main room", kind: "core", sprite: "core", col: 6, row: 4, active: (state) => state.unlockedSections.includes("shelter") },
  { id: "shelter_stash", label: "Stash", short: "ST", detail: "secure cache", kind: "core", sprite: "stash", col: 5, row: 5, upgrade: "shelter_stash" },
  { id: "campfire", label: "Campfire", short: "CF", detail: "heat pit", kind: "core", sprite: "campfire", col: 6, row: 6, upgrade: "campfire" },
  { id: "survivor_cots", label: "Cots", short: "CT", detail: "sleep line", kind: "support", sprite: "cots", col: 3, row: 5, upgrade: "survivor_cots" },
  { id: "smokehouse", label: "Smokehouse", short: "SH", detail: "food cure", kind: "support", sprite: "smokehouse", col: 2, row: 7, upgrade: "smokehouse" },
  { id: "rain_collector", label: "Collector", short: "RC", detail: "rain catch", kind: "utility", sprite: "collector", col: 2, row: 3, upgrade: "rain_collector" },
  { id: "water_still", label: "Water Still", short: "WS", detail: "clean flow", kind: "support", sprite: "collector", col: 3, row: 3, upgrade: "water_still" },
  { id: "crafting_bench", label: "Workbench", short: "WB", detail: "build line", kind: "utility", sprite: "bench", col: 8, row: 5, upgrade: "crafting_bench" },
  { id: "ammo_press", label: "Ammo Press", short: "AP", detail: "round press", kind: "utility", sprite: "press", col: 9, row: 5, upgrade: "ammo_press" },
  { id: "repair_rig", label: "Repair Rig", short: "RR", detail: "line repair", kind: "utility", sprite: "press", col: 8, row: 7, upgrade: "repair_rig" },
  { id: "watch_post", label: "Watch Post", short: "WT", detail: "tower eyes", kind: "defense", sprite: "tower", col: 11, row: 2, upgrade: "watch_post" },
  { id: "tripwire_grid", label: "Tripwire Grid", short: "TW", detail: "outer snare", kind: "defense", sprite: "mesh", col: 10, row: 6, upgrade: "tripwire_grid" },
  { id: "flood_lights", label: "Flood Lights", short: "FL", detail: "hard light", kind: "defense", sprite: "beacon", col: 10, row: 3, upgrade: "flood_lights" },
  { id: "radio_rig", label: "Radio", short: "RD", detail: "receiver", kind: "signal", sprite: "radio", col: 6, row: 2, upgrade: "radio_rig" },
  { id: "signal_decoder", label: "Decoder", short: "SD", detail: "signal parse", kind: "signal", sprite: "decoder", col: 7, row: 2, upgrade: "signal_decoder" },
  { id: "battery_bank", label: "Battery Bank", short: "BB", detail: "reserve cells", kind: "signal", sprite: "decoder", col: 8, row: 3, upgrade: "battery_bank" },
  { id: "trader_beacon", label: "Signal Beacon", short: "SB", detail: "tower mark", kind: "signal", sprite: "beacon", col: 8, row: 2, upgrade: "trader_beacon" },
  { id: "faraday_mesh", label: "Mesh Node", short: "FM", detail: "shield anchor", kind: "signal", sprite: "mesh", col: 2, row: 1, upgrade: "faraday_mesh" },
  { id: "relay_tap", label: "Relay Tap", short: "RT", detail: "stolen feed", kind: "signal", sprite: "relay", col: 10, row: 1, upgrade: "relay_tap" },
  { id: "bunker_drill", label: "Drill", short: "BD", detail: "deep breach", kind: "utility", sprite: "drill", col: 9, row: 7, upgrade: "bunker_drill" },
];

export const SHELTER_MAP_ANNEXES = [
  { upgrade: "food_crate", label: "Food Storage", kind: "support", sprite: "crate" },
  { upgrade: "weapon_rack", label: "Weapon Rack", kind: "utility", sprite: "rack" },
  { upgrade: "armor_hooks", label: "Armor Hooks", kind: "utility", sprite: "hooks" },
  { upgrade: "auto_scavenger", label: "Auto Scavenger", kind: "utility", sprite: "crawler" },
  { upgrade: "scout_bike", label: "Scout Bike", kind: "support", sprite: "bike" },
  { upgrade: "carpenter_kit", label: "Carpenter Kit", kind: "utility", sprite: "bench" },
  { upgrade: "hand_drill", label: "Hand Drill", kind: "utility", sprite: "press" },
  { upgrade: "signal_meter", label: "Signal Meter", kind: "signal", sprite: "decoder" },
];

export const SHELTER_MAP_PERIMETER = {
  id: "basic_barricade",
  label: "Perimeter Fence",
  short: "PF",
  kind: "defense",
  sprite: "gate",
};

export function structureKey(structure) {
  return structure.upgrade || structure.id;
}

export function structureByKey(structureId) {
  if (structureId === SHELTER_MAP_PERIMETER.id) {
    return SHELTER_MAP_PERIMETER;
  }
  return SHELTER_MAP_STRUCTURES.find((structure) => structureKey(structure) === structureId) || SHELTER_MAP_STRUCTURES[0];
}

function structureCrewNote(structureId) {
  const map = {
    watch_post: "guards amplify it",
    tripwire_grid: "guards reset and read it",
    flood_lights: "guards and fuel keep it useful",
    radio_rig: "tuners feed it",
    signal_decoder: "tuners sharpen it",
    trader_beacon: "tuners and fuel keep it useful",
    battery_bank: "repair crew keeps it charged",
    smokehouse: "scavengers keep it stocked",
    repair_rig: "medics and builders stabilize it",
    water_still: "support line keeps it fed",
    survivor_cots: "crew capacity anchor",
  };
  return map[structureId] || "self-run once built";
}

function structureSignals(structureId, state, derived) {
  const effects = UPGRADES_BY_ID[structureId]?.effects || {};
  const tags = [];

  if (effects.passive) {
    Object.entries(effects.passive).forEach(([resourceId, amount]) => {
      if (amount > 0) {
        tags.push(`${resourceLabel(resourceId)} +${amount.toFixed(2)}/s`);
      }
    });
  }
  if (effects.defense) {
    tags.push(`DEF +${effects.defense}`);
  }
  if (effects.attack) {
    tags.push(`ATK +${effects.attack}`);
  }
  if (effects.radioDepth) {
    tags.push(`SIG +${effects.radioDepth.toFixed(1)}`);
  }
  if (effects.power) {
    tags.push(`PWR +${effects.power}`);
  }
  if (effects.coverage) {
    tags.push(`CVR +${effects.coverage.toFixed(1)}`);
  }
  if (effects.repairPower) {
    tags.push(`REP +${effects.repairPower}`);
  }
  if (effects.maintenance) {
    tags.push(`MNT +${effects.maintenance}`);
  }
  if (effects.survivorCap) {
    tags.push(`Crew +${effects.survivorCap}`);
  }
  if (!tags.length && structureId === "basic_barricade") {
    tags.push(`DEF +${Math.max(2, Math.floor(derived.defense / 3))}`);
  }
  if (!tags.length && structureId === "shelter_core") {
    tags.push("holds the line");
  }

  return tags;
}

function structureStatus(structureId, state, derived) {
  const systems = getShelterSystems(state, derived);
  const damage = getStructureDamage(state, structureId);
  const built = structureId === "shelter_core" || state.upgrades.includes(structureId);
  const isSignal = ["radio_rig", "signal_decoder", "battery_bank", "trader_beacon", "faraday_mesh", "relay_tap"].includes(structureId);
  const isUtility = ["crafting_bench", "ammo_press", "bunker_drill", "repair_rig"].includes(structureId);
  let powered = built;
  let active = built;

  if (structureId === "campfire") {
    powered = state.shelter.warmth > 0.4;
    active = powered;
  } else if (structureId === "flood_lights") {
    powered = built && systems.powerGap <= 0;
    active = powered && state.survivors.assigned.guard > 0;
  } else if (isSignal) {
    powered = built && (systems.powerGap <= 0 || state.resources.fuel > 0 || state.resources.electronics > 0 || state.story.radioProgress > 0);
    active = powered && (state.story.radioProgress > 0 || state.unlockedSections.includes("radio"));
  } else if (structureId === "watch_post") {
    active = built && (state.survivors.assigned.guard > 0 || derived.defense >= 3);
  } else if (structureId === "tripwire_grid") {
    active = built && (state.survivors.assigned.guard > 0 || state.resources.wire > 0);
  } else if (structureId === "smokehouse") {
    active = built && (state.resources.food > 0 || derived.passive.food > 0);
  } else if (structureId === "water_still") {
    active = built && (state.resources.fuel > 0 || derived.waterSecurity > 0);
  } else if (structureId === "ammo_press") {
    powered = built && state.resources.parts > 0;
    active = powered && state.resources.chemicals > 0;
  } else if (structureId === "battery_bank") {
    powered = built;
    active = built && state.resources.fuel > 0;
  } else if (structureId === "bunker_drill") {
    powered = built && state.resources.fuel > 0;
    active = powered && state.flags.bunkerRouteKnown;
  } else if (isUtility) {
    active = built && damage < 2 && systems.maintenanceState !== "failing";
  }

  let label = "active";
  let className = "is-active";
  if (damage >= 2) {
    label = "damaged";
    className = "is-damaged";
  } else if (!powered) {
    label = "unpowered";
    className = "is-unpowered";
  } else if (!active) {
    label = "idle";
    className = "is-idle";
  }

  return {
    built,
    damage,
    powered,
    active,
    label,
    className,
    telemetry: structureSignals(structureId, state, derived),
    crew: structureCrewNote(structureId),
  };
}

function structureStatusBadge(status) {
  if (status.damage >= 2) {
    return `DMG ${status.damage}`;
  }
  if (status.className === "is-unpowered") {
    return "DARK";
  }
  if (status.className === "is-idle") {
    return "IDLE";
  }
  return "LIVE";
}

function inspectedStructureId(state) {
  const selected = state.ui.mobileInspectorStructure || state.ui.inspectedStructure;
  if (selected === "shelter_core" || state.upgrades.includes(selected) || selected === SHELTER_MAP_PERIMETER.id) {
    return selected;
  }
  if (state.upgrades.includes(SHELTER_MAP_PERIMETER.id)) {
    return SHELTER_MAP_PERIMETER.id;
  }
  return "shelter_core";
}

function shelterStructureBuilt(state, structure) {
  if (typeof structure.active === "function") {
    return structure.active(state);
  }
  return Boolean(structure.upgrade && state.upgrades.includes(structure.upgrade));
}

export function getBuiltShelterStructures(state) {
  return SHELTER_MAP_STRUCTURES.filter((structure) => shelterStructureBuilt(state, structure));
}

export function getShelterMapPerimeter(state) {
  if (!state.upgrades.includes(SHELTER_MAP_PERIMETER.id)) {
    return null;
  }

  return {
    ...SHELTER_MAP_PERIMETER,
    detail: state.upgrades.includes("faraday_mesh")
      ? "scrap fence wrapped in grounded mesh"
      : "scrap fence and wired gate",
  };
}

function renderShelterFence(state) {
  const perimeter = getShelterMapPerimeter(state);
  if (!perimeter) {
    return "";
  }

  return `
    <div class="map-fence ${state.upgrades.includes("faraday_mesh") ? "has-mesh" : ""}" aria-hidden="true">
      <div class="fence-segment fence-top"></div>
      <div class="fence-segment fence-left"></div>
      <div class="fence-segment fence-right"></div>
      <div class="fence-segment fence-bottom-left"></div>
      <div class="fence-segment fence-bottom-right"></div>
      <div class="fence-gate">
        <span></span>
        <span></span>
      </div>
      <span class="fence-post post-nw"></span>
      <span class="fence-post post-ne"></span>
      <span class="fence-post post-sw"></span>
      <span class="fence-post post-se"></span>
      <span class="fence-post post-gate-left"></span>
      <span class="fence-post post-gate-right"></span>
    </div>
  `;
}

export function getOutpostStage(activeCount) {
  if (activeCount <= 2) {
    return "Held Corner";
  }
  if (activeCount <= 6) {
    return "Scrap Shelter";
  }
  if (activeCount <= 10) {
    return "Working Outpost";
  }
  return "Signal Compound";
}

function mapStructureByUpgrade(upgradeId) {
  return SHELTER_MAP_STRUCTURES.find((structure) => structure.upgrade === upgradeId) || null;
}

function renderPlannedStructureCard(state, upgrade) {
  const structure = mapStructureByUpgrade(upgrade.id);
  const meta = [];
  const activeJob = getActiveWorkJob(state);
  const missingTools = missingRequiredTools(state, upgrade.requiredTools || []);
  if (Object.keys(upgrade.cost || {}).length) {
    meta.push(formatCost(upgrade.cost));
  }
  if (upgrade.materials && Object.keys(upgrade.materials).length) {
    meta.push(formatMaterials(upgrade.materials));
  }
  if (upgrade.requiredTools?.length) {
    meta.push(`Tool ${upgrade.requiredTools.map((itemId) => ITEMS[itemId]?.name || itemId).join(" + ")}`);
  }
  if (structure?.col && structure?.row) {
    meta.push(`Grid ${structure.col}-${structure.row}`);
  }
  const canStart = !activeJob
    && canAfford(state, upgrade.cost)
    && hasMaterials(state, upgrade.materials)
    && hasRequiredTools(state, upgrade.requiredTools);

  return `
    <div class="ghost-card kind-${structure?.kind || "utility"} sprite-${structure?.sprite || "bench"}">
      <div class="surface-head">
        <div>
          <span class="note-label">Planned slot</span>
          <h4>${upgrade.name}</h4>
        </div>
        <span class="tag">${structure?.short || "PL"}</span>
      </div>
      <div class="ghost-preview">
        <div class="map-sprite small-sprite ghost-sprite">
          <span class="sprite-ground"></span>
          <span class="sprite-body"></span>
          <span class="sprite-accent"></span>
        </div>
      </div>
      <p class="note">${upgrade.description}</p>
      ${meta.length ? `<div class="chip-row">${tagList(meta)}</div>` : ""}
      ${actionButton({
        action: "start-work-job",
        label: `${upgrade.verb || "Build"} ${upgrade.name}`,
        meta: canStart ? `${upgrade.hours || 1}h queue` : activeJob ? `Busy: ${activeJob.label}` : missingTools[0] ? `Need ${ITEMS[missingTools[0]]?.name || missingTools[0]}` : "Need salvage",
        disabled: !canStart,
        data: { upgrade: upgrade.id },
        variant: "compact slot-trigger",
      })}
    </div>
  `;
}

function renderMapStructureButton(state, structure, derived, mobile = false) {
  const id = structureKey(structure);
  const status = structureStatus(id, state, derived);
  const tooltip = `${structure.label}: ${status.label}. ${status.telemetry[0] || structure.detail || "built"}. Grid ${structure.col}-${structure.row}.`;
  const selected = inspectedStructureId(state) === id;
  const showLabel = !mobile || selected || status.damage >= 2 || ["watch_post", "radio_rig", "campfire"].includes(structure.id);

  return `
    <button
      type="button"
      class="map-structure kind-${structure.kind} sprite-${structure.sprite} ${status.className} ${selected ? "is-selected" : ""} ${mobile && !showLabel ? "is-mobile-minimal" : ""}"
      style="--col:${structure.col}; --row:${structure.row};"
      data-action="inspect-structure"
      data-structure="${id}"
      data-tooltip="${tooltip}"
      title="${tooltip}"
      aria-label="${tooltip}"
    >
      <span class="structure-chip">${structureStatusBadge(status)}</span>
      <div class="map-sprite">
        <span class="sprite-ground"></span>
        <span class="sprite-body"></span>
        <span class="sprite-accent"></span>
      </div>
      ${showLabel ? `<span class="structure-name">${structure.short || structure.label}</span>` : ""}
    </button>
  `;
}

function renderStructureInspector(state) {
  const derived = getDerivedState(state);
  const structureId = inspectedStructureId(state);
  const structure = structureByKey(structureId);
  const status = structureStatus(structureId, state, derived);
  const cost = getRepairCost(state, structureId);
  const telemetry = status.telemetry.length ? status.telemetry : [structure.detail || "built"];
  const detail = structureId === SHELTER_MAP_PERIMETER.id
    ? getShelterMapPerimeter(state)?.detail || "scrap fence and wired gate"
    : structure.detail || "main shelter anchor";

  return `
    <div class="detail-list">
      <div class="list-block compact-block inspector-block">
        <div class="surface-head">
          <div>
            <span class="note-label">Selected structure</span>
            <h4>${structure.label}</h4>
          </div>
          <span class="tag ${status.className.replace("is-", "")}">${status.label}</span>
        </div>
        <div class="inspector-sprite sprite-${structure.sprite || "core"} kind-${structure.kind || "core"}">
          <div class="map-sprite">
            <span class="sprite-ground"></span>
            <span class="sprite-body"></span>
            <span class="sprite-accent"></span>
          </div>
        </div>
        <p class="note">${detail}</p>
        <div class="fact-grid">
          <div class="fact"><span>Integrity</span><strong>${Math.max(0, 3 - status.damage)}/3</strong></div>
          <div class="fact"><span>Crew use</span><strong>${status.crew}</strong></div>
          ${structure.col && structure.row ? `<div class="fact"><span>Grid</span><strong>${structure.col}-${structure.row}</strong></div>` : ""}
        </div>
        <div class="chip-row">${tagList(telemetry)}</div>
        ${Object.keys(cost).length
          ? actionButton({
            action: "repair-structure",
            label: `Repair ${structure.label}`,
            meta: formatCost(cost),
            disabled: !canAfford(state, cost),
            data: { structure: structureId },
            variant: "compact",
          })
          : `<p class="empty-state">No repair work queued.</p>`}
        <div class="action-row">
          <button type="button" class="mini-button" data-action="set-tab" data-tab="craft">Craft</button>
          <button type="button" class="mini-button" data-action="set-tab" data-tab="shelter">Shelter</button>
        </div>
      </div>
    </div>
  `;
}

function renderCompoundDistricts(state, structures, perimeter) {
  const districts = [
    {
      id: "perimeter",
      label: "Perimeter",
      note: "wall line, gate, and exterior control",
      entries: perimeter ? [perimeter.label] : [],
      status: perimeter ? structureStatus(SHELTER_MAP_PERIMETER.id, state, getDerivedState(state)).label : "open",
    },
    {
      id: "core",
      label: "Core",
      note: "heat, stash, and immediate living space",
      entries: structures.filter((structure) => structure.kind === "core").map((structure) => structure.label),
      status: "live",
    },
    {
      id: "support",
      label: "Support Row",
      note: "rest, food, and day-to-day sustain",
      entries: structures.filter((structure) => structure.kind === "support").map((structure) => structure.label),
      status: structures.some((structure) => structure.kind === "support") ? "online" : "dark",
    },
    {
      id: "utility",
      label: "Workline",
      note: "production, press work, and excavation",
      entries: structures.filter((structure) => structure.kind === "utility").map((structure) => structure.label),
      status: structures.some((structure) => structure.kind === "utility") ? "online" : "sparse",
    },
    {
      id: "signal",
      label: "Signal Edge",
      note: "receiver chain and long-range systems",
      entries: structures.filter((structure) => structure.kind === "signal" || structure.kind === "defense").map((structure) => structure.label),
      status: structures.some((structure) => structure.kind === "signal") ? "hot" : "quiet",
    },
  ];

  return `
    <div class="district-grid">
      ${districts.map((district) => `
        <div class="district-card district-${district.id}">
          <div class="surface-head">
            <div>
              <span class="note-label">District</span>
              <h4>${district.label}</h4>
            </div>
            <span class="tag">${district.status}</span>
          </div>
          <p class="note">${district.note}</p>
          ${district.entries.length
            ? `<div class="chip-row">${tagList(district.entries)}</div>`
            : `<p class="empty-state">No live structures here.</p>`}
        </div>
      `).join("")}
    </div>
  `;
}

function renderShelterMapBoard(state, mobile = false) {
  const structures = getBuiltShelterStructures(state);
  const perimeter = getShelterMapPerimeter(state);
  const activeCount = structures.length + (perimeter ? 1 : 0);
  const totalCount = SHELTER_MAP_STRUCTURES.length + 1;
  const meshed = state.upgrades.includes("faraday_mesh");
  const derived = getDerivedState(state);
  const damageCount = [SHELTER_MAP_PERIMETER.id, ...structures.map((structure) => structureKey(structure))]
    .filter((id, index) => (index === 0 ? Boolean(perimeter) || id !== SHELTER_MAP_PERIMETER.id : true))
    .reduce((total, structureId) => total + (getStructureDamage(state, structureId) >= 2 ? 1 : 0), 0);

  return `
    <div class="shelter-map-shell">
      <div class="outpost-headline">
        <div>
          <span class="note-label">Outpost stage</span>
          <strong>${getOutpostStage(activeCount)}</strong>
        </div>
        <div>
          <span class="note-label">Structures live</span>
          <strong>${activeCount}/${totalCount}</strong>
        </div>
        <div>
          <span class="note-label">Compound state</span>
          <strong>${damageCount ? "Needs repair" : "Stable"}</strong>
        </div>
      </div>
      <div class="shelter-map ${meshed ? "has-mesh" : ""} ${mobile ? "is-mobile-board" : ""}">
        <div class="map-compound-floor"></div>
        <div class="map-path gate-lane"></div>
        ${renderShelterFence(state)}
        ${structures.map((structure) => renderMapStructureButton(state, structure, derived, mobile)).join("")}
        ${perimeter ? `
          <button
            type="button"
            class="map-perimeter-button ${structureStatus(SHELTER_MAP_PERIMETER.id, state, derived).className} ${inspectedStructureId(state) === SHELTER_MAP_PERIMETER.id ? "is-selected" : ""}"
            style="--col:6; --row:8;"
            data-action="inspect-structure"
            data-structure="${SHELTER_MAP_PERIMETER.id}"
            data-tooltip="Perimeter Fence: ${structureStatus(SHELTER_MAP_PERIMETER.id, state, derived).label}. ${structureStatus(SHELTER_MAP_PERIMETER.id, state, derived).telemetry[0] || "holds the edge"}"
            title="Perimeter Fence"
          >
            <span>Gate</span>
          </button>
        ` : ""}
      </div>
    </div>
  `;
}

function renderMobileStructureInspector(state) {
  const derived = getDerivedState(state);
  const structureId = inspectedStructureId(state);
  const structure = structureByKey(structureId);
  const status = structureStatus(structureId, state, derived);
  const cost = getRepairCost(state, structureId);
  const telemetry = status.telemetry.length ? status.telemetry : [structure.detail || "built"];

  return `
    <div class="mobile-inspector-sheet">
      <button type="button" class="mobile-sheet-backdrop" data-action="close-mobile-inspector" aria-label="Close structure inspector"></button>
      <section class="mobile-sheet mobile-structure-sheet">
        <div class="mobile-sheet-head">
          <div>
            <span class="note-label">Structure</span>
            <h3>${structure.label}</h3>
          </div>
          <button type="button" class="mini-button" data-action="close-mobile-inspector">Close</button>
        </div>
        <div class="mobile-sheet-body">
          <div class="fact-grid">
            <div class="fact"><span>State</span><strong>${status.label}</strong></div>
            <div class="fact"><span>Integrity</span><strong>${Math.max(0, 3 - status.damage)}/3</strong></div>
            ${structure.col && structure.row ? `<div class="fact"><span>Grid</span><strong>${structure.col}-${structure.row}</strong></div>` : ""}
          </div>
          <div class="chip-row">${tagList(telemetry)}</div>
          ${Object.keys(cost).length
            ? actionButton({
              action: "repair-structure",
              label: `Repair ${structure.label}`,
              meta: formatCost(cost),
              disabled: !canAfford(state, cost),
              data: { structure: structureId },
              variant: "primary compact",
            })
            : `<p class="empty-state">No repair work queued.</p>`}
        </div>
      </section>
    </div>
  `;
}

export function renderShelterMapMobilePanel(state) {
  const builtStructures = getBuiltShelterStructures(state);
  const perimeter = getShelterMapPerimeter(state);
  const visibleStructures = perimeter ? [perimeter, ...builtStructures] : builtStructures;
  const nextBuilds = getVisibleUpgrades(state)
    .filter((upgrade) => !state.upgrades.includes(upgrade.id) && SHELTER_MAP_STRUCTURES.some((structure) => structure.upgrade === upgrade.id))
    .slice(0, 4);

  return `
    <div class="shelter-mobile-map-view">
      ${surfaceCard({
        title: "Shelter map",
        meta: `${getOutpostStage(visibleStructures.length)}`,
        className: "map-primary-card mobile-map-card",
        body: `
          ${renderShelterMapBoard(state, true)}
          <p class="note mobile-map-note">Tap a structure for state, effect, and repair access.</p>
        `,
      })}
      ${nextBuilds.length ? surfaceCard({
        title: "Planned works",
        meta: `${nextBuilds.length} open`,
        body: `
          <details class="mobile-accordion">
            <summary>
              <span>Open planned works</span>
              <span class="tag">${nextBuilds.length}</span>
            </summary>
            <div class="mobile-accordion-body ghost-grid">
              ${nextBuilds.map((upgrade) => renderPlannedStructureCard(state, upgrade)).join("")}
            </div>
          </details>
        `,
      }) : ""}
      ${state.ui.mobileInspectorStructure ? renderMobileStructureInspector(state) : ""}
    </div>
  `;
}

export function renderShelterMapTab(state) {
  const builtStructures = getBuiltShelterStructures(state);
  const perimeter = getShelterMapPerimeter(state);
  const visibleStructures = perimeter ? [perimeter, ...builtStructures] : builtStructures;
  const activeCount = visibleStructures.length;
  const visibleSources = getAvailableScavengeSources(state);
  const nextBuilds = getVisibleUpgrades(state)
    .filter((upgrade) => !state.upgrades.includes(upgrade.id) && SHELTER_MAP_STRUCTURES.some((structure) => structure.upgrade === upgrade.id))
    .slice(0, 4);
  const annexes = SHELTER_MAP_ANNEXES.filter((entry) => state.upgrades.includes(entry.upgrade));

  return renderSplitPane(
    [
      surfaceCard({
        title: "Shelter map",
        meta: `${getOutpostStage(activeCount)}`,
        className: "map-primary-card",
        body: renderShelterMapBoard(state),
      }),
      surfaceCard({
        title: "Compound feeds",
        meta: `${annexes.length} annexes / ${visibleSources.length} lanes`,
        className: "compound-feed-card",
        body: `
          <div class="compound-feed-grid">
            <div class="list-block compound-feed-block">
              <div class="surface-head">
                <h4>Annex systems</h4>
                <span class="tag">${annexes.length}</span>
              </div>
              ${annexes.length
                ? `<div class="annex-strip">${annexes.map((annex) => `
                <div class="annex-card kind-${annex.kind} sprite-${annex.sprite}">
                  <div class="map-sprite small-sprite">
                    <span class="sprite-ground"></span>
                    <span class="sprite-body"></span>
                    <span class="sprite-accent"></span>
                  </div>
                  <span>${annex.label}</span>
                </div>
              `).join("")}</div>`
                : `<p class="empty-state">No annexes attached yet.</p>`}
            </div>
            <div class="list-block compound-feed-block">
              <div class="surface-head">
                <h4>Supply lanes</h4>
                <span class="tag">${visibleSources.length}</span>
              </div>
              <div class="detail-list compact-list">
                ${visibleSources.slice(0, 4).map((source) => `
                  <div class="list-block compact-block">
                    <div class="surface-head">
                      <h4>${source.label}</h4>
                      <span class="tag">${sourceRarityCeiling(state, source.id).label}</span>
                    </div>
                    <p class="note">${source.focus.join(" / ")}</p>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        `,
      }),
    ],
    [
      surfaceCard({
        title: "Structure inspector",
        meta: `${visibleStructures.length} built`,
        body: renderStructureInspector(state),
      }),
      surfaceCard({
        title: "District ledger",
        meta: `${getOutpostStage(activeCount)}`,
        body: renderCompoundDistricts(state, builtStructures, perimeter),
      }),
      surfaceCard({
        title: "Planned works",
        meta: `${nextBuilds.length} open`,
        body: nextBuilds.length
          ? `<div class="ghost-grid">${nextBuilds.map((upgrade) => renderPlannedStructureCard(state, upgrade)).join("")}</div>`
          : `<p class="empty-state">No immediate structure slots are waiting. Push into higher systems.</p>`,
      }),
    ],
    "tab-columns-shelter-map"
  );
}

import { UPGRADES_BY_ID } from "../content.js";
import { getRepairCost, getShelterSystems, getStructureDamage, getVisibleUpgrades } from "../engine.js";
import {
  SHELTER_FIXED_STRUCTURES,
  SHELTER_GRID_COLUMNS,
  SHELTER_GRID_ROWS,
  SHELTER_PLACEABLE_STRUCTURES,
  builtPlaceableStructures,
  canPlaceShelterStructure,
  shelterStructureById,
  structureArea,
  structureUpgradeId,
} from "../shelter-layout.js";
import { renderStructureSprite } from "./sprites.js";
import { actionButton, itemLabel, resourceLabel, surfaceCard, tagList, tooltipAttrs } from "./shared.js";

function builtStructureDefs(state) {
  const builtIds = builtPlaceableStructures(state.upgrades).map((structure) => structure.id);
  return {
    builtIds,
    structures: SHELTER_PLACEABLE_STRUCTURES.filter((structure) => builtIds.includes(structure.id)),
  };
}

function outpostStage(count) {
  if (count <= 3) return "Held Corner";
  if (count <= 7) return "Shelter Line";
  if (count <= 12) return "Working Outpost";
  return "Fortified Base";
}

function structureEffects(structureId) {
  const upgrade = UPGRADES_BY_ID[structureUpgradeId(structureId)];
  const chips = [];
  if (!upgrade?.effects) {
    return chips;
  }
  const { effects } = upgrade;
  if (effects.burnCondition) chips.push(`heat +${effects.burnCondition}`);
  if (effects.nightMitigation) chips.push(`night resist +${Math.round(effects.nightMitigation * 100)}%`);
  if (effects.power) chips.push(`power +${effects.power}`);
  if (effects.coverage) chips.push(`coverage +${effects.coverage}`);
  if (effects.foodSecurity) chips.push(`food +${effects.foodSecurity}`);
  if (effects.waterSecurity) chips.push(`water +${effects.waterSecurity}`);
  if (effects.maintenance) chips.push(`maintenance +${effects.maintenance}`);
  if (effects.repairPower) chips.push(`repairs +${effects.repairPower}`);
  if (effects.siegeMitigation) chips.push(`siege resist +${Math.round(effects.siegeMitigation * 100)}%`);
  if (effects.unlockSections?.length) chips.push(`opens ${effects.unlockSections.join(", ")}`);
  if (effects.grantItems) {
    Object.entries(effects.grantItems).forEach(([itemId, amount]) => chips.push(`${itemLabel(itemId)} x${amount}`));
  }
  return chips;
}

function structureStatus(structureId, state) {
  const damage = getStructureDamage(state, structureId);
  const placed = state.shelter.layout?.placed?.[structureId];
  if (damage >= 2) {
    return { label: "damaged", tone: "danger", detail: "Needs repair before the next hard night." };
  }
  if (damage === 1) {
    return { label: "strained", tone: "warn", detail: "Holding, but starting to slip." };
  }
  if (!placed && structureId !== "shelter_core" && structureId !== "perimeter_fence") {
    return { label: "unplaced", tone: "idle", detail: "Built, but not placed on the board yet." };
  }
  return { label: "stable", tone: "good", detail: "Operational." };
}

function structureTooltip(structure, state) {
  const status = structureStatus(structure.id, state);
  return {
    title: structure.label,
    meta: status.label,
    body: `${structure.detail} ${status.detail}`,
  };
}

function renderBoardTiles(state, builtIds, pendingId) {
  const tiles = [];
  for (let row = 1; row <= SHELTER_GRID_ROWS; row += 1) {
    for (let col = 1; col <= SHELTER_GRID_COLUMNS; col += 1) {
      const valid = pendingId
        ? canPlaceShelterStructure(state.shelter.layout?.placed || {}, pendingId, col, row, builtIds)
        : false;
      tiles.push(`
        <button
          type="button"
          class="base-tile ${pendingId ? "is-placement" : ""} ${valid ? "is-valid" : "is-invalid"}"
          ${pendingId
            ? `data-action="place-structure" data-structure="${pendingId}" data-x="${col}" data-y="${row}" data-valid="${valid ? "true" : "false"}" aria-label="Place ${pendingId} at ${col}, ${row}"`
            : "disabled"}
        ></button>
      `);
    }
  }
  return `<div class="base-grid-tiles">${tiles.join("")}</div>`;
}

function renderPlacementPreview(state, structure) {
  const preview = state.ui.placementPreview;
  if (!structure || !preview || preview.structureId !== structure.id) {
    return `<div class="base-preview-layer"></div>`;
  }

  return `
    <div class="base-preview-layer">
      <div
        class="base-placement-preview"
        style="--x:${preview.x}; --y:${preview.y}; --w:${structure.footprint[0]}; --h:${structure.footprint[1]};"
      >
        <span class="base-placement-preview-sprite">${renderStructureSprite(structure.spriteId, 34)}</span>
      </div>
    </div>
  `;
}

function renderFixedStructure(structure, state) {
  const area = structureArea(structure, structure.defaultPosition);
  const status = structureStatus(structure.id, state);
  return `
    <button
      type="button"
      class="base-structure base-structure-fixed base-structure-${structure.kind} ${state.ui.selectedStructureId === structure.id ? "is-selected" : ""}"
      data-action="inspect-structure"
      data-structure="${structure.id}"
      style="--x:${area.x1}; --y:${area.y1}; --w:${structure.footprint[0]}; --h:${structure.footprint[1]};"
      ${tooltipAttrs(structureTooltip(structure, state))}
    >
      <span class="structure-status ${status.tone}">${status.label}</span>
      <span class="structure-sprite">${renderStructureSprite(structure.spriteId, 44)}</span>
      <span class="structure-name">${structure.short}</span>
    </button>
  `;
}

function renderPlacedStructure(structure, state) {
  const position = state.shelter.layout?.placed?.[structure.id];
  if (!position) {
    return "";
  }
  const status = structureStatus(structure.id, state);
  return `
    <button
      type="button"
      class="base-structure base-structure-${structure.kind} ${state.ui.selectedStructureId === structure.id ? "is-selected" : ""}"
      data-action="inspect-structure"
      data-structure="${structure.id}"
      style="--x:${position.x}; --y:${position.y}; --w:${structure.footprint[0]}; --h:${structure.footprint[1]};"
      ${tooltipAttrs(structureTooltip(structure, state))}
    >
      <span class="structure-status ${status.tone}">${status.label}</span>
      <span class="structure-sprite">${renderStructureSprite(structure.spriteId, 40)}</span>
      <span class="structure-name">${structure.short}</span>
    </button>
  `;
}

function renderBaseBoard(state) {
  const pendingId = state.ui.pendingPlacementStructureId;
  const { builtIds, structures } = builtStructureDefs(state);
  const pendingStructure = pendingId ? shelterStructureById(pendingId) : null;
  const placementMeta = pendingStructure
    ? `${pendingStructure.label} ${pendingStructure.footprint.join("x")} armed`
    : outpostStage(structures.length + 1);
  return `
    <div class="base-board ${pendingStructure ? "is-placement-armed" : ""}"${tooltipAttrs({ title: "Shelter board", meta: placementMeta, body: pendingStructure ? `Move ${pendingStructure.label}. Click a highlighted anchor tile to place the full ${pendingStructure.footprint.join("x")} footprint.` : "Click a built module to inspect it. Arm placement from the rack or inspector, then click a valid tile." })}>
      <div class="base-grid-frame"></div>
      <div class="base-grid-fence"></div>
      ${renderBoardTiles(state, builtIds, pendingId)}
      ${renderPlacementPreview(state, pendingStructure)}
      ${SHELTER_FIXED_STRUCTURES.filter((structure) => structure.id !== "perimeter_fence" || state.upgrades.includes("basic_barricade")).map((structure) => renderFixedStructure(structure, state)).join("")}
      ${structures
        .filter((structure) => structure.id !== pendingId)
        .map((structure) => renderPlacedStructure(structure, state))
        .join("")}
      <div class="base-grid-gate">Gate</div>
    </div>
  `;
}

function structureRackItem(structure, state) {
  const placed = Boolean(state.shelter.layout?.placed?.[structure.id]);
  const status = structureStatus(structure.id, state);
  const chips = structureEffects(structure.id).slice(0, 2);
  const moving = state.ui.pendingPlacementStructureId === structure.id;
  return `
    <div class="rack-card ${moving ? "is-armed" : ""}"${tooltipAttrs(structureTooltip(structure, state))}>
      <div class="rack-top">
        <span class="rack-sprite">${renderStructureSprite(structure.spriteId, 34)}</span>
        <div class="rack-copy">
          <strong>${structure.short}</strong>
          <small>${structure.footprint.join("x")}</small>
        </div>
        <span class="tag ${status.tone}">${status.label}</span>
      </div>
      <div class="rack-name-line">${structure.label}</div>
      ${chips.length ? `<div class="chip-row compact-chip-row">${tagList(chips.slice(0, 1))}</div>` : ""}
      <div class="rack-actions">
        ${actionButton({
          action: "start-placing-structure",
          label: moving ? "Armed" : placed ? "Move" : "Place",
          meta: moving ? "pick tile" : `${structure.footprint[0]}x${structure.footprint[1]}`,
          icon: "build",
          variant: "compact secondary",
          data: { structure: structure.id },
          tooltip: {
            title: structure.label,
            meta: placed ? "move" : "place",
            body: `Arm placement and choose a highlighted top-left tile for ${structure.label}.`,
          },
        })}
      </div>
    </div>
  `;
}

function renderBlueprintRack(state) {
  const buildableStructureIds = new Set(SHELTER_PLACEABLE_STRUCTURES.map((structure) => structure.upgradeId));
  const blueprints = getVisibleUpgrades(state)
    .filter((upgrade) => !state.upgrades.includes(upgrade.id) && buildableStructureIds.has(upgrade.id))
    .slice(0, 6);

  if (!blueprints.length) {
    return "";
  }

  return surfaceCard({
    title: "Blueprints",
    meta: `${blueprints.length}`,
    className: "base-blueprint-card",
    body: `
      <div class="blueprint-mini-grid">
        ${blueprints.map((upgrade) => `
          <div class="blueprint-mini"${tooltipAttrs({
            title: upgrade.name,
            meta: `${upgrade.hours || 1}h`,
            body: `${upgrade.description || "Structure blueprint"} Cost: ${Object.entries(upgrade.cost || {}).map(([resourceId, amount]) => `${resourceLabel(resourceId)} ${amount}`).join(", ") || "none"}.`,
          })}>
            <strong>${upgrade.name}</strong>
            <small>${upgrade.hours || 1}h</small>
          </div>
        `).join("")}
      </div>
    `,
  });
}

function renderStructureInspector(state, derived) {
  const selectedId = state.ui.selectedStructureId || "shelter_core";
  const structure = shelterStructureById(selectedId) || shelterStructureById("shelter_core");
  const status = structureStatus(structure.id, state);
  const cost = getRepairCost(state, structure.id);
  const chips = structureEffects(structure.id);
  const placed = state.shelter.layout?.placed?.[structure.id];
  const positionLabel = placed ? `${placed.x},${placed.y}` : structure.placeable ? "unplaced" : "fixed";
  const body = `
    <div class="base-inspector-hero">
      <span class="base-inspector-sprite">${renderStructureSprite(structure.spriteId, 72)}</span>
      <div>
        <span class="note-label">${structure.kind}</span>
        <h3>${structure.label}</h3>
        <p class="note">${structure.detail}</p>
      </div>
    </div>
    <div class="fact-grid compact-grid">
      <div class="fact"><span>Status</span><strong>${status.label}</strong></div>
      <div class="fact"><span>Footprint</span><strong>${structure.footprint.join("x")}</strong></div>
      <div class="fact"><span>Position</span><strong>${positionLabel}</strong></div>
      <div class="fact"><span>Damage</span><strong>${getStructureDamage(state, structure.id)}</strong></div>
    </div>
    ${chips.length ? `<div class="chip-row">${tagList(chips)}</div>` : ""}
    ${state.ui.pendingPlacementStructureId === structure.id ? `<p class="placement-note">Placement armed. Click a highlighted top-left tile on the board.</p>` : ""}
    <div class="detail-list">
      ${structure.placeable ? actionButton({
        action: "start-placing-structure",
        label: state.shelter.layout?.placed?.[structure.id] ? "Move structure" : "Place structure",
        icon: "build",
        variant: "compact",
        data: { structure: structure.id },
      }) : ""}
      ${Object.keys(cost).length ? actionButton({
        action: "repair-structure",
        label: "Repair",
        meta: Object.entries(cost).map(([resourceId, amount]) => `${resourceLabel(resourceId)} ${amount}`).join(" / "),
        icon: "heal",
        variant: "compact secondary",
        data: { structure: structure.id },
      }) : ""}
      ${state.ui.pendingPlacementStructureId ? actionButton({
        action: "clear-placement",
        label: "Cancel placement",
        icon: "retreat",
        variant: "compact secondary",
      }) : ""}
    </div>
  `;

  return surfaceCard({
    title: "Structure inspector",
    meta: status.label,
    className: "base-inspector-card",
    body,
  });
}

function renderSystemsStrip(state, derived) {
  const systems = getShelterSystems(state, derived);
  return `
    <div class="base-system-strip">
      <div class="base-system-card"><span>Food</span><strong>${systems.foodState}</strong><small>${systems.foodInflow.toFixed(2)} / ${systems.foodDrain.toFixed(2)}</small></div>
      <div class="base-system-card"><span>Water</span><strong>${systems.waterState}</strong><small>${systems.waterInflow.toFixed(2)} / ${systems.waterDrain.toFixed(2)}</small></div>
      <div class="base-system-card"><span>Power</span><strong>${systems.powerState}</strong><small>${systems.powerSupply}/${systems.powerDemand || 0}</small></div>
      <div class="base-system-card"><span>Maintenance</span><strong>${systems.maintenanceState}</strong><small>${systems.maintenanceBalance.toFixed(2)}</small></div>
      <div class="base-system-card"><span>Coverage</span><strong>${systems.coverage.toFixed(1)}</strong><small>defense ${derived.defense}</small></div>
    </div>
  `;
}

function renderRack(state) {
  const { structures } = builtStructureDefs(state);
  return surfaceCard({
    title: "Structure rack",
    meta: `${structures.length}`,
    className: "base-rack-card",
    body: structures.length
      ? `
        <div class="rack-grid">
          ${structures.map((structure) => structureRackItem(structure, state)).join("")}
        </div>
      `
      : `<p class="empty-state">Build shelter modules to populate the board.</p>`,
  });
}

function renderOpsSummary(state, derived) {
  const systems = getShelterSystems(state, derived);
  return `
    <div class="detail-list">
      <div class="list-block compact-block">
        <div class="surface-head">
          <h4>Compound state</h4>
          <span class="tag">${outpostStage(builtStructureDefs(state).structures.length + 1)}</span>
        </div>
        <div class="fact-grid compact-grid">
          <div class="fact"><span>Threat</span><strong>${state.shelter.threat.toFixed(1)}</strong></div>
          <div class="fact"><span>Noise</span><strong>${state.shelter.noise.toFixed(1)}</strong></div>
          <div class="fact"><span>Warmth</span><strong>${state.shelter.warmth.toFixed(1)}</strong></div>
          <div class="fact"><span>Damage</span><strong>${Object.keys(state.shelter.damage || {}).length}</strong></div>
        </div>
      </div>
      <div class="list-block compact-block">
        <div class="surface-head">
          <h4>Systems</h4>
          <span class="tag">${systems.powerState}</span>
        </div>
        <div class="chip-row">${tagList([
          `food ${systems.foodState}`,
          `water ${systems.waterState}`,
          `maintenance ${systems.maintenanceState}`,
          `coverage ${systems.coverage.toFixed(1)}`,
        ])}</div>
      </div>
    </div>
  `;
}

export function renderBaseScreen(state, derived, isMobile = false) {
  const boardCard = surfaceCard({
    title: "Placement board",
    meta: state.ui.pendingPlacementStructureId ? "placement armed" : outpostStage(builtStructureDefs(state).structures.length + 1),
    className: "base-board-card",
    body: renderBaseBoard(state),
  });
  const inspectorCard = renderStructureInspector(state, derived);
  const rackCard = renderRack(state);
  const blueprintCard = renderBlueprintRack(state);

  if (isMobile) {
    const mapMode = state.ui.mobileShelterMode === "map";
    return `
      <div class="tab-mobile-flow tab-mobile-flow-base">
        <div class="mobile-segmented-control">
          <button type="button" class="${!mapMode ? "is-active" : ""}" data-action="set-mobile-shelter-mode" data-mode="ops">Ops</button>
          <button type="button" class="${mapMode ? "is-active" : ""}" data-action="set-mobile-shelter-mode" data-mode="map">Grid</button>
        </div>
        ${renderSystemsStrip(state, derived)}
        ${mapMode ? boardCard : renderOpsSummary(state, derived)}
        ${mapMode ? inspectorCard : rackCard}
        ${mapMode ? rackCard : blueprintCard}
      </div>
    `;
  }

  return `
    <div class="base-screen">
      ${renderSystemsStrip(state, derived)}
      <div class="base-layout">
        <div class="base-main-column">
          ${boardCard}
          ${rackCard}
        </div>
        <div class="base-side-column">
          ${inspectorCard}
          ${blueprintCard}
        </div>
      </div>
    </div>
  `;
}

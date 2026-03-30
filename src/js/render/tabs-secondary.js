import { ITEMS, SURVIVOR_ROLES, SURVIVOR_TRAITS } from "../data.js";
import { getAvailableRadioInvestigations, getRadioBoard, getShelterUpkeep } from "../engine.js";
import { getLeaderboardSnapshot, getLeaderboardState } from "../services/leaderboard.js";
import { renderEnemySprite, renderItemSprite, renderSlotFrame, renderStructureSprite } from "./sprites.js";
import {
  actionButton,
  renderInventoryItemCard,
  renderMiniLog,
  surfaceCard,
  tagList,
  tooltipAttrs,
} from "./shared.js";

const PATCH_NOTES = [
  {
    version: "v6.0",
    title: "Visual Identity Overhaul",
    points: [
      "Desktop shell rebuilt into compact Ops, Survivor, Workshop, Base, Routes, Radio, and Crew screens.",
      "The Base screen now uses an interactive shelter placement grid with a live structure rack and inspector.",
      "SVG sprites now drive tabs, items, structures, threats, and player equipment slots.",
      "Survivor merges the old player and inventory views into one loadout screen.",
      "Desktop uses denser cards, stronger hierarchy, and custom tooltip panels for detail-on-demand.",
    ],
  },
  {
    version: "v5.3",
    title: "Early Survival Feel Pass",
    points: [
      "Backpack became real equipment with a salvage role.",
      "Tree line added as a real wood lane.",
      "Early rubble pressure ramps cleaner and less repetitively.",
    ],
  },
  {
    version: "v5.2",
    title: "Building / Crafting Overhaul",
    points: [
      "Builds and crafts moved into one timed work queue.",
      "Advanced structures now require the right tools strictly.",
      "Hammer, Sewing Kit, and Sharpening Stone joined the permanent tool ladder.",
    ],
  },
];

function patchNotesMarkup() {
  return `
    <div class="detail-list patch-note-list">
      ${PATCH_NOTES.map((note) => `
        <div class="list-block compact-block">
          <div class="surface-head">
            <h4>${note.title}</h4>
            <span class="tag">${note.version}</span>
          </div>
          <div class="chip-row">${tagList(note.points)}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function groupedInventory(state) {
  const entries = Object.entries(state.inventory).filter(([, amount]) => amount > 0);
  return {
    weapons: entries.filter(([itemId]) => ITEMS[itemId]?.type === "weapon"),
    armor: entries.filter(([itemId]) => ITEMS[itemId]?.type === "armor"),
    backpacks: entries.filter(([itemId]) => ITEMS[itemId]?.type === "backpack"),
    tools: entries.filter(([itemId]) => ITEMS[itemId]?.type === "tool"),
    consumables: entries.filter(([itemId]) => ITEMS[itemId]?.type === "consumable"),
    components: entries.filter(([itemId]) => !["weapon", "armor", "backpack", "tool", "consumable"].includes(ITEMS[itemId]?.type)),
  };
}

function slotCard(label, slotId, itemId, fallbackLabel, { droppable = false } = {}) {
  const item = itemId ? ITEMS[itemId] : null;
  const sprite = item ? renderItemSprite(itemId, item, 42) : `<span class="slot-fallback">${fallbackLabel}</span>`;
  const tooltip = item
    ? { title: item.name, meta: item.type, body: item.description || fallbackLabel }
    : { title: label, meta: "baseline", body: fallbackLabel };
  return `
    <div
      class="equipment-slot-card ${droppable ? "is-drop-slot" : ""} ${item ? "is-occupied" : "is-empty"}"
      ${droppable ? `data-slot="${slotId}" data-slot-filled="${item ? "true" : "false"}"` : ""}
      ${tooltipAttrs(tooltip)}
    >
      <div class="equipment-slot-shell">
        ${renderSlotFrame(slotId, Boolean(item))}
        <div class="equipment-slot-sprite">${sprite}</div>
      </div>
      <div class="equipment-slot-copy">
        <span>${label}</span>
        <strong>${item ? item.name : fallbackLabel}</strong>
      </div>
      ${item && droppable ? `
        <div class="slot-card-actions">
          ${actionButton({
            action: "unequip-slot",
            label: "Unequip",
            icon: "retreat",
            variant: "compact secondary",
            data: { slot: slotId },
            tooltip: {
              title: `Unequip ${item.name}`,
              meta: label,
              body: `${item.name} will stay in your pack and the slot will return to its baseline state.`,
            },
          })}
        </div>
      ` : ""}
    </div>
  `;
}

function infoSlotCard(label, slotId, amount, spriteMarkup, fallbackLabel, tooltip) {
  return `
    <div class="equipment-slot-card"${tooltipAttrs(tooltip)}>
      <div class="equipment-slot-shell">
        ${renderSlotFrame(slotId, amount > 0)}
        <div class="equipment-slot-sprite">${spriteMarkup}</div>
      </div>
      <div class="equipment-slot-copy">
        <span>${label}</span>
        <strong>${amount > 0 ? `${amount} packed` : fallbackLabel}</strong>
      </div>
    </div>
  `;
}

function mannequinMarkup(state, groups) {
  return `
    <div class="survivor-mannequin">
      <div class="mannequin-figure">
        <span class="mannequin-head"></span>
        <span class="mannequin-torso"></span>
        <span class="mannequin-arm mannequin-arm-left"></span>
        <span class="mannequin-arm mannequin-arm-right"></span>
        <span class="mannequin-leg mannequin-leg-left"></span>
        <span class="mannequin-leg mannequin-leg-right"></span>
      </div>
      <div class="mannequin-slots">
        ${slotCard("Weapon", "weapon", state.equipped.weapon, "Bare Hands", { droppable: true })}
        ${slotCard("Armor", "armor", state.equipped.armor, "Street Clothes", { droppable: true })}
        ${slotCard("Backpack", "backpack", state.equipped.backpack, "No Pack", { droppable: true })}
        ${infoSlotCard("Tool Belt", "tool_belt", groups.tools.length, renderStructureSprite("bench", 42), "No tools", {
          title: "Tool Belt",
          meta: "kit",
          body: `${groups.tools.length || 0} tools packed for field use.`,
        })}
        ${infoSlotCard("Field Aid", "field_care", groups.consumables.length, renderItemSprite("first_aid_rag", ITEMS.first_aid_rag, 42), "No aid ready", {
          title: "Field Aid",
          meta: "supplies",
          body: `${groups.consumables.length || 0} consumables ready for treatment or emergency use.`,
        })}
      </div>
    </div>
  `;
}

function inventorySection(title, entries, state, isMobile = false) {
  return `
    <div class="inventory-section">
      <div class="surface-head inventory-section-head">
        <h4>${title}</h4>
        <span class="tag">${entries.length}</span>
      </div>
      ${entries.length
        ? `<div class="inventory-card-grid">${entries.map(([itemId, amount]) => renderInventoryItemCard(itemId, amount, {
          showAction: true,
          enableDrag: !isMobile,
          equipped: state.equipped.weapon === itemId || state.equipped.armor === itemId || state.equipped.backpack === itemId,
        })).join("")}</div>`
        : `<p class="empty-state">No ${title.toLowerCase()} packed.</p>`}
    </div>
  `;
}

function storagePanel(title, meta, sections, className) {
  return surfaceCard({
    title,
    meta,
    className,
    body: `<div class="inventory-stack">${sections.join("")}</div>`,
  });
}

export function renderSurvivorTab(state, derived, isMobile = false) {
  const upkeep = getShelterUpkeep(state);
  const groups = groupedInventory(state);
  const statsCard = surfaceCard({
    title: "Field stats",
    meta: state.player.username || "unnamed",
    className: "survivor-stats-card",
    body: `
      <div class="fact-grid compact-grid">
        <div class="fact"><span>Condition</span><strong>${state.condition}/${derived.maxCondition}</strong></div>
        <div class="fact"><span>Attack</span><strong>${derived.attack}</strong></div>
        <div class="fact"><span>Defense</span><strong>${derived.defense}</strong></div>
        <div class="fact"><span>Ammo</span><strong>${state.resources.ammo}</strong></div>
        <div class="fact"><span>Meal due</span><strong>${upkeep.mealHoursLeft}h</strong></div>
        <div class="fact"><span>Water due</span><strong>${upkeep.waterHoursLeft}h</strong></div>
      </div>
    `,
  });

  const mannequinCard = surfaceCard({
    title: "Loadout",
    meta: state.player.username || "survivor",
    className: "survivor-mannequin-card",
    body: mannequinMarkup(state, groups),
  });

  const gearLocker = storagePanel(
    "Gear Locker",
    `${groups.weapons.length + groups.armor.length + groups.backpacks.length}`,
    [
      inventorySection("Weapons", groups.weapons, state, isMobile),
      inventorySection("Armor", groups.armor, state, isMobile),
      inventorySection("Backpacks", groups.backpacks, state, isMobile),
    ],
    "inventory-panel-card survivor-storage-card",
  );

  const suppliesLocker = storagePanel(
    "Field Supplies",
    `${groups.tools.length + groups.consumables.length + groups.components.length}`,
    [
      inventorySection("Tools", groups.tools, state, isMobile),
      inventorySection("Consumables", groups.consumables, state, isMobile),
      inventorySection("Components", groups.components, state, isMobile),
    ],
    "inventory-panel-card survivor-storage-card",
  );

  const layout = `
    <div class="survivor-left-column">${mannequinCard}</div>
    <div class="survivor-mid-column">${statsCard}</div>
    <div class="survivor-right-column">${gearLocker}${suppliesLocker}</div>
  `;

  return isMobile
    ? `<div class="tab-mobile-flow tab-mobile-flow-survivor">${layout}</div>`
    : `<div class="survivor-screen">${layout}</div>`;
}

function crewRoleControls(roleId, current) {
  return `
    <div class="crew-role-controls">
      <button type="button" class="compact-stepper" data-action="adjust-role" data-role="${roleId}" data-delta="-1">-</button>
      <span>${current}</span>
      <button type="button" class="compact-stepper" data-action="adjust-role" data-role="${roleId}" data-delta="1">+</button>
    </div>
  `;
}

export function renderCrewTab(state, _derived, isMobile = false) {
  const rosterCards = state.survivors.roster.map((survivor) => {
    const trait = SURVIVOR_TRAITS[survivor.traitId];
    const woundTone = survivor.wounded > 0 ? "danger" : "idle";
    const stressTone = survivor.stress >= 4 ? "warn" : "idle";
    return `
      <div class="crew-card">
        <div class="crew-card-head">
          <span class="crew-portrait">${renderEnemySprite("walker", 36)}</span>
          <div>
            <strong>${survivor.name}</strong>
            <small>${SURVIVOR_ROLES[survivor.role]?.label || "Idle"}</small>
          </div>
          <span class="tag">${trait?.label || survivor.traitId}</span>
        </div>
        <div class="chip-row">${tagList([
          `wound ${survivor.wounded}`,
          `stress ${survivor.stress}`,
          trait?.effect || "traited",
        ])}</div>
        <div class="crew-card-footer">
          <span class="tag ${woundTone}">wounds ${survivor.wounded}</span>
          <span class="tag ${stressTone}">stress ${survivor.stress}</span>
        </div>
      </div>
    `;
  }).join("");

  const assignmentCard = surfaceCard({
    title: "Assignments",
    meta: `${state.survivors.total}`,
    className: "crew-assignment-card",
    body: `
      <div class="detail-list">
        ${Object.entries(SURVIVOR_ROLES).map(([roleId, role]) => `
          <div class="list-block compact-block">
            <div class="surface-head">
              <h4>${role.label}</h4>
              <span class="tag">${state.survivors.assigned[roleId]}</span>
            </div>
            <p class="note">${role.summary || role.label}</p>
            ${crewRoleControls(roleId, state.survivors.assigned[roleId])}
          </div>
        `).join("")}
      </div>
      <div class="action-row">
        ${actionButton({
          action: "recruit",
          label: "Recruit survivor",
          meta: "expand roster",
          icon: "recruit",
          variant: "compact",
        })}
      </div>
    `,
  });

  const rosterCard = surfaceCard({
    title: "Roster",
    meta: `${state.survivors.roster.length}`,
    className: "crew-roster-card",
    body: rosterCards || `<p class="empty-state">No crew yet.</p>`,
  });

  return isMobile
    ? `<div class="tab-mobile-flow tab-mobile-flow-crew">${assignmentCard}${rosterCard}</div>`
    : `<div class="crew-screen">${assignmentCard}${rosterCard}</div>`;
}

export function renderRadioTab(state, isMobile = false) {
  const board = getRadioBoard(state);
  const card = surfaceCard({
    title: "Investigation wall",
    meta: `${board.length}`,
    className: "radio-board-card",
    body: `
      <div class="radio-node-grid">
        ${board.map((node) => `
          <div class="radio-node ${node.active ? "is-active" : ""}"${tooltipAttrs({
            title: node.label,
            meta: `${node.trace} trace`,
            body: `${node.nextText} ${node.nextAt ? `Next at ${node.nextAt}.` : "Track exhausted."}`,
          })}>
            <div class="radio-node-head">
              <span class="radio-node-glyph">${renderStructureSprite("radio_rig", 32)}</span>
              <div>
                <strong>${node.label}</strong>
                <small>${node.short}</small>
              </div>
              <span class="tag">${node.trace}</span>
            </div>
            <div class="chip-row">${tagList([
              `${node.resolvedCount}/${node.totalMilestones} resolved`,
              node.nextAt ? `next ${node.nextAt}` : "complete",
            ])}</div>
            ${actionButton({
              action: "set-radio-investigation",
              label: node.active ? "Tracking" : "Track",
              meta: "signal",
              icon: "radio",
              variant: "compact",
              data: { investigation: node.id },
            })}
          </div>
        `).join("")}
      </div>
      <div class="action-row">
        ${actionButton({
          action: "scan-radio",
          label: "Sweep signal",
          meta: "fuel 1 / parts 1",
          icon: "radio",
          variant: "primary",
          tooltip: {
            title: "Sweep signal",
            meta: "radio",
            body: "Burn fuel and parts to advance the current investigation.",
          },
        })}
      </div>
    `,
  });

  return isMobile ? `<div class="tab-mobile-flow">${card}</div>` : `<div class="radio-screen">${card}</div>`;
}

function leaderboardStatusLabel(board) {
  if (!board.enabled) return "offline";
  if (board.status === "loading") return "syncing";
  if (board.status === "error") return "issue";
  if (board.submitStatus === "submitting") return "uploading";
  return "synced";
}

export function renderLeaderboardTab(state, isMobile = false) {
  const board = getLeaderboardState();
  const snapshot = getLeaderboardSnapshot(state);
  const entries = board.entries || [];
  const summaryCard = surfaceCard({
    title: "Current run",
    meta: state.player.username || "unset",
    className: "leaderboard-summary-card",
    body: `
      <div class="fact-grid compact-grid">
        <div class="fact"><span>Score</span><strong>${snapshot.summary.score}</strong></div>
        <div class="fact"><span>Stage</span><strong>${snapshot.summary.stage}</strong></div>
        <div class="fact"><span>Nights</span><strong>${snapshot.summary.nightsSurvived}</strong></div>
        <div class="fact"><span>Zones</span><strong>${snapshot.summary.zonesVisited}</strong></div>
      </div>
      <div class="action-row action-row-wrap">
        ${actionButton({ action: "set-callsign", label: "Edit Username", icon: "username", variant: "compact" })}
        ${actionButton({ action: "refresh-leaderboard", label: "Refresh", icon: "sync", variant: "compact secondary" })}
        ${actionButton({ action: "submit-leaderboard", label: "Submit", icon: "upload", variant: "compact secondary" })}
      </div>
    `,
  });

  const boardCard = surfaceCard({
    title: "Global board",
    meta: leaderboardStatusLabel(board),
    className: "leaderboard-board-card",
    body: entries.length
      ? `
        <div class="detail-list leaderboard-stack">
          ${entries.map((entry) => `
            <div class="list-block compact-block leaderboard-row">
              <div class="surface-head">
                <h4>#${entry.rank} ${entry.playerName}</h4>
                <span class="tag">${entry.score}</span>
              </div>
              <div class="chip-row">${tagList([
                entry.stage,
                `nights ${entry.nights}`,
                `zones ${entry.zones}`,
                `signal ${entry.radio}`,
              ])}</div>
            </div>
          `).join("")}
        </div>
      `
      : `<p class="empty-state">${board.message || "No hosted runs yet."}</p>`,
  });

  return isMobile ? `<div class="tab-mobile-flow">${summaryCard}${boardCard}</div>` : `<div class="leaderboard-screen">${summaryCard}${boardCard}</div>`;
}

export function renderLogTab(state, isMobile = false) {
  const archive = surfaceCard({
    title: "Archive",
    meta: `${state.log.length}`,
    className: "log-archive-card",
    body: `
      <div class="full-log">
        ${state.log.map((entry) => `
          <div class="mini-log-line">
            <span>${entry.stamp}</span>
            <p>${entry.text}</p>
          </div>
        `).join("")}
      </div>
    `,
  });
  const notes = surfaceCard({
    title: "Patch notes",
    meta: PATCH_NOTES[0].version,
    className: "log-patch-card",
    body: patchNotesMarkup(),
  });
  return isMobile ? `<div class="tab-mobile-flow">${archive}${notes}</div>` : `<div class="log-screen">${archive}${notes}</div>`;
}

export function renderHelpTab(state, isMobile = false) {
  const guide = surfaceCard({
    title: "Field guide",
    meta: state.settings.tutorialHints ? "guided" : "manual",
    className: "help-guide-card",
    body: `
      <div class="detail-list">
        <div class="list-block compact-block"><h4>First 10 minutes</h4><p class="note">Search, build heat, secure food, then fence the edge.</p></div>
        <div class="list-block compact-block"><h4>Core loop</h4><p class="note">Loot -> stabilize -> collect resources -> survive -> build shelter -> build base -> defend.</p></div>
        <div class="list-block compact-block"><h4>Workshop</h4><p class="note">One shared queue. Use time well while jobs run.</p></div>
        <div class="list-block compact-block"><h4>Base</h4><p class="note">Place modules, inspect damage, and keep food, water, power, and maintenance stable.</p></div>
      </div>
    `,
  });
  return isMobile ? `<div class="tab-mobile-flow">${guide}</div>` : `<div class="help-screen">${guide}</div>`;
}

export function renderSettingsTab(state, isMobile = false) {
  const settings = surfaceCard({
    title: "Settings",
    meta: "local",
    className: "settings-card",
    body: `
      <div class="detail-list">
        <div class="list-block compact-block">
          <div class="surface-head"><h4>Profile</h4><span class="tag">${state.player.username || "unset"}</span></div>
          ${actionButton({ action: "set-username", label: "Set Username", icon: "username", variant: "compact" })}
        </div>
        <div class="list-block compact-block">
          <div class="surface-head"><h4>Tutorial hints</h4><span class="tag">${state.settings.tutorialHints ? "on" : "off"}</span></div>
          ${actionButton({ action: "toggle-setting", label: "Toggle", icon: "generic", variant: "compact secondary", data: { setting: "tutorialHints" } })}
        </div>
        <div class="list-block compact-block">
          <div class="surface-head"><h4>Reduced motion</h4><span class="tag">${state.settings.reducedMotion ? "on" : "off"}</span></div>
          ${actionButton({ action: "toggle-setting", label: "Toggle", icon: "generic", variant: "compact secondary", data: { setting: "reducedMotion" } })}
        </div>
        <div class="list-block compact-block">
          <div class="surface-head"><h4>Compact stage copy</h4><span class="tag">${state.settings.briefStageCopy ? "on" : "off"}</span></div>
          ${actionButton({ action: "toggle-setting", label: "Toggle", icon: "generic", variant: "compact secondary", data: { setting: "briefStageCopy" } })}
        </div>
        <div class="list-block compact-block">
          <div class="surface-head"><h4>Confirm reset</h4><span class="tag">${state.settings.confirmReset ? "on" : "off"}</span></div>
          ${actionButton({ action: "toggle-setting", label: "Toggle", icon: "generic", variant: "compact secondary", data: { setting: "confirmReset" } })}
        </div>
        <div class="action-row action-row-wrap">
          ${actionButton({ action: "save-game", label: "Save", icon: "save_file", variant: "compact" })}
          ${actionButton({ action: "download-save-file", label: "Download save", icon: "save_file", variant: "compact secondary" })}
          ${actionButton({ action: "copy-save-code", label: "Copy save code", icon: "copy", variant: "compact secondary" })}
          ${actionButton({ action: "import-save-code", label: "Import save", icon: "load_file", variant: "compact secondary" })}
          ${actionButton({ action: "reset-game", label: "Reset run", icon: "retreat", variant: "compact danger" })}
        </div>
      </div>
    `,
  });

  return isMobile ? `<div class="tab-mobile-flow">${settings}</div>` : `<div class="settings-screen">${settings}</div>`;
}

export function renderCombatBanner(state) {
  const banner = document.getElementById("combat-banner");
  if (!banner) {
    return;
  }
  if (!state.combat) {
    banner.classList.add("is-hidden");
    banner.innerHTML = "";
    return;
  }

  banner.classList.remove("is-hidden");
  banner.innerHTML = `
    <div class="combat-banner-shell">
      <div class="combat-banner-head">
        <span class="combat-banner-sprite">${renderEnemySprite(state.combat.enemy?.id || "generic", 52)}</span>
        <div>
          <span class="note-label">Contact</span>
          <h3>${state.combat.enemy?.name || "Unknown threat"}</h3>
          <p class="note">${state.combat.enemy?.description || "The infected are inside your reach now."}</p>
        </div>
      </div>
      <div class="chip-row">${tagList([
        `enemy hp ${state.combat.enemyHp}`,
        `player hp ${state.condition}`,
        state.combat.enemy?.intent || "advance",
      ])}</div>
      <div class="action-row action-row-wrap">
        ${actionButton({ action: "combat-attack", label: "Attack", icon: "combat", variant: "compact" })}
        ${actionButton({ action: "combat-brace", label: "Brace", icon: "barricade", variant: "compact secondary" })}
        ${actionButton({ action: "combat-heal", label: "Heal", icon: "heal", variant: "compact secondary" })}
        ${actionButton({ action: "combat-retreat", label: "Retreat", icon: "retreat", variant: "compact danger" })}
      </div>
    </div>
  `;
}

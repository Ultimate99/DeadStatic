import { iconMarkup } from "./icons.js";

function spriteSvg(body, className, size) {
  return `
    <svg class="${className}" viewBox="0 0 64 64" width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${body}
    </svg>
  `;
}

const ITEM_SPRITES = {
  rusty_knife: `
    <path d="M15 46 38 23l10-2-2 10-23 23-8-8Z" fill="currentColor" opacity=".9"/>
    <path d="M38 23 46 31" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  nail_bat: `
    <path d="M18 50 26 17c1-4 5-7 9-7h9l-9 44-17-4Z" fill="currentColor" opacity=".9"/>
    <path d="m31 16 4-6m6 8 5-4m-1 11 7-1" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  hunting_spear: `
    <path d="M16 52 46 14" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="m41 15 7-5 2 8-7 4-2-7Z" fill="var(--sprite-accent, #d3a56a)"/>
  `,
  transit_pistol: `
    <path d="M16 28h26l6 8-5 5h-9l-2 12h-8l1-12H16Z" fill="currentColor"/>
    <rect x="35" y="23" width="12" height="5" rx="2" fill="var(--sprite-accent, #d3a56a)"/>
  `,
  fire_axe: `
    <path d="M22 53 38 13" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M35 16c5-4 11-5 15-1-1 6-6 10-14 12l-5-11Z" fill="var(--sprite-accent, #d3a56a)"/>
  `,
  tower_rifle: `
    <path d="M11 31h37l6 5-6 4H31l-5 9h-6l2-9H11Z" fill="currentColor"/>
    <rect x="27" y="24" width="11" height="5" rx="2" fill="var(--sprite-accent, #d3a56a)"/>
  `,
  patchwork_vest: `
    <path d="M20 12h24l6 8-6 30H20l-6-30 6-8Z" fill="currentColor"/>
    <path d="M27 12v11m10-11v11M23 34h18" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  riot_padding: `
    <path d="M20 11h24l7 8-7 32H20l-7-32 7-8Z" fill="currentColor"/>
    <path d="M24 18h16v9H24Zm0 14h16v11H24Z" fill="var(--sprite-accent, #d3a56a)" opacity=".85"/>
  `,
  signal_cloak: `
    <path d="M18 13h28l6 9-8 28H20l-8-28 6-9Z" fill="currentColor"/>
    <path d="m24 18 8 8 8-8m-16 18h16" stroke="var(--sprite-accent, #98b1a2)" stroke-width="3" stroke-linecap="round"/>
  `,
  backpack: `
    <path d="M20 16h24l6 7v24l-6 7H20l-6-7V23l6-7Z" fill="currentColor"/>
    <path d="M26 16v-4h12v4M24 31h16M26 39h12" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  pry_bar: `
    <path d="M20 48 38 15" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="m37 15 7 2-2 6" stroke="var(--sprite-accent, #d3a56a)" stroke-width="4" stroke-linecap="round"/>
  `,
  salvage_hatchet: `
    <path d="M21 52 37 15" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M34 17c4-5 10-7 15-3-1 7-7 11-15 12l-4-9Z" fill="var(--sprite-accent, #d3a56a)"/>
  `,
  hammer: `
    <path d="M23 52 35 20" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M28 18h18l-2 8H26l2-8Z" fill="var(--sprite-accent, #d3a56a)"/>
  `,
  sewing_kit: `
    <rect x="16" y="18" width="32" height="28" rx="6" fill="currentColor"/>
    <path d="M24 27h16m-8-6v18m-13-6h26" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  carpenter_kit: `
    <rect x="15" y="21" width="34" height="24" rx="4" fill="currentColor"/>
    <path d="M22 18h20M24 30h16m-9 0v10" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  hand_drill: `
    <path d="M14 35h27l9 7-6 7H27l-13-9v-5Z" fill="currentColor"/>
    <path d="M41 24h8v15" stroke="var(--sprite-accent, #d3a56a)" stroke-width="4" stroke-linecap="round"/>
  `,
  signal_meter: `
    <rect x="16" y="13" width="32" height="38" rx="6" fill="currentColor"/>
    <path d="M24 21h16M24 30c2-6 14-6 16 0M24 40h16" stroke="var(--sprite-accent, #98b1a2)" stroke-width="3" stroke-linecap="round"/>
  `,
  sharpening_stone: `
    <path d="M17 40c0-10 12-20 21-20 8 0 9 6 9 9 0 11-14 19-23 19-5 0-7-4-7-8Z" fill="currentColor"/>
    <path d="M24 36h17" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  first_aid_rag: `
    <path d="M18 18h28l-4 28H22l-4-28Z" fill="currentColor"/>
    <path d="M25 32h14m-7-7v14" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  tower_battery: `
    <rect x="22" y="14" width="20" height="36" rx="6" fill="currentColor"/>
    <path d="M28 20h8m-8 11h8m-8 11h8" stroke="var(--sprite-accent, #98b1a2)" stroke-width="3" stroke-linecap="round"/>
  `,
  sharp_metal: `
    <path d="M17 46 43 18l5 8-21 22-10-2Z" fill="currentColor"/>
    <path d="M42 17 49 9l4 7-5 9" fill="var(--sprite-accent, #d3a56a)"/>
  `,
};

const STRUCTURE_SPRITES = {
  shelter_core: `
    <rect x="14" y="18" width="36" height="28" rx="6" fill="currentColor"/>
    <path d="M18 18 32 8l14 10" stroke="var(--sprite-accent, #d3a56a)" stroke-width="4" stroke-linecap="round"/>
    <rect x="27" y="31" width="10" height="15" rx="2" fill="var(--sprite-accent, #98b1a2)" opacity=".8"/>
  `,
  perimeter_fence: `
    <path d="M8 48h48" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <path d="M14 48V20M24 48V16M34 48V19M44 48V16M54 48V20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <path d="M22 34h20" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  stash: `
    <rect x="15" y="24" width="34" height="22" rx="5" fill="currentColor"/>
    <path d="M21 24h22l4 7H17l4-7Z" fill="var(--sprite-accent, #d3a56a)"/>
  `,
  campfire: `
    <path d="M18 45h28" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <path d="M22 45 30 31M42 45 34 31" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <path d="M32 18c6 7 8 11 8 15a8 8 0 0 1-16 0c0-4 3-8 8-15Z" fill="var(--sprite-accent, #d3a56a)"/>
  `,
  cots: `
    <rect x="12" y="25" width="18" height="12" rx="3" fill="currentColor"/>
    <rect x="34" y="30" width="18" height="12" rx="3" fill="currentColor" opacity=".82"/>
    <path d="M16 39v7M26 39v7M38 44v6M48 44v6" stroke="var(--sprite-accent, #98b1a2)" stroke-width="3" stroke-linecap="round"/>
  `,
  smokehouse: `
    <path d="M18 46V26l10-10h10l8 8v22H18Z" fill="currentColor"/>
    <path d="M26 17v11m12-5v23" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
    <path d="M43 13c4 3 5 5 5 8" stroke="var(--sprite-accent, #98b1a2)" stroke-width="3" stroke-linecap="round"/>
  `,
  crate: `
    <rect x="18" y="22" width="28" height="24" rx="4" fill="currentColor"/>
    <path d="M18 30h28M28 22v24" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  collector: `
    <ellipse cx="32" cy="28" rx="18" ry="11" fill="currentColor"/>
    <path d="M18 28v15h28V28" stroke="var(--sprite-accent, #98b1a2)" stroke-width="3" stroke-linecap="round"/>
    <path d="M32 18v8" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  water_still: `
    <rect x="16" y="20" width="16" height="24" rx="4" fill="currentColor"/>
    <rect x="36" y="26" width="12" height="18" rx="4" fill="currentColor" opacity=".85"/>
    <path d="M24 20v-6M32 28h7" stroke="var(--sprite-accent, #98b1a2)" stroke-width="3" stroke-linecap="round"/>
  `,
  bench: `
    <rect x="14" y="22" width="36" height="10" rx="3" fill="currentColor"/>
    <path d="M20 32v14M44 32v14M24 17h16" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  rack: `
    <path d="M19 47V20M45 47V20M19 28h26M19 37h26" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <path d="M28 24v8M34 33v8" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  hooks: `
    <path d="M20 17h24M22 17v23M42 17v23" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <path d="M26 24c0 4 5 4 5 8M38 24c0 4-5 4-5 8" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  watch_post: `
    <path d="M20 50 26 18h12l6 32" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <rect x="22" y="18" width="20" height="10" rx="2" fill="var(--sprite-accent, #d3a56a)"/>
    <path d="M24 34h16" stroke="var(--sprite-accent, #98b1a2)" stroke-width="3" stroke-linecap="round"/>
  `,
  tripwire_grid: `
    <path d="M16 42h32" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <path d="M20 42v-18M32 42V18M44 42V24" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <path d="M20 24h24M20 33h24" stroke="var(--sprite-accent, #d3a56a)" stroke-width="2" stroke-linecap="round"/>
  `,
  ammo_press: `
    <rect x="18" y="26" width="28" height="18" rx="5" fill="currentColor"/>
    <path d="M32 16v10M24 34h16" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  repair_rig: `
    <rect x="16" y="22" width="32" height="18" rx="5" fill="currentColor"/>
    <path d="M24 18h16M24 31h16M28 40v8M36 40v8" stroke="var(--sprite-accent, #98b1a2)" stroke-width="3" stroke-linecap="round"/>
  `,
  radio_rig: `
    <rect x="18" y="20" width="28" height="24" rx="5" fill="currentColor"/>
    <path d="M24 26h16M24 33h10M32 20V12" stroke="var(--sprite-accent, #98b1a2)" stroke-width="3" stroke-linecap="round"/>
    <path d="M45 14c4 2 6 5 6 9" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  signal_decoder: `
    <rect x="18" y="18" width="28" height="28" rx="6" fill="currentColor"/>
    <path d="M24 25h16M24 33h16M28 40h8" stroke="var(--sprite-accent, #98b1a2)" stroke-width="3" stroke-linecap="round"/>
  `,
  battery_bank: `
    <rect x="18" y="18" width="12" height="28" rx="4" fill="currentColor"/>
    <rect x="34" y="18" width="12" height="28" rx="4" fill="currentColor" opacity=".88"/>
    <path d="M24 12v6M40 12v6" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  flood_lights: `
    <path d="M20 48 26 22h12l6 26" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <rect x="21" y="16" width="22" height="10" rx="3" fill="var(--sprite-accent, #d3a56a)"/>
  `,
  beacon: `
    <path d="M32 12v30" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <path d="M20 24c3-5 7-8 12-8s9 3 12 8" stroke="var(--sprite-accent, #98b1a2)" stroke-width="3" stroke-linecap="round"/>
    <path d="M24 48h16" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
  `,
  crawler: `
    <rect x="16" y="28" width="26" height="12" rx="5" fill="currentColor"/>
    <circle cx="23" cy="44" r="4" fill="var(--sprite-accent, #d3a56a)"/>
    <circle cx="39" cy="44" r="4" fill="var(--sprite-accent, #d3a56a)"/>
    <path d="M42 32h8" stroke="var(--sprite-accent, #98b1a2)" stroke-width="3" stroke-linecap="round"/>
  `,
  bike: `
    <circle cx="22" cy="42" r="8" stroke="currentColor" stroke-width="4"/>
    <circle cx="44" cy="42" r="8" stroke="currentColor" stroke-width="4"/>
    <path d="M22 42 30 28h8l6 14M30 28l6 14M38 28l5-8" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  mesh: `
    <path d="M18 20h28v24H18z" stroke="currentColor" stroke-width="4"/>
    <path d="M18 28h28M18 36h28M27 20v24M37 20v24" stroke="var(--sprite-accent, #98b1a2)" stroke-width="2" stroke-linecap="round"/>
  `,
  relay_tap: `
    <path d="M22 48V22l10-10 10 10v26" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <path d="M26 28h12M26 36h12" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  bunker_drill: `
    <path d="M16 34h26l8 6-8 6H16Z" fill="currentColor"/>
    <path d="M42 34 52 40 42 46" stroke="var(--sprite-accent, #d3a56a)" stroke-width="4" stroke-linecap="round"/>
    <path d="M20 30h14" stroke="var(--sprite-accent, #98b1a2)" stroke-width="3" stroke-linecap="round"/>
  `,
};

const ENEMY_SPRITES = {
  walker: `
    <circle cx="32" cy="15" r="7" fill="currentColor"/>
    <path d="M24 58 29 40 27 28h10l-2 12 5 18M23 30l8 8m10-8-8 8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
  `,
  screecher: `
    <circle cx="32" cy="14" r="8" fill="currentColor"/>
    <path d="M24 21h16M18 31l14-8 14 8M28 58l4-20 4 20" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <path d="M16 18c4-5 8-7 16-7s12 2 16 7" stroke="var(--sprite-accent, #d3a56a)" stroke-width="3" stroke-linecap="round"/>
  `,
  bloated_carrier: `
    <circle cx="32" cy="18" r="7" fill="currentColor"/>
    <ellipse cx="32" cy="38" rx="13" ry="15" fill="currentColor"/>
    <path d="M22 55l3-9m17 9-3-9" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <circle cx="28" cy="37" r="2" fill="var(--sprite-accent, #d3a56a)"/>
    <circle cx="36" cy="41" r="2" fill="var(--sprite-accent, #d3a56a)"/>
  `,
  stalker: `
    <circle cx="33" cy="14" r="6" fill="currentColor"/>
    <path d="M24 58 31 39 28 28h8l-2 11 6 19M19 31l13-9 13 9" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <path d="M44 19 54 12" stroke="var(--sprite-accent, #98b1a2)" stroke-width="3" stroke-linecap="round"/>
  `,
  static_touched: `
    <circle cx="32" cy="15" r="7" fill="currentColor"/>
    <path d="M24 57 30 40l-4-12h12l-4 12 6 17" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <path d="M16 24h10l-5 8h10l-5 8h13" stroke="var(--sprite-accent, #98b1a2)" stroke-width="3" stroke-linecap="round"/>
  `,
  generic: `
    <circle cx="32" cy="16" r="8" fill="currentColor"/>
    <path d="M24 57 30 40l-3-12h10l-3 12 6 17" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
  `,
};

function fallbackItemSprite(item, size) {
  const iconMap = {
    weapon: "combat",
    armor: "gear",
    backpack: "inventory",
    tool: item?.toolRole === "signal" ? "radio" : "build",
    consumable: "heal",
    component: "parts",
    key: "leaderboard",
  };
  return `<span class="icon-sprite icon-sprite-${item?.type || "component"}">${iconMarkup(iconMap[item?.type] || "generic")}</span>`;
}

export function renderItemSprite(itemId, item, size = 24) {
  const body = ITEM_SPRITES[itemId];
  if (!body) {
    return fallbackItemSprite(item, size);
  }
  return spriteSvg(body, "ui-sprite item-sprite", size);
}

export function renderStructureSprite(spriteId, size = 48) {
  const body = STRUCTURE_SPRITES[spriteId] || STRUCTURE_SPRITES.stash;
  return spriteSvg(body, "ui-sprite structure-sprite", size);
}

export function renderEnemySprite(enemyId, size = 48) {
  const body = ENEMY_SPRITES[enemyId] || ENEMY_SPRITES.generic;
  return spriteSvg(body, "ui-sprite enemy-sprite", size);
}

export function renderSlotFrame(slotId, filled, size = 96) {
  const accent = filled ? "var(--accent-strong, #f1cb87)" : "rgba(241, 203, 135, 0.2)";
  return `
    <svg class="slot-frame slot-frame-${slotId}" viewBox="0 0 96 96" width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="10" y="10" width="76" height="76" rx="14" stroke="${accent}" stroke-width="3"/>
      <path d="M28 28h40M28 68h40M28 28v40M68 28v40" stroke="rgba(255,255,255,0.05)" stroke-width="2"/>
    </svg>
  `;
}

export function navSprite(name) {
  return iconMarkup(name);
}

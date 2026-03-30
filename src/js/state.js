import {
  RESOURCE_ORDER,
  SAVE_KEY,
  SURVIVOR_NAME_POOL,
  SURVIVOR_ROLES,
  SURVIVOR_TRAITS,
} from "./data.js";
import { seedShelterPlacedLayout } from "./shelter-layout.js";

const CURRENT_VERSION = 11;

const LEGACY_TAB_MAP = {
  overview: "ops",
  player: "survivor",
  inventory: "survivor",
  craft: "workshop",
  shelter: "base",
  shelter_map: "base",
  map: "routes",
  survivors: "crew",
};

function defaultAssignedRoles() {
  return Object.fromEntries(Object.keys(SURVIVOR_ROLES).map((roleId) => [roleId, 0]));
}

function defaultBuffers() {
  return Object.fromEntries(RESOURCE_ORDER.map((resourceId) => [resourceId, 0]));
}

function defaultSettings() {
  return {
    tutorialHints: true,
    reducedMotion: false,
    briefStageCopy: false,
    confirmReset: true,
  };
}

function defaultRadioState() {
  return {
    investigation: "civic_band",
    traces: {
      civic_band: 0,
      tower_grid: 0,
      sublevel_echo: 0,
      anomaly_trace: 0,
    },
    resolved: [],
    lastSweep: null,
  };
}

function defaultTraderState() {
  return {
    offers: [],
    channel: "open_market",
    lastContact: null,
  };
}

function defaultWorkState() {
  return {
    activeJob: null,
  };
}

function roleSequenceFromAssigned(assigned) {
  const sequence = [];
  Object.keys(SURVIVOR_ROLES).forEach((roleId) => {
    const amount = Math.max(0, assigned?.[roleId] || 0);
    for (let index = 0; index < amount; index += 1) {
      sequence.push(roleId);
    }
  });
  return sequence;
}

function normalizeRosterMember(member, index, fallbackRole = "idle") {
  const traitIds = Object.keys(SURVIVOR_TRAITS);
  const safeRole = member?.role && (member.role === "idle" || SURVIVOR_ROLES[member.role]) ? member.role : fallbackRole;
  const fallbackName = SURVIVOR_NAME_POOL[index % SURVIVOR_NAME_POOL.length];
  const fallbackTrait = traitIds[index % traitIds.length];

  return {
    id: member?.id || `survivor-${index + 1}`,
    name: member?.name || fallbackName,
    traitId: SURVIVOR_TRAITS[member?.traitId] ? member.traitId : fallbackTrait,
    role: safeRole,
    wounded: typeof member?.wounded === "number" ? Math.max(0, member.wounded) : 0,
    stress: typeof member?.stress === "number" ? Math.max(0, member.stress) : 0,
  };
}

function createRoster(total, assigned = {}, existingRoster = []) {
  const roles = roleSequenceFromAssigned(assigned);
  const roster = [];

  for (let index = 0; index < total; index += 1) {
    roster.push(normalizeRosterMember(existingRoster[index], index, roles[index] || "idle"));
  }

  return roster;
}

function summarizeRoster(roster) {
  const assigned = defaultAssignedRoles();
  let idle = 0;

  roster.forEach((survivor) => {
    if (survivor.role && survivor.role !== "idle" && assigned[survivor.role] !== undefined) {
      assigned[survivor.role] += 1;
    } else {
      idle += 1;
    }
  });

  return {
    total: roster.length,
    idle,
    assigned,
  };
}

export function createInitialState() {
  return {
    version: CURRENT_VERSION,
    time: {
      day: 1,
      hour: 7,
    },
    condition: 78,
    resources: {
      scrap: 0,
      wood: 0,
      food: 0,
      water: 0,
      cloth: 0,
      fuel: 0,
      parts: 0,
      wire: 0,
      medicine: 0,
      ammo: 0,
      electronics: 0,
      chemicals: 0,
      morale: 0,
      reputation: 0,
      relics: 0,
    },
    discoveredResources: ["scrap"],
    unlockedSections: [],
    unlockedZones: [],
    upgrades: [],
    inventory: {},
    equipped: {
      weapon: null,
      armor: null,
      backpack: null,
    },
    survivors: {
      total: 0,
      idle: 0,
      assigned: defaultAssignedRoles(),
      roster: [],
    },
    shelter: {
      warmth: 0,
      threat: 0,
      noise: 0,
      damage: {},
      layout: {
        placed: {},
      },
    },
    story: {
      radioProgress: 0,
      secretProgress: 0,
    },
    stats: {
      searches: 0,
      scavengeSources: {},
      burnUses: 0,
      foodSearches: 0,
      expeditions: 0,
      combatsWon: 0,
      nightsSurvived: 0,
      radioScans: 0,
      traderRefreshes: 0,
      zonesVisited: 0,
    },
    flags: {
      burnUnlocked: false,
      firstNightResolved: false,
      worldReveal: false,
      bunkerRouteKnown: false,
    },
    trader: {
      ...defaultTraderState(),
    },
    faction: {
      aligned: null,
    },
    player: {
      username: "",
    },
    work: defaultWorkState(),
    radio: defaultRadioState(),
    buffers: {
      resources: defaultBuffers(),
      condition: 0,
    },
    clocks: {
      hunger: 0,
      thirst: 0,
      maintenance: 0,
    },
    night: {
      plan: "hold_fast",
      siegePressure: 0,
      breachCount: 0,
      lastReport: null,
    },
    expedition: {
      selectedZone: null,
      approach: "standard",
      objective: "salvage",
      lastRouteEvent: null,
      lastOutcome: null,
    },
    ui: {
      activeTab: "ops",
      inspectedStructure: "shelter_core",
      selectedStructureId: "shelter_core",
      pendingPlacementStructureId: null,
      notableFind: null,
      mobileMoreOpen: false,
      mobileResourceDrawerOpen: false,
      mobileShelterMode: "ops",
      mobileInspectorStructure: null,
    },
    settings: defaultSettings(),
    seenEvents: [],
    visitedZones: [],
    combat: null,
    log: [
      {
        stamp: "D1 07:00",
        text: "You wake in a room with one chair, one door, and too much silence outside.",
      },
      {
        stamp: "D1 07:00",
        text: "The radio on the floor is dead. The static in the walls is not.",
      },
    ],
  };
}

function normalizeActiveTab(rawTab) {
  if (!rawTab || typeof rawTab !== "string") {
    return "ops";
  }
  return LEGACY_TAB_MAP[rawTab] || rawTab;
}

function normalizePlacedLayout(state, fresh) {
  const rawPlaced = state.shelter?.layout?.placed && typeof state.shelter.layout.placed === "object"
    ? state.shelter.layout.placed
    : {};
  const normalizedExisting = Object.fromEntries(
    Object.entries(rawPlaced)
      .filter(([, position]) => position && Number.isFinite(position.x) && Number.isFinite(position.y))
      .map(([structureId, position]) => [structureId, { x: Number(position.x), y: Number(position.y) }]),
  );

  if ((state.version || 0) < CURRENT_VERSION) {
    return seedShelterPlacedLayout(
      Array.isArray(state.upgrades) ? state.upgrades : fresh.upgrades,
      normalizedExisting,
    );
  }

  return normalizedExisting;
}

function normalizeState(rawState) {
  const fresh = createInitialState();
  const state = rawState && typeof rawState === "object" ? rawState : {};
  const legacyRoster = Array.isArray(state.survivors?.roster) ? state.survivors.roster : [];
  const survivorTotal = Math.max(
    legacyRoster.length,
    Number.isFinite(state.survivors?.total) ? Math.max(0, state.survivors.total) : 0,
  );
  const roster = createRoster(survivorTotal, state.survivors?.assigned || {}, legacyRoster);
  const survivorSummary = summarizeRoster(roster);

  return {
    ...fresh,
    ...state,
    version: CURRENT_VERSION,
    time: { ...fresh.time, ...state.time },
    resources: { ...fresh.resources, ...state.resources },
    discoveredResources: Array.isArray(state.discoveredResources)
      ? [...new Set(state.discoveredResources)]
      : fresh.discoveredResources,
    unlockedSections: Array.isArray(state.unlockedSections)
      ? [...new Set(state.unlockedSections)]
      : fresh.unlockedSections,
    unlockedZones: Array.isArray(state.unlockedZones)
      ? [...new Set(state.unlockedZones)]
      : fresh.unlockedZones,
    upgrades: Array.isArray(state.upgrades) ? [...new Set(state.upgrades)] : fresh.upgrades,
    inventory: { ...fresh.inventory, ...state.inventory },
    equipped: { ...fresh.equipped, ...state.equipped },
    survivors: {
      ...fresh.survivors,
      ...state.survivors,
      ...survivorSummary,
      roster,
    },
    shelter: {
      ...fresh.shelter,
      ...state.shelter,
      damage: { ...fresh.shelter.damage, ...(state.shelter?.damage || {}) },
      layout: {
        placed: normalizePlacedLayout(state, fresh),
      },
    },
    story: { ...fresh.story, ...state.story },
    stats: { ...fresh.stats, ...state.stats },
    flags: { ...fresh.flags, ...state.flags },
    trader: { ...fresh.trader, ...state.trader },
    faction: { ...fresh.faction, ...state.faction },
    player: { ...fresh.player, ...state.player },
    radio: {
      ...fresh.radio,
      ...state.radio,
      traces: {
        ...fresh.radio.traces,
        ...(state.radio?.traces || {}),
      },
      resolved: Array.isArray(state.radio?.resolved) ? [...new Set(state.radio.resolved)] : fresh.radio.resolved,
    },
    work: {
      ...fresh.work,
      ...state.work,
      activeJob: state.work?.activeJob && typeof state.work.activeJob === "object"
        ? { ...state.work.activeJob }
        : null,
    },
    ui: {
      ...fresh.ui,
      ...state.ui,
      activeTab: normalizeActiveTab(state.ui?.activeTab),
      inspectedStructure: state.ui?.selectedStructureId || state.ui?.inspectedStructure || fresh.ui.inspectedStructure,
      selectedStructureId: state.ui?.selectedStructureId || state.ui?.inspectedStructure || fresh.ui.selectedStructureId,
      pendingPlacementStructureId: typeof state.ui?.pendingPlacementStructureId === "string"
        ? state.ui.pendingPlacementStructureId
        : null,
      mobileShelterMode: state.ui?.activeTab === "shelter_map"
        ? "map"
        : (state.ui?.mobileShelterMode || fresh.ui.mobileShelterMode),
    },
    settings: { ...fresh.settings, ...state.settings },
    night: { ...fresh.night, ...state.night },
    expedition: { ...fresh.expedition, ...state.expedition },
    buffers: {
      resources: {
        ...fresh.buffers.resources,
        ...(state.buffers?.resources || {}),
      },
      condition: typeof state.buffers?.condition === "number" ? state.buffers.condition : 0,
    },
    clocks: { ...fresh.clocks, ...state.clocks },
    seenEvents: Array.isArray(state.seenEvents) ? [...new Set(state.seenEvents)] : fresh.seenEvents,
    visitedZones: Array.isArray(state.visitedZones) ? [...new Set(state.visitedZones)] : fresh.visitedZones,
    combat: state.combat || null,
    log: Array.isArray(state.log) && state.log.length ? state.log.slice(0, 60) : fresh.log,
  };
}

export function loadState() {
  try {
    const serialized = window.localStorage.getItem(SAVE_KEY);
    if (!serialized) {
      return createInitialState();
    }

    return normalizeState(JSON.parse(serialized));
  } catch (_error) {
    return createInitialState();
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (_error) {
    // Allow play to continue even when the browser blocks local storage for local files.
  }
}

export function clearSave() {
  try {
    window.localStorage.removeItem(SAVE_KEY);
  } catch (_error) {
    // Ignore storage failures so reset can still rebuild in-memory state.
  }
}

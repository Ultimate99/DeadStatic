import {
  RESOURCE_ORDER,
  SAVE_KEY,
  SURVIVOR_NAME_POOL,
  SURVIVOR_ROLES,
  SURVIVOR_TRAITS,
} from "./data.js";

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
    version: 7,
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
    radio: defaultRadioState(),
    buffers: {
      resources: defaultBuffers(),
      condition: 0,
    },
    clocks: {
      hunger: 0,
      thirst: 0,
    },
    night: {
      plan: "hold_fast",
      lastReport: null,
    },
    expedition: {
      selectedZone: null,
      approach: "standard",
      objective: "salvage",
    },
    ui: {
      activeTab: "overview",
      inspectedStructure: "shelter_core",
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
    shelter: { ...fresh.shelter, ...state.shelter },
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
    ui: { ...fresh.ui, ...state.ui },
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

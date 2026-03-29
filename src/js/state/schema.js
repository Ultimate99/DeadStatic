import { RESOURCE_ORDER, SURVIVOR_ROLES } from "../data.js";

function defaultAssignedRoles() {
  return Object.fromEntries(Object.keys(SURVIVOR_ROLES).map((roleId) => [roleId, 0]));
}

function defaultBuffers() {
  return Object.fromEntries(RESOURCE_ORDER.map((resourceId) => [resourceId, 0]));
}

export function createInitialState() {
  return {
    version: 4,
    time: {
      day: 1,
      hour: 7,
    },
    condition: 78,
    resources: {
      scrap: 0,
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
      offers: [],
    },
    faction: {
      aligned: null,
    },
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
    },
    ui: {
      activeTab: "overview",
      inspectedStructure: "shelter_core",
      notableFind: null,
    },
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

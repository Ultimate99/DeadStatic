import { createInitialState } from "./schema.js";

export function migrateState(rawState) {
  const fresh = createInitialState();
  const state = rawState && typeof rawState === "object" ? rawState : {};

  return {
    ...fresh,
    ...state,
    version: fresh.version,
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
      assigned: {
        ...fresh.survivors.assigned,
        ...(state.survivors?.assigned || {}),
      },
    },
    shelter: { ...fresh.shelter, ...state.shelter },
    story: { ...fresh.story, ...state.story },
    stats: { ...fresh.stats, ...state.stats },
    flags: { ...fresh.flags, ...state.flags },
    trader: { ...fresh.trader, ...state.trader },
    faction: { ...fresh.faction, ...state.faction },
    ui: { ...fresh.ui, ...state.ui },
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

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

import { RARITY_ORDER, SAVE_KEY } from "../../src/js/data.js";
import { createInitialState, loadState } from "../../src/js/state.js";
import { SEARCH_LOOT_TABLE, UPGRADES_BY_ID } from "../../src/js/content.js";
import {
  attackCombat,
  advanceTime,
  braceCombat,
  chooseFaction,
  evaluateProgression,
  getActiveWorkJob,
  getAvailableScavengeSources,
  getAvailableTraderChannels,
  getDerivedState,
  getExpeditionPreview,
  getNightForecast,
  getRadioBoard,
  getShelterSystems,
  launchPreparedExpedition,
  prepareExpedition,
  recruitSurvivor,
  requestTraderChannel,
  runScavengeSource,
  scanRadio,
  searchRubble,
  startWorkJob,
  setExpeditionApproach,
  setExpeditionObjective,
  setNightPlan,
} from "../../src/js/engine.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(root, "..", "..");
const SEARCH_PATTERN = [0.2, 0.6, 0.3, 0.2, 0.55, 0.2, 0.1, 0.9, 0.3, 0.95];

function withRandomSequence(values, fn) {
  const originalRandom = Math.random;
  let index = 0;
  Math.random = () => {
    const value = values[index % values.length];
    index += 1;
    return value;
  };

  try {
    return fn();
  } finally {
    Math.random = originalRandom;
  }
}

class MockClassList {
  constructor() {
    this.values = new Set();
  }

  add(...tokens) {
    tokens.forEach((token) => this.values.add(token));
  }

  remove(...tokens) {
    tokens.forEach((token) => this.values.delete(token));
  }

  toggle(token, force) {
    if (typeof force === "boolean") {
      if (force) {
        this.values.add(token);
      } else {
        this.values.delete(token);
      }
      return force;
    }

    if (this.values.has(token)) {
      this.values.delete(token);
      return false;
    }

    this.values.add(token);
    return true;
  }
}

class MockElement {
  constructor(id = "") {
    this.id = id;
    this.innerHTML = "";
    this.textContent = "";
    this.dataset = {};
    this.classList = new MockClassList();
  }
}

function createBundleHarness(randomValues, options = {}) {
  const ids = [
    "autosave-status",
    "day-clock",
    "world-subtitle",
    "resource-bar",
    "mobile-survival-strip",
    "mobile-sheet-layer",
    "mobile-bottom-nav",
    "condition-readout",
    "condition-bar",
    "summary-strip",
    "combat-banner",
    "tab-bar",
    "tab-content",
    "ui-tooltip-root",
  ];
  const elements = new Map(ids.map((id) => [id, new MockElement(id)]));
  const bodyListeners = new Map();
  const body = new MockElement("body");
  body.addEventListener = (type, handler) => {
    bodyListeners.set(type, handler);
  };

  const document = {
    body,
    documentElement: { clientWidth: options.innerWidth || 1280 },
    getElementById(id) {
      if (!elements.has(id)) {
        elements.set(id, new MockElement(id));
      }
      return elements.get(id);
    },
    querySelectorAll() {
      return [];
    },
  };

  const storage = new Map();
  if (options.initialSave) {
    storage.set(SAVE_KEY, JSON.stringify(options.initialSave));
  }
  const localStorage = {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      storage.set(key, String(value));
    },
    removeItem(key) {
      storage.delete(key);
    },
  };

  let randomIndex = 0;
  const math = Object.create(Math);
  math.random = () => {
    const value = randomValues[randomIndex % randomValues.length];
    randomIndex += 1;
    return value;
  };

  const window = {
    document,
    localStorage,
    innerWidth: options.innerWidth || 1280,
    setInterval() {
      return 1;
    },
    addEventListener() {},
    confirm() {
      return true;
    },
  };

  const context = {
    console,
    document,
    window,
    Math: math,
  };
  context.globalThis = context;
  window.Math = math;

  return {
    context,
    elements,
    bodyListeners,
  };
}

const tests = [];

function run(name, fn) {
  tests.push({ name, fn });
}

run("search rubble yields tiered loot and discoveries", () => {
  const state = createInitialState();

  withRandomSequence(SEARCH_PATTERN, () => {
    for (let index = 0; index < 3; index += 1) {
      searchRubble(state);
    }
  });

  assert.ok(state.resources.scrap > 0);
  assert.ok(state.resources.wood >= 1);
  assert.ok(state.resources.wire >= 1);
  assert.ok(state.discoveredResources.includes("wood"));
  assert.ok(state.discoveredResources.includes("wire"));
  assert.equal(state.stats.scavengeSources.rubble, 3);
});

run("timed work queue gates backpack behind Sewing Kit and completes over time", () => {
  const state = createInitialState();
  state.stats.searches = 3;
  state.resources.scrap = 18;
  state.resources.cloth = 8;
  state.resources.wire = 2;

  evaluateProgression(state);
  assert.equal(startWorkJob(state, "backpack"), false);

  assert.equal(startWorkJob(state, "sewing_kit"), true);
  assert.ok(getActiveWorkJob(state));
  assert.ok(!state.upgrades.includes("sewing_kit"));
  assert.equal(state.inventory.sewing_kit || 0, 0);

  advanceTime(state, 3);
  assert.ok(state.upgrades.includes("sewing_kit"));
  assert.equal(state.inventory.sewing_kit, 1);
  assert.equal(getActiveWorkJob(state), null);

  state.resources.scrap += 4;
  assert.equal(startWorkJob(state, "backpack"), true);
  assert.ok(!state.upgrades.includes("backpack"));
  advanceTime(state, 1);
  assert.ok(state.upgrades.includes("backpack"));
  assert.equal(state.inventory.backpack, 1);
  assert.equal(state.equipped.backpack, "backpack");
});

run("one shared work slot blocks a second job until the first one completes", () => {
  const state = createInitialState();
  state.stats.searches = 4;
  state.resources.scrap = 28;
  state.resources.cloth = 5;
  state.resources.wood = 4;
  state.resources.parts = 8;
  state.resources.wire = 1;

  evaluateProgression(state);
  assert.equal(startWorkJob(state, "hammer_tool"), true);
  assert.equal(startWorkJob(state, "sewing_kit"), false);
  assert.equal(getActiveWorkJob(state)?.recipeId, "hammer_tool");

  advanceTime(state, 3);
  assert.equal(getActiveWorkJob(state), null);
  assert.ok(state.upgrades.includes("hammer_tool"));
  assert.equal(startWorkJob(state, "sewing_kit"), true);
});

run("advanced builds fail cleanly without the required tool", () => {
  const state = createInitialState();
  state.stats.searches = 5;
  state.upgrades = ["small_scavenge"];
  state.resources.scrap = 50;
  state.resources.wood = 8;
  state.resources.parts = 10;
  state.resources.wire = 2;

  evaluateProgression(state);
  assert.equal(startWorkJob(state, "crafting_bench"), false);

  state.inventory.hammer = 1;
  assert.equal(startWorkJob(state, "crafting_bench"), true);
});

run("starting a job spends resources upfront and grants output only on completion", () => {
  const state = createInitialState();
  state.stats.searches = 4;
  state.resources.scrap = 16;
  state.resources.cloth = 4;
  state.resources.wire = 1;

  evaluateProgression(state);
  assert.equal(startWorkJob(state, "sewing_kit"), true);
  assert.equal(state.resources.scrap, 10);
  assert.equal(state.inventory.sewing_kit || 0, 0);
  assert.ok(!state.upgrades.includes("sewing_kit"));

  advanceTime(state, 3);
  assert.ok(state.upgrades.includes("sewing_kit"));
  assert.equal(state.inventory.sewing_kit, 1);
});

run("rarity ladder extends above rare and loot table uses higher tiers", () => {
  assert.deepEqual(RARITY_ORDER.slice(0, 4), ["common", "uncommon", "rare", "epic"]);
  assert.ok(RARITY_ORDER.includes("legendary"));
  assert.ok(RARITY_ORDER.includes("anomalous"));
  assert.ok(RARITY_ORDER.includes("mythic"));
  assert.ok(SEARCH_LOOT_TABLE.some((entry) => entry.rarity === "epic"));
  assert.ok(SEARCH_LOOT_TABLE.some((entry) => entry.rarity === "legendary"));
  assert.ok(SEARCH_LOOT_TABLE.some((entry) => entry.rarity === "anomalous"));
  assert.ok(SEARCH_LOOT_TABLE.some((entry) => entry.rarity === "mythic"));
});

run("source-based scavenging lanes unlock and record distinct runs", () => {
  const state = createInitialState();

  assert.deepEqual(getAvailableScavengeSources(state).map((source) => source.id), ["rubble"]);

  state.stats.searches = 4;
  state.upgrades = ["food_search", "first_aid_rag", "radio_rig", "watch_post", "crafting_bench"];
  state.inventory.pry_bar = 1;
  evaluateProgression(state);

  const sourceIds = getAvailableScavengeSources(state).map((source) => source.id);
  assert.ok(sourceIds.includes("tree_line"));
  assert.ok(sourceIds.includes("vehicle_shells"));
  assert.ok(sourceIds.includes("dead_pantries"));
  assert.ok(sourceIds.includes("clinic_drawers"));
  assert.ok(sourceIds.includes("signal_wrecks"));
  assert.ok(sourceIds.includes("sealed_caches"));

  withRandomSequence([0.2, 0.7, 0.15, 0.8, 0.3, 0.6, 0.2], () => {
    runScavengeSource(state, "vehicle_shells");
  });

  assert.equal(state.stats.scavengeSources.vehicle_shells, 1);
  assert.ok(state.resources.parts >= 1);
});

run("tree line unlocks early as the dedicated wood lane", () => {
  const state = createInitialState();
  state.stats.searches = 4;
  evaluateProgression(state);

  const sourceIds = getAvailableScavengeSources(state).map((source) => source.id);
  assert.ok(sourceIds.includes("tree_line"));
  assert.ok(!sourceIds.includes("dead_pantries"));
});

run("shelter systems track power maintenance coverage and adjacency bonuses", () => {
  const state = createInitialState();
  state.upgrades = [
    "basic_barricade",
    "watch_post",
    "tripwire_grid",
    "crafting_bench",
    "repair_rig",
    "food_crate",
    "smokehouse",
    "rain_collector",
    "water_still",
    "radio_rig",
    "battery_bank",
    "flood_lights",
  ];
  state.shelter.damage = { basic_barricade: 1 };
  state.resources.wood = 12;
  state.resources.parts = 8;

  const derived = getDerivedState(state);
  const systems = getShelterSystems(state, derived);

  assert.ok(systems.powerSupply >= systems.powerDemand);
  assert.equal(systems.powerState, "stable");
  assert.ok(systems.coverage > 0.9);
  assert.ok(systems.maintenanceSupport >= 2);
  assert.ok(systems.maintenanceLoad > 0);
  assert.equal(systems.maintenanceState, "failing");
  assert.ok(systems.foodFlow > 0);
  assert.ok(systems.waterFlow > 0);
  assert.ok(systems.adjacency.some((entry) => entry.id === "food_line"));
  assert.ok(systems.adjacency.some((entry) => entry.id === "water_loop"));
  assert.ok(systems.adjacency.some((entry) => entry.id === "repair_line"));
  assert.ok(systems.adjacency.some((entry) => entry.id === "fence_watch"));
  assert.ok(systems.adjacency.some((entry) => entry.id === "lit_perimeter"));
  assert.ok(systems.adjacency.some((entry) => entry.id === "powered_signal"));
});

run("fortified shelter systems reduce siege and breach pressure", () => {
  const weakState = createInitialState();
  weakState.time.day = 6;
  weakState.time.hour = 18;
  weakState.shelter.threat = 8.8;
  weakState.shelter.noise = 7.6;
  weakState.shelter.warmth = 1;

  const strongState = createInitialState();
  strongState.time.day = 6;
  strongState.time.hour = 18;
  strongState.shelter.threat = 8.8;
  strongState.shelter.noise = 7.6;
  strongState.shelter.warmth = 3;
  strongState.upgrades = [
    "basic_barricade",
    "watch_post",
    "tripwire_grid",
    "flood_lights",
    "radio_rig",
    "battery_bank",
    "crafting_bench",
    "repair_rig",
  ];

  const weakForecast = getNightForecast(weakState);
  const strongForecast = getNightForecast(strongState);

  assert.ok(strongForecast.adjustedDefense > weakForecast.adjustedDefense);
  assert.ok(strongForecast.dangerScore < weakForecast.dangerScore);
});

run("prepared expeditions store route events and route outcomes", () => {
  const state = createInitialState();
  state.time.day = 2;
  state.unlockedZones = ["ruined_street"];
  state.resources.food = 10;
  state.resources.water = 10;
  state.resources.scrap = 20;
  state.resources.parts = 8;
  state.resources.fuel = 6;
  state.resources.medicine = 2;

  prepareExpedition(state, "ruined_street");
  setExpeditionApproach(state, "cautious");
  setExpeditionObjective(state, "provisions");

  withRandomSequence([0.1, 0.9, 0.99, 0.35, 0.45, 0.7, 0.4, 0.8], () => {
    assert.equal(launchPreparedExpedition(state), true);
  });

  assert.equal(state.expedition.lastRouteEvent?.id, "cold_pantry");
  assert.equal(state.expedition.lastOutcome?.zoneId, "ruined_street");
  assert.equal(state.expedition.lastOutcome?.routeEventId, "cold_pantry");
  assert.equal(state.expedition.lastOutcome?.objectiveId, "provisions");
  assert.ok(state.resources.food >= 10);
  assert.ok(state.resources.water >= 10);
});

run("save migration fills v6 defaults, migrates tabs, and seeds shelter layout", () => {
  const originalWindow = globalThis.window;
  globalThis.window = {
    localStorage: {
      getItem(key) {
        if (key !== SAVE_KEY) {
          return null;
        }
        return JSON.stringify({
          version: 1,
          upgrades: ["shelter_stash", "campfire"],
          ui: { activeTab: "shelter_map" },
          resources: { scrap: 5 },
          shelter: { warmth: 2 },
          log: [{ stamp: "D1 07:00", text: "old save line" }],
        });
      },
      setItem() {},
      removeItem() {},
    },
  };

  try {
    const state = loadState();
    assert.equal(state.night.plan, "hold_fast");
    assert.equal(state.expedition.approach, "standard");
    assert.equal(state.ui.activeTab, "base");
    assert.equal(state.ui.inspectedStructure, "shelter_core");
    assert.equal(state.ui.selectedStructureId, "shelter_core");
    assert.equal(state.ui.pendingPlacementStructureId, null);
    assert.equal(state.ui.placementPreview, null);
    assert.equal(state.ui.dragItemId, null);
    assert.equal(state.ui.dragItemType, null);
    assert.equal(state.ui.dragSource, null);
    assert.equal(state.ui.notableFind, null);
    assert.equal(state.ui.mobileMoreOpen, false);
    assert.equal(state.ui.mobileResourceDrawerOpen, false);
    assert.equal(state.ui.mobileShelterMode, "map");
    assert.equal(state.ui.mobileInspectorStructure, null);
    assert.equal(state.work.activeJob, null);
    assert.equal(state.equipped.backpack, null);
    assert.equal(state.resources.wood, 0);
    assert.deepEqual(state.shelter.damage, {});
    assert.ok(state.shelter.layout.placed.shelter_stash);
    assert.ok(state.shelter.layout.placed.campfire);
    assert.equal(state.settings.tutorialHints, true);
    assert.equal(state.player.username, "");
  } finally {
    if (typeof originalWindow === "undefined") {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }
  }
});

run("night forecast creates a report when time crosses into night", () => {
  const state = createInitialState();
  state.upgrades = ["shelter_stash", "basic_barricade", "watch_post"];
  state.unlockedSections = ["shelter"];
  state.survivors.total = 2;
  state.survivors.idle = 1;
  state.survivors.assigned.guard = 1;
  state.resources.scrap = 20;
  state.shelter.threat = 7;
  state.shelter.noise = 4.8;
  state.shelter.warmth = 1;
  state.time.hour = 20;

  const forecast = getNightForecast(state);
  assert.ok(forecast.dangerScore > 2);

  assert.equal(setNightPlan(state, "counter_watch"), true);
  withRandomSequence([0.1, 0.2, 0.4, 0.6, 0.8], () => {
    searchRubble(state);
  });

  assert.ok(state.night.lastReport);
  assert.ok(["quiet", "infected", "raiders", "breach", "siege"].includes(state.night.lastReport.eventType));
});

run("expedition planner previews and launches prepared routes", () => {
  const state = createInitialState();
  state.unlockedSections = ["map"];
  state.unlockedZones = ["ruined_street"];
  state.resources.food = 2;
  state.resources.water = 3;
  state.resources.fuel = 2;
  state.resources.ammo = 2;

  assert.equal(prepareExpedition(state, "ruined_street"), true);
  assert.equal(setExpeditionApproach(state, "cautious"), true);

  const preview = getExpeditionPreview(state, "ruined_street", "cautious");
  assert.equal(preview.hours, 3);
  assert.deepEqual(preview.cost, { food: 1, water: 1 });

  withRandomSequence([0.9, 0.4, 0.3, 0.2], () => {
    launchPreparedExpedition(state);
  });

  assert.equal(state.stats.expeditions, 1);
  assert.ok(state.visitedZones.includes("ruined_street"));
});

run("expedition objectives change preview pressure and can add signal traces", () => {
  const state = createInitialState();
  state.unlockedSections = ["map"];
  state.unlockedZones = ["ruined_street"];
  state.resources.food = 2;
  state.resources.water = 3;
  state.resources.fuel = 2;
  state.resources.ammo = 2;

  prepareExpedition(state, "ruined_street");
  setExpeditionObjective(state, "signal");
  const preview = getExpeditionPreview(state, "ruined_street", "standard", "signal");
  assert.equal(preview.objective.id, "signal");
  assert.ok(preview.encounterChance > 0.2);

  withRandomSequence([0.95, 0.4, 0.2, 0.3], () => {
    launchPreparedExpedition(state);
  });

  if (state.combat) {
    assert.ok((state.combat.rewards.radioTrace?.tower_grid || 0) > 0);
  } else {
    assert.ok((state.radio.traces.tower_grid || 0) > 0);
  }
});

run("base placement mode rejects overlap and exposes valid placement actions", () => {
  const bundle = readFileSync(path.join(projectRoot, "dist", "js", "game.js"), "utf8");
  const state = createInitialState();
  state.upgrades = ["shelter_stash", "campfire", "basic_barricade"];
  state.unlockedSections = ["shelter"];
  state.ui.activeTab = "base";
  state.ui.pendingPlacementStructureId = "campfire";
  state.shelter.layout.placed = { shelter_stash: { x: 4, y: 5 } };

  const harness = createBundleHarness(SEARCH_PATTERN, { initialSave: state });
  vm.runInNewContext(bundle, harness.context, { filename: "game.js" });
  const markup = harness.elements.get("tab-content").innerHTML;

  assert.match(markup, /data-action="place-structure"/);
  assert.match(markup, /data-structure="campfire"/);
  assert.match(markup, /base-board is-placement-armed/);
  assert.match(markup, /base-preview-layer/);
  assert.match(markup, /data-valid="true"/);
  assert.match(markup, /is-invalid/);
});

run("survivor recruitment now creates a roster with traited members", () => {
  const state = createInitialState();
  state.upgrades = ["survivor_cots"];
  state.unlockedSections = ["survivors"];
  state.resources.scrap = 40;
  state.resources.wood = 2;
  state.resources.food = 8;
  state.resources.water = 4;
  evaluateProgression(state);

  assert.equal(recruitSurvivor(state), true);
  assert.equal(state.survivors.total, 1);
  assert.equal(state.survivors.roster.length, 1);
  assert.ok(state.survivors.roster[0].traitId);
  assert.equal(state.survivors.roster[0].role, "idle");
});

run("crew upkeep consumes shelter food and drinkable water over time", () => {
  const state = createInitialState();
  state.upgrades = ["survivor_cots", "shelter_stash"];
  state.unlockedSections = ["shelter", "survivors"];
  state.survivors.total = 2;
  state.survivors.idle = 2;
  state.resources.food = 1;
  state.resources.water = 0;

  withRandomSequence([0.2, 0.3, 0.4, 0.5], () => {
    for (let index = 0; index < 6; index += 1) {
      searchRubble(state);
    }
  });

  assert.ok(state.condition < 78);
  assert.ok(state.resources.food <= 1);
  assert.ok(state.log.some((entry) => /drinkable water|food/i.test(entry.text)));
});

run("shelter systems calculate power, maintenance, and adjacency for deeper base play", () => {
  const state = createInitialState();
  state.upgrades = [
    "shelter_stash",
    "campfire",
    "basic_barricade",
    "crafting_bench",
    "repair_rig",
    "watch_post",
    "tripwire_grid",
    "radio_rig",
    "battery_bank",
    "food_crate",
    "smokehouse",
    "rain_collector",
    "water_still",
    "survivor_cots",
  ];
  state.unlockedSections = ["shelter", "survivors", "radio"];
  state.survivors.total = 3;
  state.survivors.idle = 1;
  state.survivors.assigned.guard = 1;
  state.survivors.assigned.medic = 1;
  state.survivors.assigned.tuner = 1;
  state.survivors.roster = [
    { id: "a", name: "A", role: "guard", traitId: "hard_case", wounded: 0, stress: 1 },
    { id: "b", name: "B", role: "medic", traitId: "patch_saint", wounded: 0, stress: 0 },
    { id: "c", name: "C", role: "tuner", traitId: "ghost_ear", wounded: 0, stress: 0 },
  ];
  evaluateProgression(state);

  const derived = getDerivedState(state);
  const systems = getShelterSystems(state, derived);

  assert.ok(systems.powerSupply >= systems.powerDemand);
  assert.ok(systems.coverage > 1);
  assert.ok(systems.maintenanceSupport > 0);
  assert.ok(systems.adjacency.some((entry) => entry.id === "repair_line"));
  assert.ok(systems.adjacency.some((entry) => entry.id === "food_line"));
  assert.ok(systems.adjacency.some((entry) => entry.id === "water_loop"));
});

run("directed radio investigations resolve milestones without relying on random key events", () => {
  const state = createInitialState();
  state.upgrades = ["radio_rig", "signal_decoder"];
  state.unlockedSections = ["radio"];
  state.resources.fuel = 10;
  state.resources.parts = 10;
  state.story.radioProgress = 2;
  state.radio.investigation = "sublevel_echo";

  withRandomSequence([0.1, 0.2, 0.3, 0.4], () => {
    scanRadio(state);
    scanRadio(state);
    scanRadio(state);
  });

  assert.ok(state.unlockedZones.includes("flooded_tunnel"));
  assert.ok(state.story.secretProgress >= 1);
});

run("radio board exposes resolved and next milestones for each investigation", () => {
  const state = createInitialState();
  state.upgrades = ["radio_rig", "signal_decoder"];
  state.unlockedSections = ["radio"];
  state.resources.fuel = 10;
  state.resources.parts = 10;
  state.story.radioProgress = 2;
  state.radio.investigation = "tower_grid";

  withRandomSequence([0.1, 0.2, 0.3, 0.4], () => {
    scanRadio(state);
    scanRadio(state);
  });

  const board = getRadioBoard(state);
  const tower = board.find((investigation) => investigation.id === "tower_grid");
  assert.ok(tower);
  assert.ok(tower.trace > 0);
  assert.ok(tower.totalMilestones >= 3);
  assert.ok(tower.resolvedCount >= 1);
});

run("expedition route events can modify outcomes and record last route pressure", () => {
  const state = createInitialState();
  state.unlockedSections = ["map", "radio"];
  state.unlockedZones = ["ruined_street"];
  state.resources.food = 4;
  state.resources.water = 5;
  state.resources.fuel = 4;
  state.resources.parts = 4;
  state.story.radioProgress = 2;

  prepareExpedition(state, "ruined_street");
  setExpeditionObjective(state, "signal");
  setExpeditionApproach(state, "standard");

  withRandomSequence([0.1, 0, 0.95, 0.4, 0.2, 0.3], () => {
    launchPreparedExpedition(state);
  });

  assert.ok(state.expedition.lastOutcome);
  assert.ok(state.expedition.lastRouteEvent);
  assert.ok((state.radio.traces.tower_grid || 0) > 0);
});

run("trade shifts from generic refreshes to faction channels", () => {
  const state = createInitialState();
  state.upgrades = ["trader_beacon"];
  state.unlockedSections = ["trader", "factions"];
  evaluateProgression(state);

  assert.deepEqual(getAvailableTraderChannels(state).map((channel) => channel.id), ["open_market"]);
  assert.equal(chooseFaction(state, "signal_hunters"), true);
  assert.ok(getAvailableTraderChannels(state).some((channel) => channel.id === "hunter_exchange"));
  assert.equal(requestTraderChannel(state, "hunter_exchange"), true);
  assert.ok(state.trader.offers.length > 0);
});

run("night escalation can injure or stress the crew when the shelter takes a siege", () => {
  const state = createInitialState();
  state.upgrades = ["shelter_stash", "campfire", "basic_barricade", "watch_post", "survivor_cots"];
  state.unlockedSections = ["shelter", "survivors"];
  state.survivors.total = 2;
  state.survivors.idle = 1;
  state.survivors.assigned.guard = 1;
  state.survivors.roster = [
    { id: "g", name: "Guard", role: "guard", traitId: "hard_case", wounded: 0, stress: 0 },
    { id: "i", name: "Idle", role: "idle", traitId: "quiet_hands", wounded: 0, stress: 0 },
  ];
  state.resources.scrap = 30;
  state.resources.wood = 10;
  state.resources.food = 6;
  state.resources.water = 6;
  state.shelter.threat = 9;
  state.shelter.noise = 6;
  state.shelter.warmth = 1;
  state.time.hour = 20;

  withRandomSequence([0.01, 0.01, 0.2, 0.3, 0.4, 0.5], () => {
    searchRubble(state);
  });

  assert.ok(state.night.lastReport);
  assert.ok(["siege", "breach", "raiders", "infected", "quiet"].includes(state.night.lastReport.eventType));
  assert.ok(state.survivors.roster.some((survivor) => survivor.wounded > 0 || survivor.stress > 0));
});

run("combat uses enemy intents and brace keeps the turn alive", () => {
  const state = createInitialState();
  state.combat = {
    enemyId: "screecher",
    zoneId: "ruined_street",
    enemyHp: 18,
    rewards: { resources: { scrap: 3 } },
    objectiveId: "sweep",
    turn: 1,
    intent: "shriek",
    brace: 0,
    grappled: false,
  };
  state.resources.ammo = 2;
  assert.ok(state.combat.intent);
  const previousCondition = state.condition;
  assert.equal(braceCombat(state), true);
  assert.ok(state.condition <= previousCondition);
  if (state.combat) {
    assert.equal(attackCombat(state), true);
  }
});

run("standalone build stays inline and bundled runtime renders tabs and actions", () => {
  const html = readFileSync(path.join(projectRoot, "dist", "index.html"), "utf8");
  const bundle = readFileSync(path.join(projectRoot, "dist", "js", "game.js"), "utf8");
  const harness = createBundleHarness(SEARCH_PATTERN);

  assert.match(html, /<style>/);
  assert.match(html, /<script>/);
  assert.doesNotMatch(html, /href="\.\/css\/ui\.css"/);
  assert.doesNotMatch(html, /src="\.\/js\/game\.js"/);

  vm.runInNewContext(bundle, harness.context, { filename: "game.js" });

  assert.match(html, /tabs-layout/);
  assert.match(bundle, /unequip-slot/);
  assert.match(bundle, /dragstart/);
  assert.match(bundle, /placementPreview/);
  assert.match(harness.elements.get("tab-bar").innerHTML, /Ops/);
  assert.match(harness.elements.get("tab-bar").innerHTML, /Survivor/);
  assert.match(harness.elements.get("tab-bar").innerHTML, /Log/);
  assert.match(harness.elements.get("tab-bar").innerHTML, /Help/);
  assert.match(harness.elements.get("tab-bar").innerHTML, /Settings/);
  assert.match(harness.elements.get("tab-content").innerHTML, /Current directive/);
  assert.match(harness.elements.get("tab-content").innerHTML, /Field lanes/);
  assert.match(harness.elements.get("tab-content").innerHTML, /Current directive/);
  assert.match(harness.elements.get("tab-content").innerHTML, /tab-stage-head/);
  assert.match(harness.elements.get("tab-content").innerHTML, /Search rubble/);
  assert.match(harness.elements.get("summary-strip").innerHTML, /Warmth/);
  assert.match(harness.elements.get("summary-strip").innerHTML, /Threat/);
  assert.match(harness.elements.get("tab-content").innerHTML, /New player guide/);
  assert.match(harness.elements.get("tab-content").innerHTML, /Set Username/);
  assert.match(harness.elements.get("tab-content").innerHTML, /Skip/);

  const clickHandler = harness.bodyListeners.get("click");
  assert.ok(clickHandler);

  for (let index = 0; index < 4; index += 1) {
    const fakeButton = {
      dataset: { action: "search-rubble" },
      closest() {
        return this;
      },
    };
    clickHandler({ target: fakeButton });
  }

  assert.match(harness.elements.get("resource-bar").innerHTML, /Cloth/);
  assert.match(harness.elements.get("resource-bar").innerHTML, /Wire/);
  assert.match(harness.elements.get("tab-bar").innerHTML, /Workshop/);
  assert.match(harness.elements.get("tab-content").innerHTML, /Field lanes/);
});

run("base tab renders placement board, structure rack, and inspector", () => {
  const bundle = readFileSync(path.join(projectRoot, "dist", "js", "game.js"), "utf8");
  const state = createInitialState();
  state.upgrades = [
    "shelter_stash",
    "campfire",
    "basic_barricade",
    "crafting_bench",
    "watch_post",
    "survivor_cots",
    "radio_rig",
    "smokehouse",
  ];
  evaluateProgression(state);
  state.ui.activeTab = "base";

  const harness = createBundleHarness(SEARCH_PATTERN, { initialSave: state });
  vm.runInNewContext(bundle, harness.context, { filename: "game.js" });

  const tabMarkup = harness.elements.get("tab-content").innerHTML;
  assert.match(harness.elements.get("tab-bar").innerHTML, /Base/);
  assert.match(tabMarkup, /Placement board/);
  assert.match(tabMarkup, /base-board/);
  assert.match(tabMarkup, /Structure inspector/);
  assert.match(tabMarkup, /Structure rack/);
  assert.match(tabMarkup, /Working Outpost/);
  assert.match(tabMarkup, /Gate/);
  assert.match(tabMarkup, /Watch Post/);
  assert.match(tabMarkup, /Smokehouse/);
  assert.match(tabMarkup, /base-grid-frame/);
  assert.match(tabMarkup, /base-grid-fence/);
  assert.match(tabMarkup, /inspect-structure/);
  assert.doesNotMatch(tabMarkup, /not built/);
});

run("log tab renders compact pulse rows instead of stretched tiles", () => {
  const bundle = readFileSync(path.join(projectRoot, "dist", "js", "game.js"), "utf8");
  const state = createInitialState();
  state.ui.activeTab = "log";
  state.log = [
    { stamp: "D1 07:10", text: "You pry copper wire from a collapsed kiosk.", category: "loot" },
    { stamp: "D1 07:16", text: "A crate wall is braced with rusted angle iron.", category: "build" },
    { stamp: "D1 07:42", text: "Something bumped the west fence after dark.", category: "night" },
    { stamp: "D1 08:02", text: "The receiver catches a clipped military carrier.", category: "radio" },
  ];

  const harness = createBundleHarness(SEARCH_PATTERN, { initialSave: state });
  vm.runInNewContext(bundle, harness.context, { filename: "game.js" });

  const tabMarkup = harness.elements.get("tab-content").innerHTML;
  assert.match(tabMarkup, /Archive/);
  assert.match(tabMarkup, /Patch notes/);
  assert.match(tabMarkup, /v6\.0/);
  assert.match(tabMarkup, /full-log/);
  assert.match(tabMarkup, /mini-log-line/);
});

run("radio tab renders the new receiver board and spectrum", () => {
  const bundle = readFileSync(path.join(projectRoot, "dist", "js", "game.js"), "utf8");
  const state = createInitialState();
  state.upgrades = ["radio_rig"];
  state.unlockedSections = ["radio"];
  state.story.radioProgress = 2;
  state.story.secretProgress = 1;
  state.resources.fuel = 2;
  state.resources.parts = 2;
  state.ui.activeTab = "radio";

  const harness = createBundleHarness(SEARCH_PATTERN, { initialSave: state });
  vm.runInNewContext(bundle, harness.context, { filename: "game.js" });

  const tabMarkup = harness.elements.get("tab-content").innerHTML;
  assert.match(tabMarkup, /Investigation wall/);
  assert.match(tabMarkup, /radio-node-grid/);
  assert.match(tabMarkup, /Sweep signal/);
  assert.match(tabMarkup, /tower_grid|Tower Grid/i);
  assert.match(tabMarkup, /set-radio-investigation/);
});

run("help and settings tabs render onboarding support surfaces", () => {
  const bundle = readFileSync(path.join(projectRoot, "dist", "js", "game.js"), "utf8");
  const helpState = createInitialState();
  helpState.ui.activeTab = "help";
  const helpHarness = createBundleHarness(SEARCH_PATTERN, { initialSave: helpState });
  vm.runInNewContext(bundle, helpHarness.context, { filename: "game.js" });
  const helpMarkup = helpHarness.elements.get("tab-content").innerHTML;
  assert.match(helpMarkup, /First 10 minutes/);
  assert.match(helpMarkup, /Core loop/);
  assert.match(helpMarkup, /build base/i);
  assert.match(helpMarkup, /Workshop/);

  const settingsState = createInitialState();
  settingsState.ui.activeTab = "settings";
  const settingsHarness = createBundleHarness(SEARCH_PATTERN, { initialSave: settingsState });
  vm.runInNewContext(bundle, settingsHarness.context, { filename: "game.js" });
  const settingsMarkup = settingsHarness.elements.get("tab-content").innerHTML;
  assert.match(settingsMarkup, /Profile/);
  assert.match(settingsMarkup, /Username/);
  assert.match(settingsMarkup, /Tutorial hints/);
  assert.match(settingsMarkup, /Compact stage copy/);
});

run("mobile shell renders bottom nav, compact tutorial, and sticky survival strip", () => {
  const bundle = readFileSync(path.join(projectRoot, "dist", "js", "game.js"), "utf8");
  const state = createInitialState();
  state.stats.searches = 4;
  state.flags.burnUnlocked = true;
  state.resources.scrap = 18;
  state.resources.cloth = 2;
  state.resources.wire = 1;
  state.discoveredResources = ["scrap", "cloth", "wire", "food", "water"];
  state.unlockedSections = ["upgrades", "shelter", "map", "survivors", "radio", "trader", "factions"];
  state.unlockedZones = ["ruined_street"];

  const harness = createBundleHarness(SEARCH_PATTERN, { initialSave: state, innerWidth: 390 });
  vm.runInNewContext(bundle, harness.context, { filename: "game.js" });

  const mobileNav = harness.elements.get("mobile-bottom-nav").innerHTML;
  const mobileStrip = harness.elements.get("mobile-survival-strip").innerHTML;
  const tabMarkup = harness.elements.get("tab-content").innerHTML;

  assert.match(mobileNav, /Ops/);
  assert.match(mobileNav, /Workshop/);
  assert.match(mobileNav, /Base/);
  assert.match(mobileNav, /Routes/);
  assert.match(mobileNav, /More/);
  assert.match(mobileStrip, /Condition/);
  assert.match(mobileStrip, /More/);
  assert.match(tabMarkup, /tutorial-strip/);
  assert.match(tabMarkup, /Skip/);
  assert.match(tabMarkup, /tab-stage-head/);
});

run("mobile more sheet exposes secondary screens without shelter map", () => {
  const bundle = readFileSync(path.join(projectRoot, "dist", "js", "game.js"), "utf8");
  const state = createInitialState();
  state.unlockedSections = ["upgrades", "inventory", "shelter", "map", "survivors", "radio"];
  state.ui.mobileMoreOpen = true;

  const harness = createBundleHarness(SEARCH_PATTERN, { initialSave: state, innerWidth: 390 });
  vm.runInNewContext(bundle, harness.context, { filename: "game.js" });

  const sheetMarkup = harness.elements.get("mobile-sheet-layer").innerHTML;
  assert.match(sheetMarkup, /Survivor/);
  assert.match(sheetMarkup, /Crew/);
  assert.match(sheetMarkup, /Radio/);
  assert.match(sheetMarkup, /Board/);
  assert.match(sheetMarkup, /Log/);
  assert.match(sheetMarkup, /Help/);
  assert.match(sheetMarkup, /Settings/);
});

run("mobile base view keeps segmented ops and grid modes", () => {
  const bundle = readFileSync(path.join(projectRoot, "dist", "js", "game.js"), "utf8");
  const state = createInitialState();
  state.upgrades = ["shelter_stash", "campfire", "basic_barricade", "watch_post"];
  state.unlockedSections = ["shelter"];
  state.ui.activeTab = "base";
  state.ui.mobileShelterMode = "map";
  state.ui.mobileInspectorStructure = "campfire";
  state.ui.selectedStructureId = "campfire";
  state.shelter.damage = { campfire: 2 };
  state.resources.scrap = 20;

  const harness = createBundleHarness(SEARCH_PATTERN, { initialSave: state, innerWidth: 390 });
  vm.runInNewContext(bundle, harness.context, { filename: "game.js" });

  const tabMarkup = harness.elements.get("tab-content").innerHTML;
  assert.match(tabMarkup, /mobile-segmented-control/);
  assert.match(tabMarkup, /Ops/);
  assert.match(tabMarkup, /Grid/);
  assert.match(tabMarkup, /Placement board/);
  assert.match(tabMarkup, /Structure inspector/);
  assert.match(tabMarkup, /Campfire/);
  assert.equal(harness.elements.get("tab-content").dataset.tab, "base");
});

run("survivor tab renders loadout, field stats, and compact inventory grids", () => {
  const bundle = readFileSync(path.join(projectRoot, "dist", "js", "game.js"), "utf8");
  const state = createInitialState();
  state.ui.activeTab = "survivor";
  state.unlockedSections = ["inventory", "shelter", "survivors"];
  state.inventory.rusty_knife = 1;
  state.inventory.backpack = 1;
  state.inventory.first_aid_rag = 1;
  state.inventory.pry_bar = 1;
  state.equipped.weapon = "rusty_knife";
  state.equipped.backpack = "backpack";
  state.resources.ammo = 3;

  const harness = createBundleHarness(SEARCH_PATTERN, { initialSave: state });
  vm.runInNewContext(bundle, harness.context, { filename: "game.js" });
  const markup = harness.elements.get("tab-content").innerHTML;

  assert.match(markup, /Loadout/);
  assert.match(markup, /Field stats/);
  assert.match(markup, /Tool Belt/);
  assert.match(markup, /Gear Locker/);
  assert.match(markup, /Field Supplies/);
  assert.match(markup, /Weapons/);
  assert.match(markup, /Tools/);
  assert.match(markup, /Rusty Knife/);
  assert.match(markup, /Backpack/);
  assert.match(markup, /Pry Bar/);
  assert.match(markup, /data-slot="weapon"/);
  assert.match(markup, /draggable="true"/);
  assert.match(markup, /Unequip/);
  assert.match(markup, /data-tooltip=/);
});

run("workshop tab renders work queue, categories, time, tool, and tier", () => {
  const bundle = readFileSync(path.join(projectRoot, "dist", "js", "game.js"), "utf8");
  const state = createInitialState();
  state.ui.activeTab = "workshop";
  state.stats.searches = 5;
  state.resources.scrap = 26;
  state.resources.cloth = 6;
  state.resources.parts = 8;
  state.resources.wire = 2;
  state.inventory.sharp_metal = 1;
  state.inventory.sewing_kit = 1;
  state.upgrades = ["sewing_kit"];
  state.unlockedSections = ["upgrades"];

  const harness = createBundleHarness(SEARCH_PATTERN, { initialSave: state });
  vm.runInNewContext(bundle, harness.context, { filename: "game.js" });
  const markup = harness.elements.get("tab-content").innerHTML;

  assert.match(markup, /Work in Progress/);
  assert.match(markup, /Base Builds/);
  assert.match(markup, /Tools/);
  assert.match(markup, /Weapons/);
  assert.match(markup, /Armor/);
  assert.match(markup, /Consumables/);
  assert.match(markup, /Backpack/);
  assert.match(markup, /Sewing Kit/);
  assert.match(markup, /data-tooltip=/);
  assert.match(markup, /time 1h/);
  assert.match(markup, /tool Sewing Kit/);
  assert.match(markup, /tier field/);
  assert.match(markup, /start-work-job/);
});

run("non-defense support builds do not report fake defense bonuses", () => {
  assert.equal(UPGRADES_BY_ID.campfire.effects.defense, undefined);
  assert.equal(UPGRADES_BY_ID.shelter_stash.effects.defense, undefined);
  assert.equal(UPGRADES_BY_ID.weapon_rack.effects.attack, undefined);
  assert.equal(UPGRADES_BY_ID.armor_hooks.effects.defense, undefined);
  assert.equal(UPGRADES_BY_ID.flood_lights.effects.defense, undefined);
});

let failures = 0;

for (const { name, fn } of tests) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${name}`);
    console.error(error);
  }
}

if (failures > 0) {
  process.exitCode = 1;
} else {
  console.log(`QA passed: ${tests.length} checks`);
}

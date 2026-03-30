import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

import { RARITY_ORDER, SAVE_KEY } from "../../src/js/data.js";
import { createInitialState, loadState } from "../../src/js/state.js";
import { SEARCH_LOOT_TABLE } from "../../src/js/content.js";
import {
  attackCombat,
  braceCombat,
  buyUpgrade,
  chooseFaction,
  evaluateProgression,
  getAvailableScavengeSources,
  getAvailableTraderChannels,
  getExpeditionPreview,
  getNightForecast,
  launchPreparedExpedition,
  prepareExpedition,
  recruitSurvivor,
  requestTraderChannel,
  runScavengeSource,
  scanRadio,
  searchRubble,
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

run("backpack respects cloth requirement before it can be built", () => {
  const state = createInitialState();
  state.stats.searches = 3;
  state.resources.scrap = 7;

  evaluateProgression(state);
  assert.equal(buyUpgrade(state, "backpack"), false);

  state.resources.scrap = 8;
  state.resources.cloth = 3;
  assert.equal(buyUpgrade(state, "backpack"), true);
  assert.ok(state.upgrades.includes("backpack"));
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

run("save migration fills new night, expedition, and inspector defaults", () => {
  const originalWindow = globalThis.window;
  globalThis.window = {
    localStorage: {
      getItem(key) {
        if (key !== SAVE_KEY) {
          return null;
        }
        return JSON.stringify({
          version: 1,
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
    assert.equal(state.ui.inspectedStructure, "shelter_core");
    assert.equal(state.ui.notableFind, null);
    assert.equal(state.ui.mobileMoreOpen, false);
    assert.equal(state.ui.mobileResourceDrawerOpen, false);
    assert.equal(state.ui.mobileShelterMode, "ops");
    assert.equal(state.ui.mobileInspectorStructure, null);
    assert.equal(state.resources.wood, 0);
    assert.deepEqual(state.shelter.damage, {});
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
  assert.ok(["quiet", "infected", "raiders", "breach"].includes(state.night.lastReport.eventType));
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

  assert.ok((state.radio.traces.tower_grid || 0) > 0);
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
  assert.match(harness.elements.get("tab-bar").innerHTML, /Overview/);
  assert.match(harness.elements.get("tab-bar").innerHTML, /Log/);
  assert.match(harness.elements.get("tab-bar").innerHTML, /Help/);
  assert.match(harness.elements.get("tab-bar").innerHTML, /Settings/);
  assert.match(harness.elements.get("tab-content").innerHTML, /Operations desk/);
  assert.match(harness.elements.get("tab-content").innerHTML, /Current directive/);
  assert.match(harness.elements.get("tab-content").innerHTML, /stage-banner/);
  assert.match(harness.elements.get("tab-content").innerHTML, /Search rubble/);
  assert.match(harness.elements.get("summary-strip").innerHTML, /Heat line/);
  assert.match(harness.elements.get("summary-strip").innerHTML, /Outside threat/);
  assert.match(harness.elements.get("tab-content").innerHTML, /New player guide/);
  assert.match(harness.elements.get("tab-content").innerHTML, /Set Username/);
  assert.match(harness.elements.get("tab-content").innerHTML, /Skip tutorial/);

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
  assert.match(harness.elements.get("tab-bar").innerHTML, /Craft/);
  assert.match(harness.elements.get("tab-content").innerHTML, /Strip vehicle shells/);
});

run("shelter map tab renders a visual outpost that upgrades with built structures", () => {
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
  state.ui.activeTab = "shelter_map";

  const harness = createBundleHarness(SEARCH_PATTERN, { initialSave: state });
  vm.runInNewContext(bundle, harness.context, { filename: "game.js" });

  const tabMarkup = harness.elements.get("tab-content").innerHTML;
  assert.match(harness.elements.get("tab-bar").innerHTML, /Shelter Map/);
  assert.match(tabMarkup, /Shelter map/);
  assert.match(tabMarkup, /shelter-map/);
  assert.match(tabMarkup, /Structure inspector/);
  assert.match(tabMarkup, /District ledger/);
  assert.match(tabMarkup, /Working Outpost/);
  assert.match(tabMarkup, /Perimeter Fence/);
  assert.match(tabMarkup, /Watch Post/);
  assert.match(tabMarkup, /Smokehouse/);
  assert.match(tabMarkup, /map-compound-floor/);
  assert.match(tabMarkup, /fence-segment/);
  assert.match(tabMarkup, /inspect-structure/);
  assert.doesNotMatch(tabMarkup, /map-legend/);
  assert.doesNotMatch(tabMarkup, /sector-core/);
  assert.doesNotMatch(tabMarkup, /map-road/);
  assert.doesNotMatch(tabMarkup, /not built/);
  assert.doesNotMatch(tabMarkup, /is-empty/);
  assert.doesNotMatch(tabMarkup, /Living row/);
  assert.doesNotMatch(tabMarkup, /Yard line/);
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
  assert.match(tabMarkup, /Event pulse/);
  assert.match(tabMarkup, /Patch notes/);
  assert.match(tabMarkup, /log-pulse-stack/);
  assert.match(tabMarkup, /log-pulse-row/);
  assert.doesNotMatch(tabMarkup, /log-pulse-grid/);
  assert.doesNotMatch(tabMarkup, /log-pulse-card/);
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
  assert.match(tabMarkup, /Receiver board/);
  assert.match(tabMarkup, /signal-spectrum/);
  assert.match(tabMarkup, /Anomaly trace/);
  assert.match(tabMarkup, /trace-node/);
  assert.match(tabMarkup, /Investigations/);
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
  assert.match(helpMarkup, /Combat quick guide/);

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

  assert.match(mobileNav, /Overview/);
  assert.match(mobileNav, /Craft/);
  assert.match(mobileNav, /Shelter/);
  assert.match(mobileNav, /Map/);
  assert.match(mobileNav, /More/);
  assert.doesNotMatch(mobileNav, /Shelter Map/);
  assert.match(mobileStrip, /Condition/);
  assert.match(mobileStrip, /More/);
  assert.match(tabMarkup, /tutorial-strip-mobile/);
  assert.match(tabMarkup, /Skip/);
  assert.match(tabMarkup, /mobile-stage-info/);
});

run("mobile more sheet exposes secondary screens without shelter map", () => {
  const bundle = readFileSync(path.join(projectRoot, "dist", "js", "game.js"), "utf8");
  const state = createInitialState();
  state.unlockedSections = ["upgrades", "inventory", "shelter", "map", "survivors", "radio"];
  state.ui.mobileMoreOpen = true;

  const harness = createBundleHarness(SEARCH_PATTERN, { initialSave: state, innerWidth: 390 });
  vm.runInNewContext(bundle, harness.context, { filename: "game.js" });

  const sheetMarkup = harness.elements.get("mobile-sheet-layer").innerHTML;
  assert.match(sheetMarkup, /Inventory/);
  assert.match(sheetMarkup, /Crew/);
  assert.match(sheetMarkup, /Radio/);
  assert.match(sheetMarkup, /Leaderboard/);
  assert.match(sheetMarkup, /Log/);
  assert.match(sheetMarkup, /Help/);
  assert.match(sheetMarkup, /Settings/);
  assert.doesNotMatch(sheetMarkup, /Trade/);
  assert.doesNotMatch(sheetMarkup, /Factions/);
  assert.doesNotMatch(sheetMarkup, /Shelter Map/);
});

run("mobile shelter view folds shelter map into segmented ops and map modes", () => {
  const bundle = readFileSync(path.join(projectRoot, "dist", "js", "game.js"), "utf8");
  const state = createInitialState();
  state.upgrades = ["shelter_stash", "campfire", "basic_barricade", "watch_post"];
  state.unlockedSections = ["shelter"];
  state.ui.activeTab = "shelter_map";
  state.ui.mobileShelterMode = "map";
  state.ui.mobileInspectorStructure = "campfire";
  state.shelter.damage = { campfire: 2 };
  state.resources.scrap = 20;

  const harness = createBundleHarness(SEARCH_PATTERN, { initialSave: state, innerWidth: 390 });
  vm.runInNewContext(bundle, harness.context, { filename: "game.js" });

  const tabMarkup = harness.elements.get("tab-content").innerHTML;
  assert.match(tabMarkup, /mobile-segmented-control/);
  assert.match(tabMarkup, /Ops/);
  assert.match(tabMarkup, /Map/);
  assert.match(tabMarkup, /Shelter map/);
  assert.match(tabMarkup, /Tap a structure/);
  assert.match(tabMarkup, /mobile-structure-sheet/);
  assert.match(tabMarkup, /Campfire/);
  assert.equal(harness.elements.get("tab-content").dataset.tab, "shelter");
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

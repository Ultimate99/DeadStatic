import assert from "node:assert/strict";

import { RARITY_ORDER } from "../../../src/js/data.js";
import { SEARCH_LOOT_TABLE } from "../../../src/js/content/loot.js";
import { createInitialState, loadState } from "../../../src/js/state/index.js";
import { buyUpgrade } from "../../../src/js/engine/crafting.js";
import { getAvailableScavengeSources } from "../../../src/js/engine/shared.js";
import { runScavengeSource, searchRubble } from "../../../src/js/engine/scavenge.js";
import { withRandomSequence, SEARCH_PATTERN } from "../helpers/harness.mjs";

export function registerScavengeTests(run) {
  run("search rubble yields tiered loot and discoveries", () => {
    const state = createInitialState();

    withRandomSequence(SEARCH_PATTERN, () => {
      for (let index = 0; index < 3; index += 1) {
        searchRubble(state);
      }
    });

    assert.ok(state.resources.scrap > 0);
    assert.ok(state.resources.cloth >= 1);
    assert.ok(state.resources.wire >= 1);
    assert.ok((state.inventory.sharp_metal || 0) >= 1);
    assert.ok(state.discoveredResources.includes("cloth"));
    assert.ok(state.discoveredResources.includes("wire"));
    assert.equal(state.stats.scavengeSources.rubble, 3);
  });

  run("backpack respects cloth requirement before it can be built", () => {
    const state = createInitialState();
    state.stats.searches = 3;
    state.resources.scrap = 4;

    assert.equal(buyUpgrade(state, "backpack"), false);

    state.resources.cloth = 2;
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
        getItem() {
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
      assert.deepEqual(state.shelter.damage, {});
    } finally {
      if (typeof originalWindow === "undefined") {
        delete globalThis.window;
      } else {
        globalThis.window = originalWindow;
      }
    }
  });
}

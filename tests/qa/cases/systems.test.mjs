import assert from "node:assert/strict";

import { createInitialState } from "../../../src/js/state/index.js";
import { setNightPlan, getNightForecast } from "../../../src/js/engine/night.js";
import { prepareExpedition, setExpeditionApproach, getExpeditionPreview, launchPreparedExpedition } from "../../../src/js/engine/expeditions.js";
import { searchRubble } from "../../../src/js/engine/scavenge.js";
import { withRandomSequence } from "../helpers/harness.mjs";

export function registerSystemsTests(run) {
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
}

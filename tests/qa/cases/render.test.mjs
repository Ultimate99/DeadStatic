import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

import { createInitialState } from "../../../src/js/state/index.js";
import { evaluateProgression } from "../../../src/js/engine/shared.js";
import { createBundleHarness, SEARCH_PATTERN } from "../helpers/harness.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(root, "..", "..", "..");

export function registerRenderTests(run) {
  run("standalone build stays inline and bundled runtime renders tabs and actions", () => {
    const html = readFileSync(path.join(projectRoot, "dist", "index.html"), "utf8");
    const bundle = readFileSync(path.join(projectRoot, "dist", "js", "game.js"), "utf8");
    const harness = createBundleHarness(SEARCH_PATTERN);

    assert.match(html, /<style>/);
    assert.match(html, /<script>/);
    assert.match(html, /viewport-fit=cover/);
    assert.match(html, /theme-color/);
    assert.match(html, /DEAD_STATIC_CONFIG/);
    assert.match(html, /site\.webmanifest/);
    assert.match(html, /apple-touch-icon/);
    assert.match(html, /social-card\.png/);
    assert.doesNotMatch(html, /href="\.\/css\/ui\.css"/);
    assert.doesNotMatch(html, /src="\.\/js\/game\.js"/);
    assert.equal(existsSync(path.join(projectRoot, "dist", "site.webmanifest")), true);
    assert.equal(existsSync(path.join(projectRoot, "dist", "assets", "favicon.svg")), true);

    vm.runInNewContext(bundle, harness.context, { filename: "game.js" });

    assert.match(html, /tabs-layout/);
    assert.match(harness.elements.get("tab-bar").innerHTML, /Overview/);
    assert.match(harness.elements.get("tab-bar").innerHTML, /Log/);
    assert.match(harness.elements.get("tab-content").innerHTML, /Operations desk/);
    assert.match(harness.elements.get("tab-content").innerHTML, /Current directive/);
    assert.match(harness.elements.get("tab-content").innerHTML, /stage-banner/);
    assert.match(harness.elements.get("tab-content").innerHTML, /Search rubble/);

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
    assert.match(tabMarkup, /Global leaderboard/);
    assert.match(tabMarkup, /Set callsign/);
    assert.match(tabMarkup, /Save transfer/);
    assert.match(tabMarkup, /Download save file/);
    assert.match(tabMarkup, /Paste save code/);
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
    assert.match(tabMarkup, /Transmission notes/);
  });
}

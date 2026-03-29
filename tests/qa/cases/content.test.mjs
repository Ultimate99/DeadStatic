import assert from "node:assert/strict";

import { collectContentValidationErrors, validateContentGraph } from "../../../scripts/build/content-validation.mjs";

export function registerContentTests(run) {
  run("content graph validates with no broken references", () => {
    const errors = collectContentValidationErrors();
    assert.deepEqual(errors, []);
  });

  run("content validator returns a usable summary", () => {
    const summary = validateContentGraph();
    assert.ok(summary.upgrades >= 20);
    assert.ok(summary.items >= 15);
    assert.ok(summary.zones >= 6);
    assert.ok(summary.events >= 25);
  });
}

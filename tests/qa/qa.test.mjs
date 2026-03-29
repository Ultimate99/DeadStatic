import { registerContentTests } from "./cases/content.test.mjs";
import { registerRenderTests } from "./cases/render.test.mjs";
import { registerScavengeTests } from "./cases/scavenge.test.mjs";
import { registerSystemsTests } from "./cases/systems.test.mjs";

const tests = [];

function run(name, fn) {
  tests.push({ name, fn });
}

registerContentTests(run);
registerScavengeTests(run);
registerSystemsTests(run);
registerRenderTests(run);

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

import { validateContentGraph } from "./content-validation.mjs";

try {
  const summary = validateContentGraph();
  console.log(`Content graph valid: ${summary.upgrades} upgrades, ${summary.items} items, ${summary.zones} zones, ${summary.events} events.`);
} catch (error) {
  console.error(error.message);
  (error.validationErrors || []).forEach((message) => {
    console.error(`  - ${message}`);
  });
  process.exitCode = 1;
}

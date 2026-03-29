import {
  canAfford,
  getAvailableScavengeSources,
  getExpeditionPreview,
  getStructureDamage,
  getVisibleUpgrades,
  hasMaterials,
} from "../engine.js";
import {
  getBuiltShelterStructures,
  getOutpostStage,
  getShelterMapPerimeter,
  SHELTER_MAP_ANNEXES,
  structureKey,
} from "./shelter-map.js";

function tabStageMeta(state, derived) {
  const visibleUpgrades = getVisibleUpgrades(state).filter((upgrade) => !state.upgrades.includes(upgrade.id));
  const readyUpgrades = visibleUpgrades.filter((upgrade) => canAfford(state, upgrade.cost) && hasMaterials(state, upgrade.materials));
  const preview = state.expedition.selectedZone
    ? getExpeditionPreview(state, state.expedition.selectedZone, state.expedition.approach)
    : null;
  const perimeter = getShelterMapPerimeter(state);
  const builtStructures = getBuiltShelterStructures(state);
  const activeCount = builtStructures.length + (perimeter ? 1 : 0);

  switch (state.ui.activeTab) {
    case "craft":
      return {
        label: "Build queue",
        title: "Convert salvage into systems",
        detail: "Craft is now the main pressure release. Ready systems should be installed fast; blocked ones tell you what to hunt next.",
        stats: [
          ["Ready", readyUpgrades.length],
          ["Blocked", Math.max(0, visibleUpgrades.length - readyUpgrades.length)],
          ["Built", state.upgrades.length],
          ["Lanes", getAvailableScavengeSources(state).length],
        ],
      };
    case "inventory":
      return {
        label: "Stores",
        title: "Everything you can still carry",
        detail: "Keep loadout, field supplies, and strange salvage separate so decisions stay clean under pressure.",
        stats: [
          ["Weapon", state.equipped.weapon ? "set" : "none"],
          ["Armor", state.equipped.armor ? "set" : "none"],
          ["Items", Object.values(state.inventory).reduce((sum, amount) => sum + amount, 0)],
          ["Ammo", state.resources.ammo],
        ],
      };
    case "shelter":
      return {
        label: "Survival board",
        title: "Hold the room through another night",
        detail: "Warmth, threat, noise, and food all pull against each other here. The shelter tab is where survival decisions stay immediate.",
        stats: [
          ["Warmth", state.shelter.warmth.toFixed(1)],
          ["Threat", state.shelter.threat.toFixed(1)],
          ["Noise", state.shelter.noise.toFixed(1)],
          ["Defense", derived.defense],
        ],
      };
    case "shelter_map":
      return {
        label: "Compound view",
        title: "Read the outpost like a living machine",
        detail: "The map should show footprint, districts, damage, and future work without burying the actual compound shape.",
        stats: [
          ["Stage", getOutpostStage(activeCount)],
          ["Built", activeCount],
          ["Annexes", SHELTER_MAP_ANNEXES.filter((entry) => state.upgrades.includes(entry.upgrade)).length],
          ["Integrity", builtStructures.filter((structure) => getStructureDamage(state, structureKey(structure)) >= 2).length || "stable"],
        ],
      };
    case "map":
      return {
        label: "Route board",
        title: "Stage the next push before you leave",
        detail: "Zones are no longer simple buttons. Travel posture, encounter odds, and supply burn now matter before the first step.",
        stats: [
          ["Zones", state.unlockedZones.length],
          ["Prepared", preview ? preview.zone.name : "none"],
          ["Approach", preview ? preview.approach.label : "unset"],
          ["Runs", state.stats.expeditions],
        ],
      };
    case "survivors":
      return {
        label: "Crew line",
        title: "Every body in the shelter changes the equation",
        detail: "Survivors are now a visible staffing problem, not just a count. Each role should explain why it matters.",
        stats: [
          ["Total", state.survivors.total],
          ["Idle", state.survivors.idle],
          ["Morale", state.resources.morale],
          ["Cap", derived.survivorCap],
        ],
      };
    case "radio":
      return {
        label: "Signal board",
        title: "The static is no longer background noise",
        detail: "This screen now reads like a live receiver desk. Signal depth, trace heat, and impossible fragments should feel wrong in a useful way.",
        stats: [
          ["Signal", state.story.radioProgress],
          ["Secret", state.story.secretProgress],
          ["Scans", state.stats.radioScans],
          ["Reveal", state.flags.worldReveal ? "partial" : "unknown"],
        ],
      };
    case "trade":
      return {
        label: "Market",
        title: "What the wasteland will still trade for",
        detail: "This is the pragmatic layer: turn spare resources into missing gear without losing the shape of your economy.",
        stats: [
          ["Offers", state.trader.offers.length],
          ["Scrap", state.resources.scrap],
          ["Rep", state.resources.reputation],
          ["Fuel", state.resources.fuel],
        ],
      };
    case "factions":
      return {
        label: "Alignment",
        title: "Choose who gets to shape the signal",
        detail: "Faction choice is a worldview decision disguised as survival pragmatism. The UI should make that feel weighty, not checkbox-like.",
        stats: [
          ["Aligned", state.faction.aligned || "none"],
          ["Rep", state.resources.reputation],
          ["Signal", state.story.radioProgress],
          ["Relics", state.resources.relics],
        ],
      };
    case "log":
      return {
        label: "Archive",
        title: "Track what the static has already taken",
        detail: "The log is now a pulse monitor for the whole campaign, not just a dump of old text lines.",
        stats: [
          ["Entries", state.log.length],
          ["Latest", state.log[0]?.category || "general"],
          ["Night", state.log.filter((entry) => entry.category === "night").length],
          ["Radio", state.log.filter((entry) => entry.category === "radio").length],
        ],
      };
    case "overview":
    default:
      return {
        label: "Control layer",
        title: "Everything important in one scan",
        detail: "Overview should immediately show pressure, next best action, route state, and what the shelter is becoming.",
        stats: [
          ["Lanes", getAvailableScavengeSources(state).length],
          ["Builds", readyUpgrades.length],
          ["Signal", state.story.radioProgress],
          ["Crew", `${state.survivors.total}/${derived.survivorCap}`],
        ],
      };
  }
}

export function renderTabStage(state, derived, bodyMarkup) {
  const meta = tabStageMeta(state, derived);
  return `
    <div class="tab-stage tab-stage-${state.ui.activeTab}">
      <section class="stage-banner">
        <div class="stage-copy">
          <span class="note-label">${meta.label}</span>
          <h2>${meta.title}</h2>
          <p class="note">${meta.detail}</p>
        </div>
        <div class="stage-stat-strip">
          ${meta.stats.map(([label, value]) => `
            <div class="stage-stat">
              <span>${label}</span>
              <strong>${value}</strong>
            </div>
          `).join("")}
        </div>
      </section>
      ${bodyMarkup}
    </div>
  `;
}

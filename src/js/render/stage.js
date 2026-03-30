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
import { renderTutorialBanner } from "./shared.js";
import { getLeaderboardSnapshot, getLeaderboardState } from "../services/leaderboard.js";

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
    case "player":
      return {
        label: "Field profile",
        title: "What you can carry into the dark",
        detail: "Your weapon, armor, tools, and survival profile in one place.",
        stats: [
          ["Attack", derived.attack],
          ["Defense", derived.defense],
          ["Condition", state.resources.condition],
          ["Ammo", state.resources.ammo],
        ],
      };
    case "craft":
      return {
        label: "Build queue",
        title: "Convert salvage into systems",
        detail: "Ready systems first. Blocked ones define the next hunt.",
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
        detail: "Loadout, kit, and strange salvage in one clean read.",
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
        detail: "Warmth, threat, noise, and food decide whether the room holds.",
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
        detail: "Compound footprint, live systems, and damage in one board.",
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
        detail: "Pick a zone, set an objective, choose a route, then pay for it.",
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
        detail: "Roster, traits, and staffing pressure all matter now.",
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
        detail: "Choose a signal track and force it to give up routes and truth.",
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
        detail: "Open a channel. Buy only what solves the next pressure point.",
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
        detail: "Permanent alignment. Real gains, real costs.",
        stats: [
          ["Aligned", state.faction.aligned || "none"],
          ["Rep", state.resources.reputation],
          ["Signal", state.story.radioProgress],
          ["Relics", state.resources.relics],
        ],
      };
    case "leaderboard": {
      const board = getLeaderboardState();
      const snapshot = getLeaderboardSnapshot(state);
      return {
        label: "Hosted board",
        title: "Measure this run against the wasteland",
        detail: "Username, hosted ranks, current score, and save transfer all live here.",
        stats: [
          ["Score", snapshot.summary.score],
          ["Stage", snapshot.summary.stage],
          ["Entries", board.entries.length || "empty"],
          ["Sync", board.enabled ? "hosted" : "offline"],
        ],
      };
    }
    case "log":
      return {
        label: "Archive",
        title: "Track what the static has already taken",
        detail: "Pulse, archive, and recent feed.",
        stats: [
          ["Entries", state.log.length],
          ["Latest", state.log[0]?.category || "general"],
          ["Night", state.log.filter((entry) => entry.category === "night").length],
          ["Radio", state.log.filter((entry) => entry.category === "radio").length],
        ],
      };
    case "help":
      return {
        label: "Field guide",
        title: "Learn the loop without drowning in text",
        detail: "Use Help when you need orientation, not constant hand-holding.",
        stats: [
          ["Guided", state.settings.tutorialHints ? "yes" : "no"],
          ["Username", state.player.username || "unset"],
          ["Routes", state.stats.expeditions],
          ["Signal", state.story.radioProgress],
        ],
      };
    case "settings":
      return {
        label: "Preferences",
        title: "Tune the run to your taste",
        detail: "Settings control onboarding, motion, stage copy, and reset safety.",
        stats: [
          ["Tutorial", state.settings.tutorialHints ? "on" : "off"],
          ["Motion", state.settings.reducedMotion ? "reduced" : "full"],
          ["Copy", state.settings.briefStageCopy ? "brief" : "full"],
          ["Reset", state.settings.confirmReset ? "confirm" : "instant"],
        ],
      };
    case "overview":
    default:
      return {
        label: "Control layer",
        title: "Everything important in one scan",
        detail: "Pressure, next action, route state, and growth in one scan.",
        stats: [
          ["Lanes", getAvailableScavengeSources(state).length],
          ["Builds", readyUpgrades.length],
          ["Signal", state.story.radioProgress],
          ["Crew", `${state.survivors.total}/${derived.survivorCap}`],
        ],
      };
  }
}

export function renderTabStage(state, derived, bodyMarkup, isMobile = false) {
  const meta = tabStageMeta(state, derived);
  const visibleStats = isMobile ? meta.stats.slice(0, 2) : meta.stats;
  return `
    <div class="tab-stage tab-stage-${state.ui.activeTab}">
      <section class="stage-banner ${isMobile ? "stage-banner-mobile" : ""}">
        <div class="stage-copy">
          <span class="note-label">${meta.label}</span>
          <h2>${meta.title}</h2>
          ${isMobile
            ? `
              <details class="mobile-stage-info">
                <summary>Info</summary>
                <p class="note">${meta.detail}</p>
              </details>
            `
            : state.settings.briefStageCopy ? "" : `<p class="note">${meta.detail}</p>`}
        </div>
        <div class="stage-stat-strip">
          ${visibleStats.map(([label, value]) => `
            <div class="stage-stat">
              <span>${label}</span>
              <strong>${value}</strong>
            </div>
          `).join("")}
        </div>
      </section>
      ${renderTutorialBanner(state)}
      ${bodyMarkup}
    </div>
  `;
}

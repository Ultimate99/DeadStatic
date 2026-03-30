import { getActiveWorkJob, getNightForecast } from "../engine.js";
import { renderTutorialBanner } from "./shared.js";

function stageMeta(state, derived) {
  const activeJob = getActiveWorkJob(state);
  const forecast = getNightForecast(state);

  switch (state.ui.activeTab) {
    case "survivor":
      return {
        eyebrow: "Field profile",
        title: state.player.username || "Unnamed Survivor",
        detail: "Loadout, carried kit, and combat condition.",
        stats: [
          ["Attack", derived.attack],
          ["Defense", derived.defense],
          ["Carry", state.equipped.backpack ? "packed" : "light"],
        ],
      };
    case "workshop":
      return {
        eyebrow: "Production board",
        title: activeJob ? activeJob.label : "Workshop",
        detail: activeJob ? `${activeJob.hoursRemaining}h left. ${activeJob.kind}.` : "One queue. Build the shelter or craft the gear.",
        stats: [
          ["Queue", activeJob ? `${activeJob.hoursRemaining}h` : "idle"],
          ["Plans", state.upgrades.length],
          ["Tools", Object.keys(state.inventory).filter((itemId) => itemId.includes("_kit") || itemId.includes("drill") || itemId.includes("meter") || itemId.includes("bar") || itemId.includes("hatchet") || itemId.includes("hammer")).length],
        ],
      };
    case "base":
      return {
        eyebrow: "Compound board",
        title: "Shelter layout",
        detail: state.ui.pendingPlacementStructureId ? "Placement mode armed. Choose a valid tile." : "Place and inspect shelter modules on the board.",
        stats: [
          ["Warmth", state.shelter.warmth.toFixed(1)],
          ["Threat", state.shelter.threat.toFixed(1)],
          ["Noise", state.shelter.noise.toFixed(1)],
        ],
      };
    case "routes":
      return {
        eyebrow: "Route staging",
        title: "Routes",
        detail: "Choose the next push, objective, and risk.",
        stats: [
          ["Zones", state.unlockedZones.length],
          ["Runs", state.stats.expeditions],
          ["Food", state.resources.food],
        ],
      };
    case "radio":
      return {
        eyebrow: "Receiver board",
        title: "Radio",
        detail: "Trace the signal without starving the shelter.",
        stats: [
          ["Signal", state.story.radioProgress],
          ["Secret", state.story.secretProgress],
          ["Fuel", state.resources.fuel],
        ],
      };
    case "crew":
      return {
        eyebrow: "Shelter roster",
        title: "Crew",
        detail: "Assignments, wounds, stress, and capacity.",
        stats: [
          ["Total", state.survivors.total],
          ["Idle", state.survivors.idle],
          ["Cap", derived.survivorCap],
        ],
      };
    case "leaderboard":
      return {
        eyebrow: "Hosted board",
        title: "Leaderboard",
        detail: "Public rank, current score, and save transfer.",
        stats: [
          ["Score", state.stats.searches + state.stats.expeditions + state.stats.nightsSurvived],
          ["User", state.player.username || "unset"],
          ["Signal", state.story.radioProgress],
        ],
      };
    case "log":
      return {
        eyebrow: "Archive",
        title: "Log",
        detail: "Recent events, patch notes, and run history.",
        stats: [
          ["Entries", state.log.length],
          ["Night", state.stats.nightsSurvived],
          ["Combat", state.stats.combatsWon],
        ],
      };
    case "help":
      return {
        eyebrow: "Field guide",
        title: "Help",
        detail: "Compact guidance for the first run and beyond.",
        stats: [
          ["Hints", state.settings.tutorialHints ? "on" : "off"],
          ["User", state.player.username || "unset"],
          ["Clock", `${state.time.day}/${String(state.time.hour).padStart(2, "0")}:00`],
        ],
      };
    case "settings":
      return {
        eyebrow: "Preferences",
        title: "Settings",
        detail: "Tune the run, then get back to the shelter.",
        stats: [
          ["Motion", state.settings.reducedMotion ? "reduced" : "full"],
          ["Copy", state.settings.briefStageCopy ? "brief" : "full"],
          ["Reset", state.settings.confirmReset ? "confirm" : "direct"],
        ],
      };
    case "ops":
    default:
      return {
        eyebrow: "Command deck",
        title: "Ops",
        detail: forecast.siege
          ? "Siege pressure is building. Hold the base."
          : "Directive, routes, queue, and shelter pressure in one scan.",
        stats: [
          ["Day", state.time.day],
          ["Night", forecast.siege ? "siege" : "watch"],
          ["Queue", activeJob ? `${activeJob.hoursRemaining}h` : "idle"],
        ],
      };
  }
}

export function renderTabStage(state, derived, bodyMarkup, isMobile = false) {
  const meta = stageMeta(state, derived);
  const stats = isMobile ? meta.stats.slice(0, 2) : meta.stats;

  return `
    <div class="tab-stage tab-stage-${state.ui.activeTab}">
      <section class="tab-stage-head">
        <div class="tab-stage-copy">
          <span class="note-label">${meta.eyebrow}</span>
          <h2>${meta.title}</h2>
          ${isMobile ? "" : `<p class="note">${meta.detail}</p>`}
        </div>
        <div class="tab-stage-stats">
          ${stats.map(([label, value]) => `
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

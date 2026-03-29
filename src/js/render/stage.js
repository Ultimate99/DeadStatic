import {
  canAfford,
  getAvailableScavengeSources,
  getExpeditionPreview,
  getStructureDamage,
  getVisibleUpgrades,
  hasMaterials,
} from "../engine.js";
import { getLeaderboardSnapshot, getLeaderboardState } from "../services/leaderboard.js";
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
        icon: "MK",
        title: "Convert salvage into systems",
        cues: ["install ready", "track blockers"],
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
        icon: "KT",
        title: "Everything you can still carry",
        cues: ["gear", "supplies", "odd salvage"],
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
        icon: "HT",
        title: "Hold the room through another night",
        cues: ["warmth", "defense", "pressure"],
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
        icon: "MP",
        title: "Read the outpost like a living machine",
        cues: ["footprint", "damage", "expansion"],
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
        icon: "RT",
        title: "Stage the next push before you leave",
        cues: ["travel", "risk", "cost"],
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
        icon: "CR",
        title: "Every body in the shelter changes the equation",
        cues: ["staff", "idle hands", "pressure"],
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
        icon: "RX",
        title: "The static is no longer background noise",
        cues: ["scan", "trace", "decode"],
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
        icon: "TR",
        title: "What the wasteland will still trade for",
        cues: ["trade", "restock", "flip shortages"],
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
        icon: "FX",
        title: "Choose who gets to shape the signal",
        cues: ["choose", "lock in", "keep leverage"],
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
        icon: "LG",
        title: "Track what the static has already taken",
        cues: ["history", "pulse", "recent"],
        stats: [
          ["Entries", state.log.length],
          ["Latest", state.log[0]?.category || "general"],
          ["Night", state.log.filter((entry) => entry.category === "night").length],
          ["Radio", state.log.filter((entry) => entry.category === "radio").length],
        ],
      };
    case "leaderboard": {
      const leaderboardState = getLeaderboardState();
      const leaderboardSnapshot = getLeaderboardSnapshot(state);
      return {
        label: "Hosted board",
        icon: "LB",
        title: "Track the strongest runs online",
        cues: ["rank", "submit", "sync"],
        stats: [
          ["Score", leaderboardSnapshot.summary.score],
          ["Ranks", leaderboardState.entries.length],
          ["Day", state.time.day],
          ["Signal", state.story.radioProgress],
          ["Stage", leaderboardSnapshot.summary.stage],
        ],
      };
    }
    case "overview":
    default:
      return {
        label: "Control layer",
        icon: "OV",
        title: "Everything important in one scan",
        cues: ["pressure", "next move", "growth"],
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
          <div class="stage-titleline">
            <span class="stage-icon" aria-hidden="true">${meta.icon || meta.label.slice(0, 2).toUpperCase()}</span>
            <div>
              <span class="note-label">${meta.label}</span>
              <h2>${meta.title}</h2>
            </div>
          </div>
          ${meta.cues?.length ? `<div class="chip-row stage-cues">${meta.cues.map((cue) => `<span class="chip">${cue}</span>`).join("")}</div>` : ""}
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

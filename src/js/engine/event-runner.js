import { EVENTS } from "../events/index.js";
import { addLog, applyEffectBundle, markEventSeen, requirementsMet } from "./shared.js";

function eventAvailable(state, event, pool) {
  if (event.pool !== pool) {
    return false;
  }
  if (event.once && state.seenEvents.includes(event.id)) {
    return false;
  }
  return requirementsMet(state, event.requires);
}

function pickWeightedEvent(state, pool) {
  const candidates = EVENTS.filter((event) => eventAvailable(state, event, pool));
  if (!candidates.length) {
    return null;
  }

  const totalWeight = candidates.reduce((sum, event) => sum + (event.weight || 1), 0);
  let roll = Math.random() * totalWeight;
  for (const event of candidates) {
    roll -= event.weight || 1;
    if (roll <= 0) {
      return event;
    }
  }
  return candidates[candidates.length - 1];
}

function eventCategory(pool, event) {
  return event.category
    || (pool.startsWith("travel") ? "expedition"
      : pool.startsWith("zone:") ? "expedition"
        : pool === "radio" ? "radio"
          : pool === "night" ? "night"
            : pool === "food" ? "loot"
              : pool === "search" ? "loot"
                : "general");
}

export function runEvent(state, pool) {
  const event = pickWeightedEvent(state, pool);
  if (!event) {
    return null;
  }

  markEventSeen(state, event.id);
  applyEffectBundle(state, event.effects);
  addLog(state, event.text, eventCategory(pool, event));
  return event;
}

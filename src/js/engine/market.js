import { FACTIONS_BY_ID, TRADER_OFFERS } from "../content/index.js";
import { addLog, addResource, applyEffectBundle, canAfford, evaluateProgression, spendResources } from "./shared.js";
import { randInt } from "./utils.js";

function offerAvailable(state, offer) {
  if (offer.cost.relics && state.story.radioProgress < 2) {
    return false;
  }
  if (offer.id === "rifle_cache" && !state.unlockedSections.includes("trader")) {
    return false;
  }
  return true;
}

export function refreshTraderOffers(state) {
  const pool = TRADER_OFFERS.filter((offer) => offerAvailable(state, offer));
  const picks = [];
  const remaining = [...pool];
  while (remaining.length && picks.length < 3) {
    const index = randInt(0, remaining.length - 1);
    picks.push(remaining.splice(index, 1)[0].id);
  }
  state.trader.offers = picks;
  state.stats.traderRefreshes += 1;
  addLog(state, "A trader signal answers. Prices arrive before footsteps.", "trade");
  return true;
}

export function buyTraderOffer(state, offerId) {
  const offer = TRADER_OFFERS.find((candidate) => candidate.id === offerId);
  if (!offer || !state.trader.offers.includes(offerId) || !canAfford(state, offer.cost)) {
    return false;
  }

  spendResources(state, offer.cost);
  applyEffectBundle(state, offer.reward);
  state.trader.offers = state.trader.offers.filter((id) => id !== offerId);
  addLog(state, `Trade made: ${offer.name}.`, "trade");
  evaluateProgression(state);
  return true;
}

export function chooseFaction(state, factionId) {
  if (state.faction.aligned || !FACTIONS_BY_ID[factionId]) {
    return false;
  }

  state.faction.aligned = factionId;
  addResource(state, "reputation", 4);
  addLog(state, `You align with ${FACTIONS_BY_ID[factionId].name}. The city starts answering differently.`, "radio");
  return true;
}

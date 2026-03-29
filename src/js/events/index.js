/* Generated during architecture split. */
import { SEARCH_EVENTS } from "./search.js";
import { FOOD_EVENTS } from "./food.js";
import { TRAVEL_EVENTS } from "./travel.js";
import { NIGHT_EVENTS } from "./night.js";
import { RADIO_EVENTS } from "./radio.js";
import { ZONE_EVENTS } from "./zone.js";

export { SEARCH_EVENTS, FOOD_EVENTS, TRAVEL_EVENTS, NIGHT_EVENTS, RADIO_EVENTS, ZONE_EVENTS };

export const EVENTS = [
  ...SEARCH_EVENTS,
  ...FOOD_EVENTS,
  ...TRAVEL_EVENTS,
  ...NIGHT_EVENTS,
  ...RADIO_EVENTS,
  ...ZONE_EVENTS,
];

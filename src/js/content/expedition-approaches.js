/* Generated during architecture split. */
export const EXPEDITION_APPROACHES = [
  {
    "id": "cautious",
    "label": "Cautious",
    "short": "quiet route",
    "description": "Move slow, skip bad angles, and bring enough to wait things out.",
    "cost": {
      "food": 1,
      "water": 1
    },
    "hours": 1,
    "encounterDelta": -0.14,
    "lootBonus": -0.08,
    "threat": 0.16,
    "noise": 0.22,
    "travelEventChance": 0.28
  },
  {
    "id": "standard",
    "label": "Standard",
    "short": "balanced route",
    "description": "The middle path. Not elegant. Usually survivable.",
    "cost": {},
    "hours": 0,
    "encounterDelta": 0,
    "lootBonus": 0,
    "threat": 0.34,
    "noise": 0.48,
    "travelEventChance": 0.38
  },
  {
    "id": "forced",
    "label": "Forced",
    "short": "fast and loud",
    "description": "Push hard, break locks, and accept that everything hears you.",
    "cost": {
      "water": 1,
      "fuel": 1,
      "ammo": 1
    },
    "hours": -1,
    "encounterDelta": 0.13,
    "lootBonus": 0.16,
    "threat": 0.64,
    "noise": 0.98,
    "travelEventChance": 0.52
  }
];

export const EXPEDITION_APPROACHES_BY_ID = Object.fromEntries(EXPEDITION_APPROACHES.map((approach) => [approach.id, approach]));

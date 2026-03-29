/* Generated during architecture split. */
export const FOOD_EVENTS = [
  {
    "id": "food_cellar_jar",
    "pool": "food",
    "weight": 8,
    "text": "Behind a broken cabinet: preserved vegetables gone soft but not hostile.",
    "effects": {
      "resources": {
        "food": 2
      }
    }
  },
  {
    "id": "food_rat_run",
    "pool": "food",
    "weight": 6,
    "text": "You corner a rat and lose some dignity catching dinner.",
    "effects": {
      "resources": {
        "food": 2
      },
      "condition": -2
    }
  },
  {
    "id": "food_rooftop_greens",
    "pool": "food",
    "weight": 4,
    "text": "Someone once grew herbs on a roof. Something still grows there.",
    "effects": {
      "resources": {
        "food": 1,
        "morale": 1
      }
    }
  },
  {
    "id": "food_mold_bin",
    "pool": "food",
    "weight": 4,
    "text": "A whole crate, ruined except for one sealed corner.",
    "effects": {
      "resources": {
        "food": 1,
        "morale": -1
      }
    }
  }
];

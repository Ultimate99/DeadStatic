/* Generated during architecture split. */
export const FACTIONS = [
  {
    "id": "signal_hunters",
    "name": "Signal Hunters",
    "description": "Patient scavengers of towers, frequencies, and truths.",
    "bonuses": [
      "More fuel and parts over time",
      "Deeper radio scan quality"
    ],
    "effects": {
      "passive": {
        "parts": 0.04,
        "fuel": 0.04
      },
      "radioDepth": 0.5
    }
  },
  {
    "id": "iron_lantern",
    "name": "Iron Lantern",
    "description": "Militant keepers of lit ground and strict borders.",
    "bonuses": [
      "More defense and reputation",
      "Stronger front-line combat"
    ],
    "effects": {
      "defense": 2,
      "attack": 1,
      "passive": {
        "reputation": 0.04
      }
    }
  },
  {
    "id": "ash_marauders",
    "name": "Ash Marauders",
    "description": "Mobile opportunists with a market ethic and bad manners.",
    "bonuses": [
      "Better expedition loot",
      "Harder hits in close quarters"
    ],
    "effects": {
      "expeditionLootBonus": 0.15,
      "attack": 1,
      "passive": {
        "scrap": 0.05
      }
    }
  }
];

export const FACTIONS_BY_ID = Object.fromEntries(FACTIONS.map((faction) => [faction.id, faction]));

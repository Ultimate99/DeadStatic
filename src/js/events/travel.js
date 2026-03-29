/* Generated during architecture split. */
export const TRAVEL_EVENTS = [
  {
    "id": "travel_cautious_drain",
    "pool": "travel:cautious",
    "weight": 6,
    "text": "You wait out movement in a stairwell and arrive later, but not noticed.",
    "effects": {
      "condition": 1
    }
  },
  {
    "id": "travel_cautious_cache",
    "pool": "travel:cautious",
    "weight": 4,
    "text": "Moving slow lets you spot a tucked-away service locker on the way.",
    "effects": {
      "resources": {
        "parts": 1,
        "water": 1
      },
      "discoverResources": [
        "parts",
        "water"
      ]
    }
  },
  {
    "id": "travel_standard_detour",
    "pool": "travel:standard",
    "weight": 6,
    "text": "A collapsed stairwell forces a detour through old offices and scattered files.",
    "effects": {
      "resources": {
        "cloth": 1,
        "scrap": 1
      },
      "discoverResources": [
        "cloth"
      ]
    }
  },
  {
    "id": "travel_standard_standoff",
    "pool": "travel:standard",
    "weight": 4,
    "text": "You freeze while something sniffs the air two rooms away, then move when it loses interest.",
    "effects": {
      "condition": -1
    }
  },
  {
    "id": "travel_forced_break",
    "pool": "travel:forced",
    "weight": 6,
    "text": "You smash a chain latch to save time. The echo buys speed and future problems.",
    "effects": {
      "resources": {
        "scrap": 1
      },
      "condition": -2
    }
  },
  {
    "id": "travel_forced_score",
    "pool": "travel:forced",
    "weight": 4,
    "text": "The loud route pays once: an exposed supply crate left where caution would miss it.",
    "effects": {
      "resources": {
        "ammo": 1,
        "parts": 1
      },
      "discoverResources": [
        "ammo",
        "parts"
      ]
    }
  }
];

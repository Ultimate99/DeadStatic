/* Generated during architecture split. */
export const NIGHT_EVENTS = [
  {
    "id": "night_first",
    "pool": "night",
    "weight": 10,
    "once": true,
    "text": "First night. Every scrape outside sounds deliberate.",
    "effects": {
      "condition": -5,
      "resources": {
        "morale": -1
      },
      "setFlags": {
        "firstNightResolved": true
      }
    }
  },
  {
    "id": "night_boards_hold",
    "pool": "night",
    "weight": 7,
    "text": "Something tests the barricade, then loses interest or patience.",
    "effects": {
      "condition": 2
    }
  },
  {
    "id": "night_fingers_under_door",
    "pool": "night",
    "weight": 6,
    "text": "Fingers feel along the gap under the door. You don't breathe until dawn.",
    "effects": {
      "condition": -3,
      "resources": {
        "morale": -1
      }
    }
  },
  {
    "id": "night_warm_embers",
    "pool": "night",
    "weight": 5,
    "requires": {
      "upgrades": [
        "campfire"
      ]
    },
    "text": "The fire burns low and steady. For one hour, the world stays outside.",
    "effects": {
      "condition": 3,
      "resources": {
        "morale": 1
      }
    }
  },
  {
    "id": "night_raider_shadow",
    "pool": "night",
    "weight": 4,
    "requires": {
      "day": 5
    },
    "text": "A lantern flash, hushed swearing, boots fading into alleys. Raiders are testing routes.",
    "effects": {
      "resources": {
        "reputation": 1
      },
      "secretProgress": 1
    }
  },
  {
    "id": "night_choir_dream",
    "pool": "night",
    "weight": 3,
    "requires": {
      "radioProgress": 3
    },
    "text": "You dream in station IDs and wake with your teeth aching.",
    "effects": {
      "condition": -2,
      "radioProgress": 1
    }
  }
];

/* Generated during architecture split. */
export const RADIO_EVENTS = [
  {
    "id": "radio_numbers_station",
    "pool": "radio",
    "weight": 9,
    "once": true,
    "text": "A calm voice counts down to an evacuation that never came.",
    "effects": {
      "radioProgress": 1,
      "resources": {
        "reputation": 1
      },
      "unlockSections": [
        "radio"
      ]
    }
  },
  {
    "id": "radio_drowned_dispatch",
    "pool": "radio",
    "weight": 8,
    "once": true,
    "text": "A waterlogged dispatch mentions maintenance routes beneath the city.",
    "effects": {
      "radioProgress": 1,
      "unlockZones": [
        "flooded_tunnel"
      ]
    }
  },
  {
    "id": "radio_hospital_page",
    "pool": "radio",
    "weight": 7,
    "once": true,
    "text": "An endless hospital page repeats a wing number long after staff stopped answering.",
    "effects": {
      "radioProgress": 1,
      "unlockZones": [
        "hospital_wing"
      ]
    }
  },
  {
    "id": "radio_tower_offer",
    "pool": "radio",
    "weight": 6,
    "once": true,
    "text": "A clipped transmission offers safe passage near the tower in exchange for 'cooperation'.",
    "effects": {
      "radioProgress": 1,
      "unlockZones": [
        "radio_tower_perimeter"
      ],
      "unlockSections": [
        "factions"
      ]
    }
  },
  {
    "id": "radio_lantern_market",
    "pool": "radio",
    "weight": 6,
    "once": true,
    "text": "A trader signal bursts through: three tones, a price, and the smell of kerosene in your head.",
    "effects": {
      "radioProgress": 1,
      "unlockSections": [
        "trader"
      ]
    }
  },
  {
    "id": "radio_orchard",
    "pool": "radio",
    "weight": 4,
    "requires": {
      "radioProgress": 4
    },
    "once": true,
    "text": "A child whispers directions to a place called the Glass Orchard, then laughs when you repeat it back.",
    "effects": {
      "secretProgress": 1,
      "unlockZones": [
        "glass_orchard"
      ]
    }
  },
  {
    "id": "radio_bunker_breath",
    "pool": "radio",
    "weight": 4,
    "requires": {
      "radioProgress": 4,
      "items": [
        "relay_key"
      ]
    },
    "once": true,
    "text": "A sealed channel opens for half a second. Air pumps. Concrete. Someone says 'breach team'.",
    "effects": {
      "secretProgress": 1,
      "unlockZones": [
        "hidden_bunker_entrance"
      ]
    }
  },
  {
    "id": "radio_dead_static",
    "pool": "radio",
    "weight": 2,
    "requires": {
      "secretProgress": 3,
      "items": [
        "bunker_pass"
      ]
    },
    "once": true,
    "text": "The pattern resolves: the static was never random. It was a command layer talking through the dead.",
    "effects": {
      "radioProgress": 2,
      "secretProgress": 1,
      "setFlags": {
        "worldReveal": true
      }
    }
  }
];

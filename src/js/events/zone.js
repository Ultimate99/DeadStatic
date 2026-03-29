/* Generated during architecture split. */
export const ZONE_EVENTS = [
  {
    "id": "zone_ruined_bus",
    "pool": "zone:ruined_street",
    "weight": 6,
    "text": "Inside a crushed bus, someone left a toolkit under the driver's seat.",
    "effects": {
      "resources": {
        "parts": 2
      }
    }
  },
  {
    "id": "zone_ruined_market",
    "pool": "zone:ruined_street",
    "weight": 4,
    "text": "A shattered market stall still has beans sealed behind warped metal.",
    "effects": {
      "grantItems": {
        "canned_beans": 1
      }
    }
  },
  {
    "id": "zone_apartment_note",
    "pool": "zone:burned_apartments",
    "weight": 5,
    "text": "A soot-black family note says the noise came before the bite.",
    "effects": {
      "resources": {
        "morale": 1
      },
      "radioProgress": 1
    }
  },
  {
    "id": "zone_apartment_cache",
    "pool": "zone:burned_apartments",
    "weight": 5,
    "text": "A bathtub cache gives up medicine and a dry roll of bandages.",
    "effects": {
      "resources": {
        "medicine": 1
      },
      "grantItems": {
        "bandage_roll": 1
      }
    }
  },
  {
    "id": "zone_gas_siphon",
    "pool": "zone:abandoned_gas_station",
    "weight": 6,
    "text": "You find a tank with enough fumes left to count.",
    "effects": {
      "resources": {
        "fuel": 2
      }
    }
  },
  {
    "id": "zone_gas_trader_mark",
    "pool": "zone:abandoned_gas_station",
    "weight": 4,
    "text": "Someone marked the wall with lantern symbols and a price code.",
    "effects": {
      "resources": {
        "reputation": 1
      },
      "unlockSections": [
        "trader"
      ]
    }
  },
  {
    "id": "zone_tunnel_case",
    "pool": "zone:flooded_tunnel",
    "weight": 5,
    "text": "A waterproof case is wedged in the concrete seam.",
    "effects": {
      "resources": {
        "ammo": 2,
        "parts": 1
      },
      "discoverResources": [
        "ammo"
      ]
    }
  },
  {
    "id": "zone_tunnel_key",
    "pool": "zone:flooded_tunnel",
    "weight": 4,
    "once": true,
    "text": "Behind a service hatch: a relay key in an oilskin pouch.",
    "effects": {
      "grantItems": {
        "relay_key": 1
      },
      "secretProgress": 1
    }
  },
  {
    "id": "zone_hospital_archive",
    "pool": "zone:hospital_wing",
    "weight": 5,
    "text": "Triage logs mention patients responding to frequencies before symptoms.",
    "effects": {
      "resources": {
        "medicine": 2,
        "chemicals": 1
      },
      "radioProgress": 1,
      "discoverResources": [
        "chemicals"
      ]
    }
  },
  {
    "id": "zone_hospital_crash_cart",
    "pool": "zone:hospital_wing",
    "weight": 4,
    "text": "A crash cart still rolls. So does your luck.",
    "effects": {
      "resources": {
        "medicine": 1,
        "chemicals": 1
      },
      "discoverResources": [
        "chemicals"
      ],
      "grantItems": {
        "bandage_roll": 1
      }
    }
  },
  {
    "id": "zone_tower_scope",
    "pool": "zone:radio_tower_perimeter",
    "weight": 5,
    "text": "A sniper nest overlooks streets you have already learned the hard way.",
    "effects": {
      "grantItems": {
        "tower_rifle": 1
      },
      "resources": {
        "reputation": 1
      }
    }
  },
  {
    "id": "zone_tower_field",
    "pool": "zone:radio_tower_perimeter",
    "weight": 4,
    "text": "The fence hum becomes words when you stand too close to it.",
    "effects": {
      "secretProgress": 1,
      "resources": {
        "relics": 1
      }
    }
  },
  {
    "id": "zone_orchard_reflection",
    "pool": "zone:glass_orchard",
    "weight": 6,
    "text": "Every glass tree shows you somewhere else in the city, all at once.",
    "effects": {
      "resources": {
        "relics": 1,
        "morale": 1
      },
      "grantItems": {
        "odd_relic": 1
      }
    }
  },
  {
    "id": "zone_bunker_door",
    "pool": "zone:hidden_bunker_entrance",
    "weight": 5,
    "once": true,
    "text": "The concrete door opens a hand's width and exhales cold filtered air.",
    "effects": {
      "grantItems": {
        "bunker_pass": 1
      },
      "secretProgress": 1
    }
  },
  {
    "id": "zone_bunker_truth",
    "pool": "zone:hidden_bunker_entrance",
    "weight": 3,
    "once": true,
    "requires": {
      "items": [
        "bunker_pass"
      ]
    },
    "text": "Inside, a dead operations wall shows the project name: DEAD STATIC. Signal suppression. Crowd obedience. Outbreak contingency.",
    "effects": {
      "setFlags": {
        "worldReveal": true
      },
      "radioProgress": 2,
      "secretProgress": 1,
      "unlockZones": [
        "glass_orchard"
      ]
    }
  }
];
